import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import cloudinary from "@/lib/cloudinary";
import { logAdminAction } from "@/utils/backend/system";
import { verifyAdmin, createErrorResponse } from "@/utils/backend/auth";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "0");
        const draft = searchParams.get("draft");

        const query: Record<string, unknown> = {};
        if (draft !== null) {
            query.draft = draft === "true";
        }

        const projects = await Project.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);

        return NextResponse.json({
            success: true,
            message: "Projects fetched successfully",
            result: projects,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching projects:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Server error while fetching projects" },
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
        const techstackStr = formData.get("techstack") as string;
        const gitlink = formData.get("gitlink") as string;
        const demoLink = formData.get("demoLink") as string;
        const role = formData.get("role") as string;
        const outcome = formData.get("outcome") as string;
        const timeline = formData.get("timeline") as string;
        const otherLinkStr = formData.get("otherLink") as string;
        const descriptionStr = formData.get("description") as string;
        const shortDescription = formData.get("shortDescription") as string;
        const draftStr = formData.get("draft") as string;
        const file = formData.get("image") as File | null;

        let imageUrl = "";
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
            imageUrl = result.secure_url;
        }

        const techstack = techstackStr ? JSON.parse(techstackStr) : [];
        const otherLink = otherLinkStr ? JSON.parse(otherLinkStr) : [];
        const description = descriptionStr ? JSON.parse(descriptionStr) : [];
        const draft = draftStr === "true";

        const data = {
            name,
            image: imageUrl,
            techstack,
            gitlink,
            demoLink,
            role,
            outcome,
            timeline,
            otherLink,
            description,
            shortDescription,
            draft,
        };

        const project = await Project.create(data);
        await logAdminAction("created_project", name);

        return NextResponse.json(
            { success: true, message: "Project created successfully", result: project },
            { status: 201 }
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error adding project:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Server error while adding project", error: errorMessage },
            { status: 500 }
        );
    }
}
