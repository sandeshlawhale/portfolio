import mongoose, { Schema, Document } from "mongoose";

export interface IWork extends Document {
    company: {
        name: string;
        logo?: string;
        website?: string;
    };
    role: string;
    status: string;
    location: {
        type: string;
        city: string;
    };
    duration: {
        start: string;
        end?: string;
    };
    technologies: string[];
    responsibilities: string[];
    createdAt: Date;
    updatedAt: Date;
}

const WorkSchema: Schema = new Schema(
    {
        company: {
            name: { type: String, required: true },
            logo: { type: String },
            website: { type: String },
        },
        role: { type: String, required: true },
        status: { type: String, required: true },
        location: {
            type: { type: String, required: true },
            city: { type: String, required: true },
        },
        duration: {
            start: { type: String, required: true },
            end: { type: String },
        },
        technologies: {
            type: [String],
            required: true,
        },
        responsibilities: {
            type: [String],
            required: true,
        },
    },
    { timestamps: true }
);

const Work = mongoose.models.Work || mongoose.model<IWork>("Work", WorkSchema);

export default Work;
