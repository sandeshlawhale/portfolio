import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
    name: string;
    image?: string;
    techstack: string[];
    gitlink: string;
    demoLink?: string;
    role: string;
    outcome?: string;
    timeline: string;
    otherLink: {
        title?: string;
        link?: string;
        downloadable?: boolean;
    }[];
    description: any[];
    shortDescription?: string;
    draft: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            trim: true,
        },
        techstack: {
            type: [String],
            required: true,
        },
        gitlink: {
            type: String,
            required: true,
        },
        demoLink: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            required: true,
        },
        outcome: {
            type: String,
            trim: true,
        },
        timeline: {
            type: String,
            required: true,
        },
        otherLink: {
            type: [
                {
                    title: {
                        type: String,
                        trim: true,
                    },
                    link: {
                        type: String,
                        trim: true,
                    },
                    downloadable: {
                        type: Boolean,
                        default: false,
                    },
                },
            ],
        },
        description: {
            type: [Schema.Types.Mixed],
            default: [],
            required: true,
        },
        shortDescription: {
            type: String,
            trim: true,
        },
        draft: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Project =
    mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
