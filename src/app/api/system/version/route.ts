import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SystemSettings from "@/models/SystemSettings";
import { verifyAdmin, createErrorResponse } from "@/utils/backend/auth";

export async function POST(req: NextRequest) {
    try {
        const auth = verifyAdmin(req);
        if (auth.error) {
            return createErrorResponse(auth.error, auth.status!);
        }

        await connectDB();
        const { version } = await req.json();

        // Auth validation would go here

        await SystemSettings.findOneAndUpdate(
            {},
            { frontendVersion: version },
            { upsert: true }
        );

        return NextResponse.json({ success: true, message: "Version updated" });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching version:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Failed to fetch version" },
            { status: 500 }
        );
    }
}
