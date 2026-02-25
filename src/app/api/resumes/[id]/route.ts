import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import cloudinary from "@/lib/cloudinary";
import { logAdminAction } from "@/utils/backend/system";
import { verifyAdmin, createErrorResponse } from "@/utils/backend/auth";

type RouteParams = { params: { id: string } };

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        await connectDB();
        const { id } = params;

        const resume = await Resume.findById(id);

        if (!resume) {
            return NextResponse.json(
                { success: false, message: "Resume not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Resume fetched successfully",
            result: resume,
        });
    } catch (error: any) {
        console.error("Error fetching resume:", error.message);
        return NextResponse.json(
            { success: false, message: "Server error while fetching resume" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
    try {
        const auth = verifyAdmin(req);
        if (auth.error) {
            return createErrorResponse(auth.error, auth.status!);
        }

        await connectDB();
        const { id } = params;

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const type = formData.get("type") as "file" | "link";
        const url = formData.get("url") as string;
        const isActiveStr = formData.get("isActive") as string;
        const file = formData.get("resume") as File | null;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (type) updateData.type = type;
        if (url) updateData.url = url;

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
            updateData.url = result.secure_url;
        }

        if (isActiveStr !== null) {
            const isActive = isActiveStr === "true";
            if (isActive) {
                await Resume.updateMany({ _id: { $ne: id } }, { isActive: false });
                updateData.isActive = true;
            } else {
                updateData.isActive = false;
            }
        }

        const updatedResume = await Resume.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!updatedResume) {
            return NextResponse.json(
                { success: false, message: "Resume not found" },
                { status: 404 }
            );
        }

        await logAdminAction("updated_resume", updatedResume.name);

        return NextResponse.json({
            success: true,
            message: "Resume updated successfully",
            result: updatedResume,
        });
    } catch (error: any) {
        console.error("Error updating resume:", error);
        return NextResponse.json(
            { success: false, message: "Server error while updating resume", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    try {
        const auth = verifyAdmin(req);
        if (auth.error) {
            return createErrorResponse(auth.error, auth.status!);
        }

        await connectDB();
        const { id } = params;

        const resume = await Resume.findByIdAndDelete(id);

        if (!resume) {
            return NextResponse.json(
                { success: false, message: "Resume not found" },
                { status: 404 }
            );
        }

        await logAdminAction("deleted_resume", resume.name);

        return NextResponse.json({
            success: true,
            message: "Resume deleted successfully",
        });
    } catch (error: any) {
        console.error("Error deleting resume:", error.message);
        return NextResponse.json(
            { success: false, message: "Server error while deleting resume" },
            { status: 500 }
        );
    }
}
