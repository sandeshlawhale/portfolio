import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Work from "@/models/Work";
import cloudinary from "@/lib/cloudinary";
import { logAdminAction } from "@/utils/backend/system";
import { verifyAdmin, createErrorResponse } from "@/utils/backend/auth";

export async function GET() {
    try {
        await connectDB();
        const works = await Work.find({}).sort({ "duration.start": -1 });
        return NextResponse.json({
            success: true,
            message: "Works fetched successfully",
            result: works,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching works:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Server error while fetching works", error: errorMessage },
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
        const companyName = formData.get("companyName") as string;
        const companyWebsite = formData.get("companyWebsite") as string;
        const role = formData.get("role") as string;
        const status = formData.get("status") as string;
        const locationType = formData.get("locationType") as string;
        const city = formData.get("city") as string;
        const startDate = formData.get("startDate") as string;
        const endDate = formData.get("endDate") as string;
        const technologiesStr = formData.get("technologies") as string;
        const responsibilitiesStr = formData.get("responsibilities") as string;
        const file = formData.get("logo") as File | null;

        let logoUrl = "";
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: "image" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as { secure_url: string });
                    }
                ).end(buffer);
            });
            logoUrl = result.secure_url;
        }

        const technologies = technologiesStr ? JSON.parse(technologiesStr) : [];
        const responsibilities = responsibilitiesStr ? JSON.parse(responsibilitiesStr) : [];

        const newWork = await Work.create({
            company: {
                name: companyName,
                logo: logoUrl,
                website: companyWebsite,
            },
            role,
            status,
            location: {
                type: locationType,
                city,
            },
            duration: {
                start: startDate,
                end: endDate || "Present",
            },
            technologies,
            responsibilities,
        });

        await logAdminAction("added_work", companyName);

        return NextResponse.json(
            { success: true, message: "Work added successfully", result: newWork },
            { status: 201 }
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error adding work:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Server error while adding work", error: errorMessage },
            { status: 500 }
        );
    }
}
