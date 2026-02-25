import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import cloudinary from "@/lib/cloudinary";
import { logAdminAction } from "@/utils/backend/system";
import { verifyAdmin, createErrorResponse } from "@/utils/backend/auth";

type RouteParams = { params: Promise<{ projectId: string }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        await connectDB();
        const { projectId } = await params;

        const project = await Project.findById(projectId);

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Project fetched successfully",
            result: project,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching project:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Server error while fetching project" },
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
        const { projectId } = await params;

        const formData = await req.formData();
        const file = formData.get("image") as File | null;

        const updateData: Record<string, unknown> = {};
        formData.forEach((value, key) => {
            if (key !== "image") {
                try {
                    // Attempt to parse JSON strings for arrays and objects
                    updateData[key] = JSON.parse(value as string);
                } catch {
                    updateData[key] = value;
                }
            }
        });

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
            updateData.image = result.secure_url;
        }

        const updatedProject = await Project.findByIdAndUpdate(projectId, updateData, {
            new: true,
        });

        if (!updatedProject) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        await logAdminAction("updated_project", updatedProject.name);

        return NextResponse.json({
            success: true,
            message: "Project updated successfully",
            result: updatedProject,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error updating project:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Server error while updating project", error: errorMessage },
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
        const { projectId } = await params;

        const project = await Project.findByIdAndDelete(projectId);

        if (!project) {
            return NextResponse.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        await logAdminAction("deleted_project", project.name);

        return NextResponse.json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error deleting project:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Server error while deleting project" },
            { status: 500 }
        );
    }
}
