const Cart = require('../models/cartModel')
const Product = require('../models/ProductModel')

// discountPrice = percentage
const getFinalPrice = (product) => {
    const price = Number(product.price) || 0
    const discount = Number(product.discountPrice) || 0
    return price - (price * discount) / 100
}

const createCart = async (req,res) =>{
    try {
        const { proid, userid } = req.body

        if (!proid || !userid) {
            return res.status(400).json({ success: false, message: "proid and userid are required" })
        }

        const product = await Product.findById(proid)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        const finalPrice = getFinalPrice(product)

        const existing = await Cart.findOne({ product: proid, user: userid })

        if (existing) {
            existing.quantity += 1
            existing.totalPrice = finalPrice * existing.quantity
            await existing.save()
        } else {
            await Cart.create({
                product: proid,
                quantity: 1,
                totalPrice: finalPrice,
                user: userid
            })
        }

        res.json({ success: true, message: 'Product added successfully' })
    } catch (error) {
        console.error("createCart error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const incredecre = async (req,res) =>{
    try {
        const { id } = req.params
        const { type, userid } = req.body

        if (!userid) {
            return res.status(400).json({ success: false, message: "userid is required" })
        }

        const cart = await Cart.findOne({ product: id, user: userid })
        const product = await Product.findById(id)

        if (!cart || !product) {
            return res.status(404).json({ success: false, message: "Cart or Product not found" })
        }

        if (type === 'plus') {
            cart.quantity += 1
        } else {
            if (cart.quantity <= 1) {
                return res.status(400).json({
                    success: false,
                    message: "Minimum quantity is 1. Use delete to remove the item."
                })
            }
            cart.quantity -= 1
        }

        cart.totalPrice = getFinalPrice(product) * cart.quantity
        await cart.save()

        res.json({ success: true, message: 'Cart updated successfully' })
    } catch (error) {
        console.error("incredecre error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const prodelete = async (req,res) =>{
    try {
        const { id } = req.params
        await Cart.findByIdAndDelete(id)
        res.json({ success: true, message: 'Product Deleted' })
    } catch (error) {
        console.error("prodelete error:", error)
        res.status(500).json({ success: false, message: error.message })
    }

}

const getCart = async (req,res) =>{
     try {
        const { userId } = req.params

        // 'user' populate kora jabe na, password hash leak hoy
        const all = await Cart.find({ user: userId }).populate('product')

        // delete hoye jawa product bad
        const cart = all.filter((item) => item.product)

        const totalprice = cart.reduce((acc, item) => acc + item.totalPrice, 0)

        res.json({ success: true, cart, totalprice })
    } catch (error) {
        console.error("getCart error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports ={createCart,incredecre,prodelete,getCart}