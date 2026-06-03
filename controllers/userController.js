const User = require('../models/Usermodel')
let getAlUsersController = async (req,res)=>{
    let Userdata = await User.find({})
    res.send({
        success: true,
        message: "All User Data"
    })
}

let singleuserDataController = async (req,rea) =>{

    let id = req.params

    let Userdata = await User.findById(id)
    res.send({
        success: true,
        message: `${Userdata.email} data  `
    })
}


let deletUserController = async (req,res) =>{
     let id = req.params

     let Userdata = await User.findByIdAndDelete (id)
     res.send({
        success: true,
        message: "user deleted"
    })
}

let UpdateUserController = async (req,res) =>{
    const {id} = req.params

    let userData = await User.findByIdAndUpdate({_id: id},req.body,{new:true})

    res.send({
        success: true,
        message: 'User Updated'
    })
}

module.exports={getAlUsersController,singleuserDataController,deletUserController,UpdateUserController}