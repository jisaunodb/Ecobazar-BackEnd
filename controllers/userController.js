const User = require('../models/Usermodel')
let getAlUsersController = async (req,res)=>{
    let Userdata = await User.find({})
    res.send({
        message: "All User Data"
    })
}

let singleuserDataController = async (req,rea) =>{

    let id = req.params

    let Userdata = await User.findById(id)
    res.send({
        message: `${Userdata.email} data  `
    })
}


let deletUserController = async (req,res) =>{
     let id = req.params

     let Userdata = await User.findByIdAndDelete (id)
     res.send({
        message: "user deleted"
    })
}

let UpdateUserController = async (req,res) =>{
    const {id} = req.params

    let userData = await User.findByIdAndUpdate({_id: id},req.body,{new:true})

    res.send({
        message: 'User Updated'
    })
}

module.exports={getAlUsersController,singleuserDataController,deletUserController,UpdateUserController}