import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

transporter.verify()
    .then(() => {
        console.log("Email transporter is ready to send emails");
    })
    .catch((err) => {
        console.error("Email transporter verification failed:", err.message);
    });

export async function sendMail({ to, subject, html, text }) {
    try {
        console.log("Attempting to send email to:", to);

        const mailOptions = {
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text
        };

        const details = await transporter.sendMail(mailOptions);

        console.log("Email sent successfully!");
        console.log("Message ID:", details.messageId);
        console.log("Accepted:", details.accepted);
        console.log("Rejected:", details.rejected);

        return details;

    } catch (error) {
        console.error("Email sending failed:", error.message);
        throw error;
    }
}