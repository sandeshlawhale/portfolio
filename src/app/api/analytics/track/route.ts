import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Analytics from "@/models/Analytics";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        if (!body) {
            return NextResponse.json(
                { success: false, message: "Request body is missing" },
                { status: 400 }
            );
        }

        const { type, category, subCategory, event, metadata, duration } = body;

        const newEvent = await Analytics.create({
            type,
            category,
            subCategory,
            event,
            metadata,
            duration: duration || 0,
        });

        return NextResponse.json(
            { success: true, result: newEvent },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error tracking event:", error.message);
        return NextResponse.json(
            { success: false, message: "Failed to track event", error: error.message },
            { status: 500 }
        );
    }
}
