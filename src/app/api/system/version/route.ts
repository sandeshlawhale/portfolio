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
    } catch (error: any) {
        console.error("Error updating system version:", error.message);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
