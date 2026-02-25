import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

export async function GET() {
    try {
        await connectDB();
        const activeResume = await Resume.findOne({ isActive: true });
        return NextResponse.json({
            success: true,
            message: "Active resume fetched successfully",
            result: activeResume,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching active resume:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Server error while fetching active resume" },
            { status: 500 }
        );
    }
}
