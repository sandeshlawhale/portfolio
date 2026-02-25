import mongoose, { Schema, Document } from "mongoose";

export interface ISystemSettings extends Document {
    lastContentUpdate: Date;
    frontendVersion: string;
    environment: "development" | "staging" | "production";
    lastCacheRefreshAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const SystemSettingsSchema: Schema = new Schema(
    {
        lastContentUpdate: {
            type: Date,
            default: Date.now,
        },
        frontendVersion: {
            type: String,
            default: "1.0.0",
        },
        environment: {
            type: String,
            enum: ["development", "staging", "production"],
            default: process.env.NODE_ENV || "development",
        },
        lastCacheRefreshAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const SystemSettings =
    mongoose.models.SystemSettings ||
    mongoose.model<ISystemSettings>("SystemSettings", SystemSettingsSchema);

export default SystemSettings;
