import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { name, gender, age, address, cause, phone, email, dietitianName } = await req.json();

        // Validate required fields
        if (!name || !gender || !age || !address || !cause || !phone || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "ghosh2002pritam@gmail.com";
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        // Fallback for development/testing if .env variables are not yet loaded
        if (!emailUser || !emailPass) {
            console.warn("=== [CONSULTATION MAIL DRY RUN LOG] ===");
            console.warn("Mailer credentials not found in .env file.");
            console.warn("Logging consultation details to server console instead:");
            console.warn("Patient Name:", name);
            console.warn("Gender:", gender);
            console.warn("Age:", age);
            console.warn("Address:", address);
            console.warn("Cause of Consultation:", cause);
            console.warn("Contact Number:", phone);
            console.warn("Gmail/Email:", email);
            console.warn("Selected Dietitian:", dietitianName || "Not Specified");
            console.warn("Recipient:", receiverEmail);
            console.warn("=======================================");

            return NextResponse.json({ 
                success: true, 
                message: "We will connect you within 15days through mail" 
            }, { status: 200 });
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
        const mailOptions = {
            from: `"${name} (Consultation)" <${emailUser}>`,
            replyTo: email,
            to: receiverEmail,
            subject: `[BSPNWS Consultation Booking] Request from ${name}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 25px;">
                        <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">New Consultation Request</h2>
                        <p style="color: #10b981; font-weight: 700; margin: 6px 0 0 0; text-transform: uppercase; font-size: 11px; letter-spacing: 0.15em;">Burdwan Sadar Pyara Nutrition Welfare Society</p>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            ${dietitianName ? `
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: 700; width: 180px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Target Dietitian:</td>
                                <td style="padding: 10px 0; color: #0f172a; font-weight: 700; font-size: 15px; color: #10b981;">${dietitianName}</td>
                            </tr>
                            ` : ""}
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: 700; width: 180px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Patient Name:</td>
                                <td style="padding: 10px 0; color: #0f172a; font-weight: 600; font-size: 14px;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Gender:</td>
                                <td style="padding: 10px 0; color: #0f172a; font-weight: 600; font-size: 14px;">${gender}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Age:</td>
                                <td style="padding: 10px 0; color: #0f172a; font-weight: 600; font-size: 14px;">${age} years</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Contact Number:</td>
                                <td style="padding: 10px 0; color: #0f172a; font-weight: 600; font-size: 14px;">${phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Gmail/Email:</td>
                                <td style="padding: 10px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${email}" style="color: #10b981; text-decoration: none; font-weight: 600;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #64748b; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Address:</td>
                                <td style="padding: 10px 0; color: #334155; font-size: 14px; line-height: 1.5;">${address}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                        <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Cause of Consultation:</h4>
                        <p style="margin: 0; color: #334155; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">${cause}</p>
                    </div>

                    <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 11px; color: #94a3b8; font-weight: 500;">
                        This email was automatically generated and sent from the BSPNWS website dietitian booking portal.
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ 
            success: true, 
            message: "We will connect you within 15days through mail" 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Consultation booking API error:", error);
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred during submission." }, 
            { status: 500 }
        );
    }
}
