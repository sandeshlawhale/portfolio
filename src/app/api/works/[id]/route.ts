import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Work from "@/models/Work";
import cloudinary from "@/lib/cloudinary";
import { logAdminAction } from "@/utils/backend/system";
import { verifyAdmin, createErrorResponse } from "@/utils/backend/auth";

type RouteParams = { params: { id: string } };

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        await connectDB();
        const { id } = params;

        const work = await Work.findById(id);

        if (!work) {
            return NextResponse.json(
                { success: false, message: "Work not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Work fetched successfully",
            result: work,
        });
    } catch (error: any) {
        console.error("Error fetching work:", error.message);
        return NextResponse.json(
            { success: false, message: "Server error while fetching work" },
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

        const existingWork = await Work.findById(id);
        if (!existingWork) {
            return NextResponse.json(
                { success: false, message: "Work not found" },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("logo") as File | null;

        let logoUrl = existingWork.company.logo;
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const result: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: "image" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });
            logoUrl = result.secure_url;
        }

        const companyName = formData.get("companyName") as string || existingWork.company.name;
        const companyWebsite = formData.get("companyWebsite") as string || existingWork.company.website;
        const role = formData.get("role") as string || existingWork.role;
        const status = formData.get("status") as string || existingWork.status;
        const locationType = formData.get("locationType") as string || existingWork.location.type;
        const city = formData.get("city") as string || existingWork.location.city;
        const startDate = formData.get("startDate") as string || existingWork.duration.start;
        const endDate = formData.get("endDate") as string || existingWork.duration.end;
        const technologiesStr = formData.get("technologies") as string;
        const responsibilitiesStr = formData.get("responsibilities") as string;

        const technologies = technologiesStr ? JSON.parse(technologiesStr) : existingWork.technologies;
        const responsibilities = responsibilitiesStr ? JSON.parse(responsibilitiesStr) : existingWork.responsibilities;

        const updatedWork = await Work.findByIdAndUpdate(
            id,
            {
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
            },
            { new: true }
        );

        await logAdminAction("updated_work", companyName);

        return NextResponse.json({
            success: true,
            message: "Work updated successfully",
            result: updatedWork,
        });
    } catch (error: any) {
        console.error("Error updating work:", error);
        return NextResponse.json(
            { success: false, message: "Server error while updating work", error: error.message },
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

        const work = await Work.findByIdAndDelete(id);

        if (!work) {
            return NextResponse.json(
                { success: false, message: "Work not found" },
                { status: 404 }
            );
        }

        await logAdminAction("deleted_work", work.company.name);

        return NextResponse.json({
            success: true,
            message: "Work deleted successfully",
        });
    } catch (error: any) {
        console.error("Error deleting work:", error.message);
        return NextResponse.json(
            { success: false, message: "Server error while deleting work" },
            { status: 500 }
        );
    }
}
