import mongoose, { Schema, Document } from "mongoose";

export interface IResume extends Document {
    name: string;
    url: string;
    type: "file" | "link";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["file", "link"],
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Resume = mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);

export default Resume;
