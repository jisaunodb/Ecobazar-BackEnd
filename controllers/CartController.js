const Cart = require('../models/cartModel')
const Product = require ('../models/ProductModel')

const createCart = async (req,res) =>{
    const {proid,userid} = req.body

    const existingProduct = await Product.findOne({_id: proid})
    if(!existingProduct) {
       return res.json({
            success: false,
            message: "Product not found"
        })
    }

    // const finalPrice = existingProduct.price - (existingProduct.discountPrice || 0)

    const finalPrice = existingProduct.price - (existingProduct.price * existingProduct.discountPrice / 100)  // percentage

    const existingProductonCart = await Cart.findOne({product: proid,user: userid})
    // console.log(existingProductonCart);

    if(existingProductonCart){
        existingProductonCart.quantity += 1
        // existingProductonCart.totalPrice = existingProductonCart.totalPrice + existingProduct.price
        existingProductonCart.totalPrice = existingProductonCart.totalPrice + finalPrice   //persentage
        existingProductonCart.save()
    }else{

        let cart = new Cart({
            product: proid,
            quantity: 1,
            totalPrice:finalPrice,
            user: userid
        })

        cart.save()
    }


    res.json({
        success: true,
        message: 'Product added successfull'
    })
}

const incredecre = async (req,res) =>{
    const {id} = req.params
    const {type} = req.body

    const cart = await Cart.findOne({product: id})
    const product = await Product.findOne({_id: id})
    console.log(cart);

    if(!cart || !product){
            return res.status(404).json({
                success: false,
                message: "Cart or Product not found"
            })
        }

        // const finalPrice = product.price - (product.discountPrice || 0)

        const finalPrice = product.price - (product.price * product.discountPrice / 100)  // percentage

    if(type == 'plus'){
        cart.quantity = cart.quantity + 1
        cart.totalPrice = cart.totalPrice + finalPrice
        await cart.save()
    }else{
        cart.quantity = cart.quantity - 1
        cart.totalPrice = cart.totalPrice - finalPrice
        cart.save()
    }
    // Product.save()

    res.json({
        success: true,
        message: 'Cart Updated Successfull'
    })
}

const prodelete = async (req,res) =>{
    const {id} = req.params

    await Cart.findByIdAndDelete({_id: id})

    res.json({
        success: true,
        message: 'Product Deleted'
    })

}

const getCart = async (req,res) =>{
    const {userId} = req.params

    const cart = await Cart.find({user: userId}).populate('user product')

    let totalprice = 0

    cart.map(item =>{
        // console.log(item.product.price);

       totalprice += item.totalPrice
    })

    res.json({
        cart,
        totalprice
    })
}

module.exports ={createCart,incredecre,prodelete,getCart}