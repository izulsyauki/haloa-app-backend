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

export const sendResetPasswordEmail = async (email: string, token: string, name: string) => {
    const resetLink = `http://localhost:5173/reset-password/${token}`;
    
    const mailOptions = {
        from: `"Haloa App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset Password Link',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; background-color: #f7fafc;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; padding: 20px 0;">
                        <h1 style="color: #2d3748; margin: 0;">Reset Your Password</h1>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        <p style="color: #4a5568;">Hi ${name},</p>
                        
                        <p style="color: #4a5568;">We received a request to reset the password for your Haloa App account. Click the button below to proceed:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetLink}" target="_blank" style="background-color: #4299e1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; transition: background-color 0.3s ease;">Reset Password</a>
                        </div>
                        
                        <p style="color: #718096; font-size: 14px;">This link will expire in 1 hour.</p>
                        
                        <p style="color: #718096; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
                        
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                        
                        <div style="text-align: center;">
                            <p style="color: #4a5568; margin: 0;">Best regards,</p>
                            <p style="color: #2d3748; font-weight: bold; margin: 5px 0;">The Haloa App Team</p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <p style="color: #a0aec0; font-size: 12px;">This is an automated email, please do not reply to this message.</p>
                    </div>
                </div>
            </body>
            </html>
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