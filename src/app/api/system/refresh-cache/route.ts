import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SystemSettings from "@/models/SystemSettings";
import AdminLog from "@/models/AdminLog";
import { verifyAdmin, createErrorResponse } from "@/utils/backend/auth";

export async function POST(req: NextRequest) {
    try {
        const auth = verifyAdmin(req);
        if (auth.error) {
            return createErrorResponse(auth.error, auth.status!);
        }

        await connectDB();

        await SystemSettings.findOneAndUpdate(
            {},
            {
                lastCacheRefreshAt: new Date(),
            },
            { upsert: true }
        );

        await AdminLog.create({
            actionType: "refreshed_cache",
            entityAffected: "all_cache",
        });

        return NextResponse.json({
            success: true,
            message: "Cache refreshed successfully",
            lastCacheRefreshAt: new Date(),
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error refreshing cache:", errorMessage);
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
        );
    }
}
