
const { mailverification, resetpasswordMail } = require("../utils/email")
const User = require('../models/Usermodel')
const jwt = require('jsonwebtoken')
const { empyfieldvalidation } = require("../utils/validation")
const tokenGenerator = require("../utils/tokenGenerator")
const existingData = require("../utils/existingData")
const bcrypt = require('bcrypt');
let registratinController = async (req,res)=>{
    const{email,password,confirmPassword,terms} = req.body


   let users = await existingData(res,{email: email})

   if (users){
    return res.send({message: "User allready exist"})
   }

    if(!terms){
       return res.send({message: "please accecpt our terms and condition"})
    }



    empyfieldvalidation(res,email,password,confirmPassword)

    if(password !== confirmPassword){
        return res.send({message : "password not matched"})
    }

    const hash = bcrypt.hashSync(password, 10);



    let newUser = new User ({
        email: email,
        password: hash,
        terms: terms
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




    res.send({message: "Registration Successfull"})

}

let loginController = async (req,res) =>{
    const{email,password} = req.body


   let users = await User.findOne({email:email})

   if (!users){
    return res.send({message: "User Not Found"})
   }

   empyfieldvalidation(res,email,password)

    let passwords =  bcrypt.compareSync(password, users.password)
   if(!passwords){
        return res.send({message:"Invalid Credential"})
   }

   res.send({message: "login successfull"})
}

let forgotpasswordController = async (req,res) =>{
    let {email} = req.body

    empyfieldvalidation(res,email)
     let users = await User.findOne({email: email})

   if (!users){
    return res.send({message: "User Not Found"})
   }

   let token =  tokenGenerator({
        id:users._id,
        email: users.email
    },process.env.ACCESSE_TOKEN_SWCRET,"1d")

    // email Verification


    resetpasswordMail(token,email)


    res.send({message: "Please check your email"})
}

let resetpasswordController = async(req,res)=>{

    let {newPassword,confirmPassword}= req.body
    let {token} = req.params



    if(newPassword !== confirmPassword){
        return res.send({message:"confirm password not matched"})
    }

     jwt.verify(token, process.env.ACCESSE_TOKEN_SWCRET, async function(err, decoded) {

        console.log(decoded);

        if(err){
            res.send({
                massage: "unauthorized"
            })
        }else{
              const hash = bcrypt.hashSync(newPassword, 10);
              const updatedata = await User.findByIdAndUpdate({_id: decoded.id},{password: hash},{new : true})

              res.send({message: "Password Updated"})
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

         res.send({message: "check you email for varification"})

}

let verifyemailController = async (req,res) =>{
    const {token} = req.params

     jwt.verify(token, process.env.ACCESSE_TOKEN_SWCRET, async function(err, decoded){
        if(err){
            res.send({message: "unathorized"})
        }else{
            const UserId = decoded.id

            let findUser = await User.findById(UserId)

            if(findUser.isVarified){
                return res.send({message: "User allready verified"})
            }else{
                findUser.isVarified = true
                findUser.save()
                res.send({message: "Email verified successfully Done"})
            }
        }
     })
}

module.exports = {registratinController,loginController,forgotpasswordController,resetpasswordController,resendVarificationEamilCOntroller,verifyemailController}