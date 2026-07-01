const Order = require("../models/orderModel")

const getorderController = async (req,res) =>{
    const {userid} = req.params
    try {
        const orders = await Order.find({user : userid})

        if(!orders){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.json({
            success: true,
            orders
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { getorderController}