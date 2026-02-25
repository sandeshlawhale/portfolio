import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const verifyAdmin = (req: NextRequest) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { error: "No token provided", status: 401 };
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { user: string };

        if (decoded.user !== "admin") {
            return { error: "Not authorized user!", status: 403 };
        }

        return { decoded, authorized: true };
    } catch (err) {
        return { error: "Token invalid or expired", status: 401 };
    }
};

export const createErrorResponse = (error: string, status: number) => {
    return NextResponse.json({ success: false, message: error }, { status });
};
