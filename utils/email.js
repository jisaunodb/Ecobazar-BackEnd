const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    // port: 587,
    secure: false,
    auth: {
    user: 'mdjisaun86@gmail.com',
    // pass: "fcyofdgbwfevnbjl"
    pass: "qxnm jtgl nhrd mggf"
    },
})

let mailverification = async (token,email)=>{
    try {
        const info = await transporter.sendMail({
        from: 'mdjisaun86@gmail.com', // sender address
        to: email, // list of recipients
        subject: "please verify your", // subject line
        html: `<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden"><tr><td style="background:#2ecc71;padding:20px;text-align:center;color:#fff;font-size:24px;font-weight:700">🌿 Ecobazar</td></tr><tr><td style="padding:30px;color:#333"><h2 style="margin-top:0">Verify Your Email</h2><p>Hi user,</p><p>Thank you for signing up with<strong>Ecobazar</strong>. Please confirm your email address by clicking the button below:</p><p style="text-align:center;margin:30px 0"><a href="http://localhost:5173/verifyemail/${token}" style="background:#2ecc71;color:#fff;padding:12px 25px;text-decoration:none;border-radius:5px;font-weight:700">Verify Email</a></p><p>This link will expire in 24 hours for security reasons.</p><p>If you did not create this account, you can ignore this email.</p><p>Best regards,<br>Ecobazar Team</p></td></tr><tr><td style="background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777">© 2026 Ecobazar. All rights reserved.</td></tr></table></td></tr></table></body>`, // HTML body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}

let resetpasswordMail = async (token,email)=>{
    try {
        const info = await transporter.sendMail({
        from: 'mdjisaun86@gmail.com', // sender address
        to: email, // list of recipients
        subject: "Please Reset Your Password", // subject line
        html: `<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden"><tr><td style="background:#e74c3c;padding:20px;text-align:center;color:#fff;font-size:24px;font-weight:700">🔒 Ecobazar</td></tr><tr><td style="padding:30px;color:#333"><h2 style="margin-top:0">Reset Your Password</h2><p>Hi user,</p><p>We received a request to reset your <strong>Ecobazar</strong> account password. Click the button below to create a new password.</p><p style="text-align:center;margin:30px 0"><a href="http://localhost:5173/resetpassword/${token}" style="background:#e74c3c;color:#fff;padding:12px 25px;text-decoration:none;border-radius:5px;font-weight:700;display:inline-block">Reset Password</a></p><p>This password reset link will expire in 15 minutes for security reasons.</p><p>If you did not request a password reset, you can safely ignore this email.</p><p>Best regards,<br>Ecobazar Team</p></td></tr><tr><td style="background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777">© 2026 Ecobazar. All rights reserved.</td></tr></table></td></tr></table></body>`, // HTML body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}

module.exports ={mailverification,resetpasswordMail}