import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail({ to, subject, html, text }) {
    try {
        console.log("Attempting to send email to:", to);

        const { data, error } = await resend.emails.send({
            from: "BAT-AI <onboarding@resend.dev>",
            to: [to],
            subject,
            html,
            text
        });

        if (error) {
            console.error("Resend email error:", error);
            throw new Error(error.message);
        }

        console.log("Email sent successfully!");
        console.log("Email ID:", data.id);

        return data;

    } catch (error) {
        console.error("Email sending failed:", error.message);
        throw error;
    }
}