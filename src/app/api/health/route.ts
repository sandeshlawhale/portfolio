import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    return NextResponse.json({
        status: "healthy",
        api: "running",
        database: dbStatus,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
}
