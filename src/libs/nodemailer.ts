import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD
    }
});

export const sendResetPasswordEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:5173/reset-password/${token}`;
    
    const mailOptions = {
        from: `"Haloa App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset Password Link',
        html: `
            <h2>Reset Password</h2>
            <p>Hi ${email},</p>
            <p>Please click the link below to reset your password, and please don't share this link to anyone.</p>
            <button><a href="${resetLink}" target="_blank" style="text-decoration: none; color: white; background-color: #007bff; hover: background-color: #0056b3; font-weight: bold; padding: 10px 20px; border-radius: 5px;">Reset Password</a></button>
            <p>This link will expire in 1 hour.</p>
            <p>This message is automatically sent by the system, if you did not request a password reset, please ignore this email.</p>
            <p>Regards,</p>
            <p>Haloa App Team</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};