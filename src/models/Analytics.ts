import mongoose, { Schema, Document } from "mongoose";

export interface IAnalytics extends Document {
    type: "view" | "interaction";
    category: string;
    subCategory?: string;
    event?: string;
    metadata: {
        device?: "desktop" | "tablet" | "mobile";
        browser?: string;
        os?: string;
    };
    duration: number;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AnalyticsSchema: Schema = new Schema(
    {
        type: {
            type: String,
            enum: ["view", "interaction"],
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        subCategory: {
            type: String,
        },
        event: {
            type: String,
        },
        metadata: {
            device: {
                type: String,
                enum: ["desktop", "tablet", "mobile"],
            },
            browser: String,
            os: String,
        },
        duration: {
            type: Number,
            default: 0,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

AnalyticsSchema.index({ timestamp: -1 });
AnalyticsSchema.index({ type: 1, category: 1 });

const Analytics =
    mongoose.models.Analytics ||
    mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);

export default Analytics;
