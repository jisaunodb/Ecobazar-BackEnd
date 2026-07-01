
const {empyfieldvalidation} = require('../utils/validation')
const Product = require('../models/ProductModel')


const createProductController = async (req,res) =>{
    const {title,price,Category,discountPrice} = req.body
    empyfieldvalidation(res,title,price,Category)

    // discount price check
    if (discountPrice && discountPrice > price) {
        return res.status(400).json({
            success: false,
            message: "Discount price can't be greater than price"
        });
    }

    // title exist ache naki

    let sku = `${Date.now()}-${new Date().getFullYear()}`


    // sku exist korteche kina

    let product = new Product({
        ...req.body,
        sku: sku
    })
    await product.save()

    res.json({
        success: true,
        message: "Product Created"
    })
}

// all product get

const getProductControllers = async (req,res) =>{
    try {
        let product = await Product.find({})

        res.json({
            success: true,
            product
        })
    } catch (error) {
        res.json({
            success: false,
            message: 'Surver Error'
        })
    }
}

// single product get

const getsingleProductController = async (req,res)=>{
    try {
        const {id} = req.params

        const SingleProduct = await Product.findOne({_id : id})

        res.json({
            success: true,
            product : SingleProduct
        })

    } catch (error) {
         res.json({
            success: false,
            message: "Server Error"
        })
    }

}

// product delete

const productDeleteController = async (req,res) =>{
    try {
        const {id} = req.params

        await Product.findByIdAndDelete(id)

        res.json({
            success: true,
            message : "Product Deleted"
        })
    } catch (error) {
        res.json({
            success: false,
            message : "Surver Error"
        })
    }
}

// product update

const ProductUpdateController = async (req,res) =>{
    try {
        const {id} =req.params
        const {price,discountPrice} = req.body

        const existingProduct = await Product.findById(id)

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        // parsentage work

        if (discountPrice !== undefined && (discountPrice > 100 || discountPrice < 0)) {
            return res.status(400).json({
                success: false,
                message: "Discount percentage must be between 0 and 100"
            })
        }


        // const finalPrice = price !== undefined ? price : existingProduct.price
        // const finalDiscount = discountPrice !== undefined ? discountPrice : existingProduct.discountPrice

        // if (finalDiscount > finalPrice) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Discount price can't be greater than price"
        //     })
        // }


        const productUpdate = await Product.findByIdAndUpdate({_id: id},req.body)

        res.json({
            success: true,
            message: "Product Update"
        })
    } catch (error) {
        res.json({
        success: false,
        message: "Surver Error"
    })
    }
}


module.exports = {createProductController,getProductControllers,getsingleProductController,productDeleteController,ProductUpdateController}