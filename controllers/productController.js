
const {empyfieldvalidation} = require('../utils/validation')
const Product = require('../models/ProductModel')


const createProductController = async (req, res) => {
    try {
        const { title, price, Category, discountPrice, isMain } = req.body;

        const isInvalid = empyfieldvalidation(res, title, price, Category);
        if (isInvalid) return;

        const numericPrice = Number(price);
        const numericDiscount = Number(discountPrice);

        if (numericDiscount && numericDiscount > numericPrice) {
            return res.status(400).json({
                success: false,
                message: "Discount price can't be greater than price"
            });
        }

        const validFields = ["Featured Organic Products", "Just Arrived This Week"];
            if (req.body.field && !validFields.includes(req.body.field)) {
            return res.status(400).json({
                success: false,
                message: "Invalid field value"
            });
        }

        let images = [];
        (req.files || []).forEach((item, index) => {
            images.push({
                url: `https://ecobazar-backend-1qs6.onrender.com/uploads/${item.filename}`,
                isMain: isMain == index
            });
        });

        let sku = `${Date.now()}-${new Date().getFullYear()}`;

        let product = new Product({
            ...req.body,
            price: numericPrice,
            discountPrice: numericDiscount,
            sku: sku,
            images: images
        });

        await product.save();

        return res.status(201).json({
            success: true,
            message: "Product Created"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

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

const ProductUpdateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { price, discountPrice, mainKey } = req.body;

        const existingProduct = await Product.findById(id);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // discountPrice percentage check
        if (discountPrice !== undefined && (discountPrice > 100 || discountPrice < 0)) {
            return res.status(400).json({
                success: false,
                message: "Discount percentage must be between 0 and 100"
            });
        }

        let updateData = { ...req.body };

        // ✅ existingImages (frontend theke JSON string hishebe ashe) parse kori
        let existingImages = [];
        if (req.body.existingImages) {
            try {
                existingImages = JSON.parse(req.body.existingImages);
            } catch (e) {
                existingImages = existingProduct.images || [];
            }
        } else {
            existingImages = existingProduct.images || [];
        }

        let newImages = [];
        if (req.files && req.files.length > 0) {
            newImages = req.files.map((item, index) => ({
                url: `https://ecobazar-backend-1qs6.onrender.com/uploads/${item.filename}`,
                isMain: mainKey === `new-${index}`
            }));
        }

        //  existing image gulor moddhe main ta thik kore boshai
        const finalExistingImages = existingImages.map((img, index) => ({
            ...img,
            isMain: mainKey === `existing-${index}`
        }));

        updateData.images = [...finalExistingImages, ...newImages];

        delete updateData.existingImages;
        delete updateData.mainKey;

        await Product.findByIdAndUpdate(id, updateData);

        return res.json({
            success: true,
            message: "Product Updated"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const bulkCreateProductController = async (req,res) =>{
    console.log(req.file);

}

module.exports = {createProductController,getProductControllers,getsingleProductController,productDeleteController,ProductUpdateController,bulkCreateProductController}