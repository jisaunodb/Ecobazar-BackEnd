require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const dbconfig = require('./config/dbconfig')
const User = require('./models/Usermodel')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
// middleware

app.use(express.json())
app.use(cors())

// database config
dbconfig()

app.post('/registration', async (req,res)=>{
    const{email,password,confirmPassword,terms} = req.body

    let existingUser = await User.findOne({email: email})
    if(existingUser){
       return res.send({massage : "User allready existing"})
    }

    if(!terms){
       return res.send({message: "please accecpt our terms and condition"})
    }

    if(!email || !password || !confirmPassword){
       return res.send({
            message: "please fill all the field"
        })
    }

    if(password !== confirmPassword){
        return res.send({message : "password not matched"})
    }



    let newUser = new User ({
        email: email,
        password: password,
        terms: terms
    })
   await newUser.save()

     let token = jwt.sign({
        id:newUser._id,
        email: newUser.email
    },process.env.ACCESSE_TOKEN_SWCRET,{
        expiresIn: '1d'
    })
    // email Verification
        const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
        user: 'mdjisaun86@gmail.com',
        // pass: "fcyofdgbwfevnbjl"
        pass: "fcyo fdgb wfev nbjl"
        },
        });

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




    res.send({message: "Registration Successfull"})

})

let port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server runnig on port ${port}`);

})