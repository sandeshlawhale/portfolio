import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign({ user: "admin" }, process.env.JWT_SECRET!, {
                expiresIn: "1d",
            });
            return NextResponse.json({ token });
        }

        return NextResponse.json(
            { success: false, msg: "Invalid credentials" },
            { status: 401 }
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Login error:", errorMessage);
        return NextResponse.json(
            { success: false, msg: "Server error during login" },
            { status: 500 }
        );
    }
}
