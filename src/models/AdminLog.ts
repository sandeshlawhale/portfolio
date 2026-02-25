import mongoose, { Schema, Document } from "mongoose";

export interface IAdminLog extends Document {
    actionType: string;
    entityAffected?: string;
    adminId?: string;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AdminLogSchema: Schema = new Schema(
    {
        actionType: {
            type: String,
            required: true,
        },
        entityAffected: {
            type: String,
        },
        adminId: {
            type: String, // Simplified to string since there's no User model in models/
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

AdminLogSchema.index({ timestamp: -1 });

const AdminLog =
    mongoose.models.AdminLog ||
    mongoose.model<IAdminLog>("AdminLog", AdminLogSchema);

export default AdminLog;
