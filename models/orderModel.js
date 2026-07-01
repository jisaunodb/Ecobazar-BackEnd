const mongoose = require("mongoose")

const {Schema} = mongoose

const OrderModel = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products:[{
            title: String,
            price: Number,
            sku: String,
            quantity: Number,
            totalprice: Number
    }],
    totalprice:{
        type: Number,
        required: true,

    },
    tran_id:{
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum:['pending','rejected','approved'],
        default: 'pending'
    }

},{timestamps: true})

module.exports=mongoose.model('Order',OrderModel)