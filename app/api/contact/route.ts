import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { name, email, phone, subject, message, screenshot } = await req.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "ghosh2002pritam@gmail.com";
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        // Fallback for development/testing if .env variables are not yet loaded
        if (!emailUser || !emailPass) {
            console.warn("=== [MAIL DRY RUN LOG] ===");
            console.warn("Mailer credentials not found in .env file.");
            console.warn("Logging message details to server console instead:");
            console.warn("Sender Name:", name);
            console.warn("Sender Email:", email);
            console.warn("Sender Phone:", phone || "Not Provided");
            console.warn("Subject:", subject);
            console.warn("Message Body:", message);
            console.warn("Screenshot attached:", !!screenshot);
            console.warn("Recipient:", receiverEmail);
            console.warn("==========================");

            return NextResponse.json({ 
                success: true, 
                message: "Your message has been received! (Dry-run logged on server console due to unconfigured EMAIL_USER/EMAIL_PASS)" 
            }, { status: 200 });
        }

        // Parse screenshot base64 attachments if present
        const attachments = [];
        if (screenshot && screenshot.startsWith("data:")) {
            const commaIdx = screenshot.indexOf(",");
            if (commaIdx !== -1) {
                const base64Data = screenshot.substring(commaIdx + 1);
                // Extract MIME type to guess file extension (e.g. data:image/png;base64)
                const semiIdx = screenshot.indexOf(";");
                let ext = "png";
                if (semiIdx !== -1) {
                    const mimeType = screenshot.substring(5, semiIdx);
                    ext = mimeType.split("/")[1] || "png";
                }
                
                attachments.push({
                    filename: `screenshot.${ext}`,
                    content: base64Data,
                    encoding: 'base64'
                });
            }
        }

        // Configure nodemailer SMTP transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });

        // Set up the email format and headers
        const mailOptions: any = {
            from: `"${name}" <${emailUser}>`,
            replyTo: email,
            to: receiverEmail,
            subject: `[BSPNWS Contact Page] ${subject}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 25px;">
                        <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">New Message Received</h2>
                        <p style="color: #10b981; font-weight: 700; margin: 6px 0 0 0; text-transform: uppercase; font-size: 11px; letter-spacing: 0.15em;">Burdwan Sadar Pyara Nutrition Welfare Society</p>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: 700; width: 130px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Sender Name:</td>
                                <td style="padding: 10px 0; color: #0f172a; font-weight: 600; font-size: 14px;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Sender Email:</td>
                                <td style="padding: 10px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${email}" style="color: #10b981; text-decoration: none; font-weight: 600;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Phone Number:</td>
                                <td style="padding: 10px 0; color: #0f172a; font-weight: 600; font-size: 14px;">${phone || "Not Provided"}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Subject:</td>
                                <td style="padding: 10px 0; color: #0f172a; font-weight: 700; font-size: 14px;">${subject}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                        <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Message Body:</h4>
                        <p style="margin: 0; color: #334155; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">${message}</p>
                    </div>
                    
                    ${attachments.length > 0 ? `
                    <div style="margin-bottom: 25px; padding: 10px 0; color: #10b981; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">
                        📎 Screenshot Attachment Attached to this Email
                    </div>
                    ` : ""}

                    <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 11px; color: #94a3b8; font-weight: 500;">
                        This email was automatically generated and sent from the BSPNWS website contact portal.
                    </div>
                </div>
            `,
        };

        if (attachments.length > 0) {
            mailOptions.attachments = attachments;
        }

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Your message has been sent successfully!" }, { status: 200 });
    } catch (error: any) {
        console.error("Nodemailer email dispatch error:", error);
        return NextResponse.json({ error: error.message || "Failed to dispatch email" }, { status: 500 });
    }
}
