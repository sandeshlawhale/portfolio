import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import cloudinary from "@/lib/cloudinary";
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
            .sort({ featured: -1, createdAt: -1 })
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
            { success: false, message: "Server error while fetching projects", error: errorMessage },
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
        const shortDescription = formData.get("shortDescription") as string;
        const category = formData.get("category") as string;
        const draftStr = formData.get("draft") as string;
        const featuredStr = formData.get("featured") as string;
        const file = formData.get("image") as File | null;

        // Description parsing (string or array)
        let description = "";
        const rawDescription = formData.get("description") as string;
        if (rawDescription) {
            try {
                const parsed = JSON.parse(rawDescription);
                if (Array.isArray(parsed)) {
                    description = parsed.join("");
                } else {
                    description = parsed;
                }
            } catch {
                description = rawDescription;
            }
        }

        // TechStack parsing
        const techStackStr = (formData.get("techStack") || formData.get("techstack")) as string;
        const techStack = techStackStr ? JSON.parse(techStackStr) : [];

        // QuickInfo parsing
        const quickInfoStr = formData.get("quickInfo") as string;
        let quickInfo = quickInfoStr ? JSON.parse(quickInfoStr) : {};
        if (!quickInfoStr) {
            quickInfo = {
                role: (formData.get("role") || "") as string,
                date: (formData.get("timeline") || formData.get("date") || "") as string,
                team: (formData.get("team") || "Solo") as string,
                company: (formData.get("company") || "") as string,
                status: (formData.get("status") || "Completed") as string,
            };
        }

        // Links parsing
        const linksStr = formData.get("links") as string;
        let links = linksStr ? JSON.parse(linksStr) : {};
        if (!linksStr) {
            links = {
                github: (formData.get("gitlink") || formData.get("github") || "") as string,
                live: (formData.get("demoLink") || formData.get("live") || "") as string,
                other: formData.get("otherLink") ? JSON.parse(formData.get("otherLink") as string) : [],
            };
        }

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

        const draft = draftStr === "true";
        const featured = featuredStr === "true";

        const data = {
            name,
            image: imageUrl,
            shortDescription,
            description,
            techStack,
            featured,
            draft,
            category,
            quickInfo,
            links,
        };

        const project = await Project.create(data);

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
