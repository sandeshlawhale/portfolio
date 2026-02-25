import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import cloudinary from "@/lib/cloudinary";
import { logAdminAction } from "@/utils/backend/system";
import { verifyAdmin, createErrorResponse } from "@/utils/backend/auth";

export async function GET() {
    try {
        await connectDB();
        const resumes = await Resume.find({}).sort({ createdAt: -1 });
        return NextResponse.json({
            success: true,
            message: "Resumes fetched successfully",
            result: resumes,
        });
    } catch (error: any) {
        console.error("Error fetching resumes:", error.message);
        return NextResponse.json(
            { success: false, message: "Server error while fetching resumes" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = verifyAdmin(req);
        if (auth.error) {
            return createErrorResponse(auth.error, auth.status!);
        }

        await connectDB();

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const type = formData.get("type") as "file" | "link";
        const url = formData.get("url") as string;
        const isActiveStr = formData.get("isActive") as string;
        const isActive = isActiveStr === "true";
        const file = formData.get("resume") as File | null;

        let resumeUrl = url;

        if (type === "file" && file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const result: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: "raw" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
            resumeUrl = result.secure_url;
        }

        if (isActive) {
            await Resume.updateMany({}, { isActive: false });
        }

        const newResume = await Resume.create({
            name,
            url: resumeUrl,
            type,
            isActive,
        });

        await logAdminAction("added_resume", name);

        return NextResponse.json(
            { success: true, message: "Resume added successfully", result: newResume },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error adding resume:", error);
        return NextResponse.json(
            { success: false, message: "Server error while adding resume", error: error.message },
            { status: 500 }
        );
    }
}
