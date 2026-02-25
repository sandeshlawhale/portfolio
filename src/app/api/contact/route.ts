import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const { data, error } = await resend.emails.send({
            from: "portfolio@resend.dev",
            to: process.env.ADMIN_EMAIL || "sandeshlawhale@gmail.com",
            subject: `[Portfolio] New Message from ${name}`,
            html: `<div style="background-color:#f6f9fc;padding:40px 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
                    <div style="padding:15px;">
                        <div style="border-radius:6px;margin-bottom:20px;">
                        <p style="margin:0 0 8px 0;font-size:14px;">
                            <strong>Name:</strong> ${name}
                        </p>
                        <p style="margin:0 0 8px 0;font-size:14px;">
                            <strong>Email:</strong> ${email}
                        </p>
                        <p style="margin:0;font-size:14px;">
                            <strong>Received:</strong> ${new Date().toLocaleString()}
                        </p>
                        </div>
                        <div>
                        <p style="margin:0 0 4px 0;font-weight:600;color:#111827;font-size:14px;">
                            Message
                        </p>
                        <div style="background:#ffffff;border:1px solid #e5e7eb;padding:10px;border-radius:6px;font-size:14px;color:#374151;white-space:pre-wrap;">${message}</div>
                        </div>
                    </div>
                    <div style="background:#f9fafb;padding:10px 10px;text-align:center;font-size:12px;color:#9ca3af;">
                        © ${new Date().getFullYear()} Sandesh Lawhale — Portfolio Contact System
                    </div>
                    </div>
                </div>`,
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json(
                { success: false, message: "Failed to send email" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Email sent successfully!", data },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Contact API error:", error.message);
        return NextResponse.json(
            { success: false, message: "Server error during contact form submission" },
            { status: 500 }
        );
    }
}
