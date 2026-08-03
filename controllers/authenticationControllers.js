
const { mailverification, resetpasswordMail } = require("../utils/email")
const User = require('../models/Usermodel')
const jwt = require('jsonwebtoken')
const { empyfieldvalidation } = require("../utils/validation")
const tokenGenerator = require("../utils/tokenGenerator")
const existingData = require("../utils/existingData")
const bcrypt = require('bcrypt');
let registratinController = async (req,res)=>{
    const{email,password,confirmPassword,name,phoneNumber,role} = req.body


   let users = await existingData(res,{email: email})

   if (users){
    return res.send({
        success: false,
        message: "User allready exist"
    })
   }

    // if(!terms){
    //    return res.send({
    //     success: false,
    //     message: "please accecpt our terms and condition"
    // })
    // }



    empyfieldvalidation(res,email,password,confirmPassword)

    if(password !== confirmPassword){
        return res.send({
            success: false,
            message : "password not matched"
        })
    }

    const hash = bcrypt.hashSync(password, 10);



    let newUser = new User ({
        email: email,
        password: hash,
        phoneNumber:phoneNumber,
        name: name,
        role: role || 'user'
    })
   await newUser.save()

//    token generate

    //  let token = jwt.sign({
    //     id:newUser._id,
    //     email: newUser.email
    // },process.env.ACCESSE_TOKEN_SWCRET,{
    //     expiresIn: '1d'
    // })

  let token =  tokenGenerator({
        id:newUser._id,
        email: newUser.email
    },process.env.ACCESSE_TOKEN_SWCRET,"1d")

    // email Verification


    mailverification(token,email)




    res.send({
        success: true,
        message: "Registration Successfull, Please Check Your Email For Verification"
    })

}

let loginController = async (req,res) =>{
    const{email,password} = req.body


   let users = await User.findOne({email:email})

   if (!users){
    return res.send({
        success: false,
        message: "User Not Found"
    })
   }

   empyfieldvalidation(res,email,password)

    let passwords =  bcrypt.compareSync(password, users.password)
   if(!passwords){
        return res.send({
            success: false,
            message:"Invalid Credential"

        })
   }

   let token = tokenGenerator({
    id: users._id,
    email: users.email
},process.env.ACCESSE_TOKEN_SWCRET,"1d")

   delete users[-password]
   res.send({
    success: true,
    message: "login successfull",
    token: token,
    data: {
        _id: users._id,
        name: users.name,
        email: users.email,
        isVarified: users.isVarified,
        role: users.role,
        ishold: users.ishold,
    }
})
}

let forgotpasswordController = async (req,res) =>{
    let {email} = req.body

    empyfieldvalidation(res,email)
     let users = await User.findOne({email: email})

   if (!users){
    return res.send({
        success: false,
        message: "User Not Found"
    })
   }

   let token =  tokenGenerator({
        id:users._id,
        email: users.email
    },process.env.ACCESSE_TOKEN_SWCRET,"1d")

    // email Verification


    resetpasswordMail(token,email)


    res.send({
        success: true,
        message: "Please check your email"
    })
}

let resetpasswordController = async(req,res)=>{

    let {newPassword,confirmPassword}= req.body
    let {token} = req.params



    if(newPassword !== confirmPassword){
        return res.send({
            success: false,
            message:"confirm password not matched"
        })
    }

     jwt.verify(token, process.env.ACCESSE_TOKEN_SWCRET, async function(err, decoded) {

        console.log(decoded);

        if(err){
            res.send({
                success: false,
                message: "unauthorized"
            })
        }else{
              const hash = bcrypt.hashSync(newPassword, 10);
              const updatedata = await User.findByIdAndUpdate(decoded.id,{password: hash},{new : true})

              if(!updatedata){
                        return res.send({
                            success: false,
                            message: "User not found"
                        })
                    }
              res.send({
                success: true,
                message: "Password Updated"
            })
        }
    });

}

let resendVarificationEamilCOntroller = async (req,res)=>{

    let {email} = req.body
    let user = await User.findOne({email: email})

    let token =  tokenGenerator({
        id:user._id,
        email: user.email
    },process.env.ACCESSE_TOKEN_SWCRET,"1d")

         mailverification(token,email)

         res.send({
            success: true,
            message: "check you email for varification"
        })

}

let verifyemailController = async (req,res) =>{
    const {token} = req.params

     jwt.verify(token, process.env.ACCESSE_TOKEN_SWCRET, async function(err, decoded){
        if(err){
            res.send({
                success: false,
                message: "unathorized"
            })
        }else{
            const UserId = decoded.id

            let findUser = await User.findById(UserId)

            if(findUser.isVarified){
                return res.send({
                    success: false,
                    message: "User allready verified"
                })
            }else{
                findUser.isVarified = true
               await findUser.save()
                res.send({
                    success: true,
                    message: "Email verified successfully Done"
                })
            }
        }
     })
}


let changePasswordController = async (req, res) => {

    let { currentPassword, newPassword, confirmPassword } = req.body
    let { token } = req.params

    if (newPassword !== confirmPassword) {
        return res.send({
            success: false,
            message: "confirm password not matched"
        })
    }

    jwt.verify(token, process.env.ACCESSE_TOKEN_SWCRET, async function (err, decoded) {

        if (err) {
            return res.send({
                success: false,
                message: "unauthorized"
            })
        }

        let user = await User.findById(decoded.id)

        if (!user) {
            return res.send({
                success: false,
                message: "User not found"
            })
        }

        let isMatch = bcrypt.compareSync(currentPassword, user.password)

        if (!isMatch) {
            return res.send({
                success: false,
                message: "Current password is incorrect"
            })
        }

        const hash = bcrypt.hashSync(newPassword, 10);
        const updatedata = await User.findByIdAndUpdate(decoded.id, { password: hash }, { new: true })

        if (!updatedata) {
            return res.send({
                success: false,
                message: "User not found"
            })
        }

        res.send({
            success: true,
            message: "Password Updated"
        })
    });

}


module.exports = {registratinController,loginController,forgotpasswordController,resetpasswordController,resendVarificationEamilCOntroller,verifyemailController,changePasswordController}