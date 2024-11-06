import nodemailer from 'nodemailer'
import configs from '../../configs/index.js'

export const sendEmail = async (to, subject, html) => {
    const msg = {
        from: configs.EMAIL_FROM,
        to,
        subject,
        html // Now using the 'html' field for HTML content
    }
    const transport = nodemailer.createTransport({
        host: configs.SMTP_HOST,
        port: configs.SMTP_PORT,
        secure: true, // Use SSL
        auth: {
            user: configs.SMTP_USERNAME,
            pass: configs.SMTP_PASSWORD
        }
    })
    await transport.sendMail(msg)
}

export const sendEmailVerificationLink = async (to, token) => {
    const subject = 'Email Verification Link'
    // replace this url with the link to the verify email page of your front-end app
    const verifyEmailUrl = `${configs.FRONTEND_URL}/verify-email?token=${token}`
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            padding-bottom: 20px;
        }
        .email-header h1 {
            color: #333;
            font-size: 24px;
        }
        .email-body {
            line-height: 1.6;
            color: #555;
        }
        .email-body p {
            margin-bottom: 20px;
        }
        .reset-link {
            display: inline-block;
            background-color: #28a745;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 16px;
            margin-top: 10px;
        }
        .reset-link:hover {
            background-color: #218838;
        }
        .email-footer {
            text-align: center;
            padding-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Verify Your Email</h1>
        </div>
        <div class="email-body">
            <p>Dear user,</p>
            <p>We received a request to verify your email. You can verify your email by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="${verifyEmailUrl}" class="reset-link">Verify Email</a>
            </p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thanks,<br>The Farmershop Team</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2024 Farmershoptechindia. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`

    await sendEmail(to, subject, html)
}
