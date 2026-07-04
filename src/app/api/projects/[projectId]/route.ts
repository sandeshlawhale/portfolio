import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import cloudinary from "@/lib/cloudinary";
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
        let techStack: unknown = null;
        const quickInfo: Record<string, unknown> = {};
        const links: Record<string, unknown> = {};

        formData.forEach((value, key) => {
            if (key === "image") return;

            let parsedValue: unknown;
            try {
                parsedValue = JSON.parse(value as string);
            } catch {
                parsedValue = value;
            }

            if (key === "techStack" || key === "techstack") {
                techStack = parsedValue;
            } else if (key === "description") {
                updateData.description = Array.isArray(parsedValue) ? parsedValue.join("") : parsedValue;
            } else if (key === "quickInfo") {
                if (parsedValue && typeof parsedValue === "object") {
                    Object.assign(quickInfo, parsedValue);
                }
            } else if (key === "links") {
                if (parsedValue && typeof parsedValue === "object") {
                    Object.assign(links, parsedValue);
                }
            } else if (key === "role") {
                quickInfo.role = parsedValue;
            } else if (key === "timeline" || key === "date") {
                quickInfo.date = parsedValue;
            } else if (key === "team") {
                quickInfo.team = parsedValue;
            } else if (key === "company") {
                quickInfo.company = parsedValue;
            } else if (key === "status") {
                quickInfo.status = parsedValue;
            } else if (key === "gitlink" || key === "github") {
                links.github = parsedValue;
            } else if (key === "demoLink" || key === "live") {
                links.live = parsedValue;
            } else if (key === "otherLink") {
                links.other = Array.isArray(parsedValue)
                    ? (parsedValue as Array<Record<string, string>>).map((item) => ({
                          label: item.title || item.label || "",
                          url: item.link || item.url || "",
                      }))
                    : parsedValue;
            } else {
                updateData[key] = parsedValue;
            }
        });

        if (techStack !== null) {
            updateData.techStack = techStack;
        }
        if (Object.keys(quickInfo).length > 0) {
            // Merge with existing quickInfo if editing partially
            const existing = await Project.findById(projectId);
            updateData.quickInfo = { ...(existing?.quickInfo || {}), ...quickInfo };
        }
        if (Object.keys(links).length > 0) {
            // Merge with existing links if editing partially
            const existing = await Project.findById(projectId);
            updateData.links = { ...(existing?.links || {}), ...links };
        }

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
