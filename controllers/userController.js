const User = require('../models/Usermodel')
let getAlUsersController = async (req,res)=>{
    let Userdata = await User.find({})
    res.send({
        success: true,
        message: "All User Data"
    })
}

let singleuserDataController = async (req,res) =>{

    let {id }= req.params

    let Userdata = await User.findById(id)

     if (!Userdata) {
      return res.status(404).send({
        success: false,
        message: 'User not found'
      });
    }

    res.send({
        success: true,
        message: `${Userdata.email} data  `,
        data: Userdata
    })
}


let deletUserController = async (req,res) =>{
     let {id} = req.params

     let Userdata = await User.findByIdAndDelete (id)
     res.send({
        success: true,
        message: "user deleted"
    })
}

let UpdateUserController = async (req,res) =>{
    const {id} = req.params

    let userData = await User.findByIdAndUpdate( id,req.body,{new:true})

    res.send({
        success: true,
        message: 'User Updated'
    })
}

module.exports={getAlUsersController,singleuserDataController,deletUserController,UpdateUserController}