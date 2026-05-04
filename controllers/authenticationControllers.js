const { mailverification } = require("../utils/email")
const User = require('../models/Usermodel')
const jwt = require('jsonwebtoken')
const { empyfieldvalidation } = require("../utils/validation")
const tokenGenerator = require("../utils/tokenGenerator")
const existingData = require("../utils/existingData")
let registratinController = async (req,res)=>{
    const{email,password,confirmPassword,terms} = req.body


   let users = await existingData(res,{email: email})

   if (users){
    return
   }

    if(!terms){
       return res.send({message: "please accecpt our terms and condition"})
    }



    empyfieldvalidation(res,email,password,confirmPassword)

    if(password !== confirmPassword){
        return res.send({message : "password not matched"})
    }


    let newUser = new User ({
        email: email,
        password: password,
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
module.exports = {registratinController}