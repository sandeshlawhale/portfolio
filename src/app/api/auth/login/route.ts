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
            { success: false, message: "Invalid credentials" },
            { status: 401 }
        );
    } catch (error: any) {
        console.error("Login error:", error.message);
        return NextResponse.json(
            { success: false, message: "Server error during login" },
            { status: 500 }
        );
    }
}
