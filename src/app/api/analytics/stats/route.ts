import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Analytics from "@/models/Analytics";
import { verifyAdmin, createErrorResponse } from "@/utils/backend/auth";

export async function GET(req: NextRequest) {
    try {
        const auth = verifyAdmin(req);
        if (auth.error) {
            return createErrorResponse(auth.error, auth.status!);
        }

        await connectDB();
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get("days") || "7");
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // 1. Overall view counts by category
        const categoryViews = await Analytics.aggregate([
            { $match: { type: "view", timestamp: { $gte: startDate } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ]);

        // 2. Interaction counts by event name
        const interactions = await Analytics.aggregate([
            { $match: { type: "interaction", timestamp: { $gte: startDate } } },
            { $group: { _id: "$event", count: { $sum: 1 } } },
        ]);

        // 3. Device breakdown
        const devices = await Analytics.aggregate([
            {
                $match: {
                    "metadata.device": { $exists: true },
                    timestamp: { $gte: startDate },
                },
            },
            { $group: { _id: "$metadata.device", count: { $sum: 1 } } },
        ]);

        // 4. Time series data for graph (Daily counts)
        const timeSeries = await Analytics.aggregate([
            { $match: { timestamp: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                        category: "$category",
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.date": 1 } },
        ]);

        // 5. Avg Time on Page
        const avgTime = await Analytics.aggregate([
            {
                $match: {
                    type: "view",
                    duration: { $gt: 0 },
                    timestamp: { $gte: startDate },
                },
            },
            { $group: { _id: "$category", avgDuration: { $avg: "$duration" } } },
        ]);

        return NextResponse.json({
            success: true,
            result: {
                categoryViews,
                interactions,
                devices,
                timeSeries,
                avgTime,
            },
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching stats:", errorMessage);
        return NextResponse.json(
            { success: false, message: "Failed to fetch stats", error: errorMessage },
            { status: 500 }
        );
    }
}
