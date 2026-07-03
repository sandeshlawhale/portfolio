import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { verifyAdmin, createErrorResponse } from "@/utils/backend/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
    try {
        const auth = verifyAdmin(req);
        if (auth.error) {
            return createErrorResponse(auth.error, auth.status!);
        }

        await connectDB();
        const { id } = await params;

        const body = await req.json();
        
        const updateData: Record<string, unknown> = {};
        if (body.isActive !== undefined) updateData.isActive = body.isActive;
        if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!updatedTestimonial) {
            return NextResponse.json(
                { success: false, message: "Testimonial not found" },
                { status: 404 }
            );
        }


        return NextResponse.json({
            success: true,
            message: "Testimonial updated successfully",
            result: updatedTestimonial,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error updating testimonial:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Server error while updating testimonial", error: errorMessage },
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
        const { id } = await params;

        const testimonial = await Testimonial.findByIdAndDelete(id);

        if (!testimonial) {
            return NextResponse.json(
                { success: false, message: "Testimonial not found" },
                { status: 404 }
            );
        }


        return NextResponse.json({
            success: true,
            message: "Testimonial deleted successfully",
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error deleting testimonial:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Server error while deleting testimonial" },
            { status: 500 }
        );
    }
}
