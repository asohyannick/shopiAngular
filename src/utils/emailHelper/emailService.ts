import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth:{
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
    },
});

export const sendEmail = async(to: string, subject: string, text: string) => {
const mailOptions = {
    from: process.env.SMTP_USER as string,
    to,
    subject,
    text,
};
try {
    await transporter.sendMail(mailOptions);
    console.log(`Email is sent to ${to}`);
} catch (error) {
    console.error(`Something went wrong: ${error}`);
}
}
