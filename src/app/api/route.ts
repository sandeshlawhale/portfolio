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
    } catch (error: any) {
        return NextResponse.json(
            {
                status: "error",
                message: "Database connection failed",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
