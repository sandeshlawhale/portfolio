import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AdminLog from "@/models/AdminLog";
import { verifyAdmin, createErrorResponse } from "@/utils/backend/auth";

export async function GET(req: NextRequest) {
    try {
        const auth = verifyAdmin(req);
        if (auth.error) {
            return createErrorResponse(auth.error, auth.status!);
        }

        await connectDB();

        const logs = await AdminLog.find().sort({ timestamp: -1 }).limit(50);
        return NextResponse.json({
            success: true,
            result: logs,
        });
    } catch (error: any) {
        console.error("Error fetching admin logs:", error.message);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
