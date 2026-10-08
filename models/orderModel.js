const mongoose = require("mongoose")

const { Schema } = mongoose

// delivery tracking er step gulo (frontend STEPS er key er sathe milano)
const ORDER_STATUSES = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']

const OrderModel = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        title: String,
        price: Number,
        sku: String,
        quantity: Number,
        totalprice: Number,
        image: String            // notun: details page e image dekhanor jonno (optional)
    }],
    itemsPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    taxPrice: { type: Number, default: 0 },
    totalprice: {
        type: Number,
        required: true
    },
    shippingAddress: {
        name: String,
        phone: String,
        address: String,
        city: String,
        postcode: String
    },
    tran_id: {
        type: String,
        required: true,
        unique: true
    },

    // PAYMENT status (aamarPay success/fail e change hoy)
    status: {
        type: String,
        enum: ['pending', 'rejected', 'approved', 'cancelled'],
        default: 'pending'
    },

    // notun: DELIVERY status (admin change kore)
    orderStatus: {
        type: String,
        enum: ORDER_STATUSES,
        default: 'placed'
    },

    // notun: kon status kokhon holo (tracking page er timeline eta theke time dekhay)
    statusHistory: [{
        status: { type: String, enum: ORDER_STATUSES },
        note: { type: String, default: "" },
        at: { type: Date, default: Date.now }
    }]

}, { timestamps: true })

module.exports = mongoose.models.Order || mongoose.model('Order', OrderModel)