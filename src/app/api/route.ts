import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json({
            status: "success",
            message: "API WORKING",
            timestamp: new Date().toISOString(),
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error pinging API:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
