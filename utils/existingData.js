const User = require('../models/Usermodel')
let existingData = async (res,findData)=>{
    let existingUser = await User.findOne(findData)
    if(existingUser){
    //    res.send({massage : "User allready existing"})
       return true
    }

    return false
}

module.exports= existingData