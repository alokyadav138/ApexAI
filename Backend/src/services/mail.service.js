import nodemailer from "nodemailer";

const transporter= nodemailer.createTransport({
  service:"gmail",
  auth:{
    type:"OAuth2",
    user:process.env.GOOGLE_USER,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    clientId: process.env.GOOGLE_CLIENT_ID
  }

})

transporter.verify()
     .then(()=> { console.log("Email transporter is ready to send emails");})
     .catch((err)=> {console.error("Email transporter verification failed:",err);
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
