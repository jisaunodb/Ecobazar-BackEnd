const Order = require("../models/orderModel")
const mongoose = require("mongoose")

const ORDER_STATUSES = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']

const getorderController = async (req, res) => {
     try {
        const { userid } = req.params

        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).json({ success: false, message: "Invalid user id" })
        }

        // payment hoy nai (pending) order bad, shudhu real order dekhabo
        const orders = await Order.find({ user: userid, status: { $in: ['approved', 'rejected', 'cancelled'] } })
            .sort({ createdAt: -1 })

        res.json({ success: true, orders })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


const getOrderByTranId = async (req, res) => {
    try {
        const order = await Order.findOne({ tran_id: String(req.params.tran_id) })

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" })
        }

        res.json({ success: true, order })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { orderStatus, note } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid order id" })
        }

        if (!ORDER_STATUSES.includes(orderStatus)) {
            return res.status(400).json({ success: false, message: "Invalid orderStatus" })
        }

        const order = await Order.findById(id)

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" })
        }

        // payment na hole delivery status bodlano jabe na
        if (order.status !== 'approved') {
            return res.status(400).json({ success: false, message: "Payment is not approved for this order" })
        }

        // delivered / cancelled hole ar bodlano jabe na
        if (['delivered', 'cancelled'].includes(order.orderStatus)) {
            return res.status(400).json({ success: false, message: `Order already ${order.orderStatus}` })
        }

        order.orderStatus = orderStatus
        order.statusHistory.push({ status: orderStatus, note: note || "" })
        await order.save()

        res.json({ success: true, order })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// TEMPORARY: ekbar chalaye ei function ar index.js er route delete kore dibe
const migrateOrderHistory = async (req, res) => {
    try {
        const result = await Order.collection.updateMany(
            { status: "approved", "statusHistory.0": { $exists: false } },
            [
                {
                    $set: {
                        orderStatus: { $ifNull: ["$orderStatus", "placed"] },
                        statusHistory: [{ status: "placed", note: "Payment confirmed", at: "$createdAt" }]
                    }
                }
            ]
        )
        res.json({ success: true, matched: result.matchedCount, modified: result.modifiedCount })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = { getorderController, getOrderByTranId, getAllOrders, updateOrderStatus, migrateOrderHistory }