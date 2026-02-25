import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SystemSettings from "@/models/SystemSettings";
import { verifyAdmin, createErrorResponse } from "@/utils/backend/auth";

export async function GET(req: NextRequest) {
    try {
        const auth = verifyAdmin(req);
        if (auth.error) {
            return createErrorResponse(auth.error, auth.status!);
        }

        await connectDB();
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = await SystemSettings.create({});
        }
        return NextResponse.json({
            success: true,
            result: settings,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching system info:", errorMessage);
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
        );
    }
}
