import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import cloudinary from "@/lib/cloudinary";
import { verifyAdmin } from "@/utils/backend/auth";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        
        // Check if requester is admin
        const auth = verifyAdmin(req);
        
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "0");
        
        const query: Record<string, unknown> = {};
        
        // If not authenticated as admin, only fetch active testimonials
        if (auth.error) {
            query.isActive = true;
        }

        const testimonials = await Testimonial.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);

        return NextResponse.json({
            success: true,
            message: "Testimonials fetched successfully",
            result: testimonials,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching testimonials:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Server error while fetching testimonials", error: errorMessage },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const message = formData.get("message") as string;
        const company = formData.get("company") as string;
        const role = formData.get("role") as string;
        const linkedinUrl = formData.get("linkedinUrl") as string;
        const file = formData.get("image") as File | null;

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: "Name, email, and message are required" },
                { status: 400 }
            );
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

        const data = {
            name,
            email,
            message,
            company: company || undefined,
            role: role || undefined,
            linkedinUrl: linkedinUrl || undefined,
            image: imageUrl || undefined,
            isActive: false, // Inactive by default until approved by admin
            isFeatured: false,
        };

        const testimonial = await Testimonial.create(data);

        return NextResponse.json(
            { success: true, message: "Testimonial submitted successfully", result: testimonial },
            { status: 201 }
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error adding testimonial:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Server error while adding testimonial", error: errorMessage },
            { status: 500 }
        );
    }
}
