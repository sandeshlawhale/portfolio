import mongoose, { Schema, Document } from "mongoose";

export interface IOtherLink {
    label: string;
    url: string;
}

export interface IQuickInfo {
    role?: string;
    date?: string;
    team?: string;
    company?: string;
    status?: string;
}

export interface ILinks {
    github?: string;
    live?: string;
    other?: IOtherLink[];
}

export interface IProject extends Document {
    name: string;
    slug?: string;
    image?: string;
    shortDescription?: string;
    description: string; // Rich Text Editor HTML string
    techStack: string[];
    featured?: boolean;
    draft: boolean;
    category?: string;
    quickInfo: IQuickInfo;
    links: ILinks;
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
        slug: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        shortDescription: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            default: "",
        },
        techStack: {
            type: [String],
            required: true,
            default: [],
        },
        featured: {
            type: Boolean,
            default: false,
        },
        draft: {
            type: Boolean,
            default: false,
        },
        category: {
            type: String,
            trim: true,
        },
        quickInfo: {
            role: { type: String, trim: true },
            date: { type: String, trim: true },
            team: { type: String, trim: true },
            company: { type: String, trim: true },
            status: { type: String, trim: true },
        },
        links: {
            github: { type: String, trim: true },
            live: { type: String, trim: true },
            other: [
                {
                    label: { type: String, trim: true },
                    url: { type: String, trim: true },
                }
            ],
        },
    },
    { timestamps: true }
);

// Backward Compatibility Pre-init middleware
ProjectSchema.pre("init", function (rawDoc) {
    if (rawDoc) {
        // Map old techstack -> techStack
        if (rawDoc.techstack && !rawDoc.techStack) {
            rawDoc.techStack = rawDoc.techstack;
        }

        // Map old description (array) -> description (string)
        if (rawDoc.description && Array.isArray(rawDoc.description)) {
            rawDoc.description = rawDoc.description.join("");
        }

        // Map role -> quickInfo.role
        if (rawDoc.role && (!rawDoc.quickInfo || !rawDoc.quickInfo.role)) {
            if (!rawDoc.quickInfo) rawDoc.quickInfo = {};
            rawDoc.quickInfo.role = rawDoc.role;
        }

        // Map timeline -> quickInfo.date
        if (rawDoc.timeline && (!rawDoc.quickInfo || !rawDoc.quickInfo.date)) {
            if (!rawDoc.quickInfo) rawDoc.quickInfo = {};
            rawDoc.quickInfo.date = rawDoc.timeline;
        }

        // Map gitlink -> links.github
        if (rawDoc.gitlink && (!rawDoc.links || !rawDoc.links.github)) {
            if (!rawDoc.links) rawDoc.links = {};
            rawDoc.links.github = rawDoc.gitlink;
        }

        // Map demoLink -> links.live
        if (rawDoc.demoLink && (!rawDoc.links || !rawDoc.links.live)) {
            if (!rawDoc.links) rawDoc.links = {};
            rawDoc.links.live = rawDoc.demoLink;
        }

        // Map otherLink -> links.other
        if (rawDoc.otherLink && Array.isArray(rawDoc.otherLink) && (!rawDoc.links || !rawDoc.links.other)) {
            if (!rawDoc.links) rawDoc.links = {};
            rawDoc.links.other = rawDoc.otherLink.map((item: any) => ({
                label: item.title || "",
                url: item.link || "",
            }));
        }
    }
    return rawDoc;
});

if (mongoose.models.Project) {
    delete mongoose.models.Project;
}

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
