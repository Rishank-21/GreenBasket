import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASS
    },
});

export const sendMail = async (to: string, subject: string, html: string) => {
    try {
        await transporter.sendMail({
            from: `"GreenBasket" <${process.env.EMAIL}>`,
            to : to,
            subject : subject,
            html : html
        });
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};