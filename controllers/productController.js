
const {empyfieldvalidation} = require('../utils/validation')

const Product = require('../models/ProductModel')
// const { readExcelFile } = require('read-excel-file/node')
const { cloudinary } = require('../config/dbconfig')
const { readSheet   } = require('read-excel-file/node')
const writeXlsxFile = require("write-excel-file/node");

const schema = {
  title: {
    column: 'title',
    type: String
  },

  description: {
    column: 'description',
    type: String
  },

  AdditionalInfo: {
    column: 'AdditionalInfo',
    type: String
  },

  price: {
    column: 'price',
    type: Number
  },

  discountPrice: {
    column: 'discountPrice',
    type: Number
  },

  sku: {
    column: 'sku',
    type: String
  },

  stock: {
    column: 'stock',
    type: Number
  },

  brand: {
    column: 'brand',
    type: String
  },

  shortDescription: {
    column: 'shortDescription',
    type: String
  },

  Category: {
    column: 'Category',
    type: String
  },

  subCategory: {
    column: 'subCategory',
    type: String
  },

  tag: {
    column: 'tag',
    type: String
  },

  status: {
    column: 'status',
    type: String
  },

  field: {
    column: 'field',
    type: String
  },

  imageUrl: {
    column: 'images.url',
    type: String
  },

  isMain: {
    column: 'images.isMain',
    type: Boolean
  }
}

const createProductController = async (req, res) => {
    try {
        const { title, price, Category, discountPrice, isMain } = req.body;

        const isInvalid = empyfieldvalidation(res, title, price, Category);
        if (isInvalid) return;

        const numericPrice = Number(price);
        const numericDiscount = Number(discountPrice) || 0;

        if (numericDiscount < 0 || numericDiscount > 100){
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
                url: `https://ecobazar-backend-1qs6.onrender.com/uploads/${item.path}`,
                url: item.path,
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
         const section = req.query.section
        const product = await Product.find(section ? { section } : {})

        res.json({
            success: true,
            product
        })
    } catch (error) {
        console.log(error,"Get all product Error");

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
                url: `https://ecobazar-backend-1qs6.onrender.com/uploads/${item.path}`,
                url: item.path,
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

const bulkCreateProductController = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Excel file is required"
            })
        }


        const { objects, errors } = await readSheet(
            `./${req.file.path}`,
            { schema }
        )

        if (errors?.length) {
            return res.status(400).json({
                success: false,
                message: "Excel data validation failed",
                errors
            })
        }

        const products = []
        for (const item of objects) {
            const rawUrls = item.imageUrl
                ? item.imageUrl.split(",").map(u => u.trim())
                : []

        const uploadedImages = []
            for (let i = 0; i < rawUrls.length; i++) {
                const result = await cloudinary.uploader.upload(rawUrls[i], {
                    folder: "ecobazar-products"
                })
                uploadedImages.push({
                    url: result.secure_url,
                    isMain: i === 0
                })
            }



        products.push ({

    ...item,

    tag: item.tag
        ? item.tag.split(",").map((tag) => tag.trim())
        : [],

    images: uploadedImages

    })}

        const createdProducts = await Product.insertMany(products)

        return res.status(201).json({
            success: true,
            message: `${createdProducts.length} products created successfully`,
            data: createdProducts
        })

    } catch (error) {

        console.error("bulk product create error:", error)

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const bulkexportController = async (req, res) => {
  try {
    const products = await Product.find().lean();

    const rows = [];

    // Header
    rows.push([
      { value: "Title", type: String },
      { value: "Description", type: String },
      { value: "Additional Info", type: String },
      { value: "Price", type: String },
      { value: "Discount Price", type: String },
      { value: "SKU", type: String },
      { value: "Stock", type: String },
      { value: "Brand", type: String },
      { value: "Short Description", type: String },
      { value: "Category", type: String },
      { value: "Sub Category", type: String },
      { value: "Tag", type: String },
      { value: "Status", type: String },
      { value: "Field", type: String },
      { value: "Image URL", type: String },
      { value: "Main Image", type: String }
    ]);

    // Every product = one Excel row
    for (const item of products) {

      const tags = item.tag
        ? item.tag.join(",")
        : "";

      const imageUrls = item.images
        ? item.images
            .map(image => image.url)
            .join(",")
        : "";

      const mainImage = item.images
        ? item.images.find(image => image.isMain)?.url || ""
        : "";

      rows.push([
        { value: item.title || "", type: String },

        { value: item.description || "", type: String },

        { value: item.AdditionalInfo || "", type: String },

        { value: item.price ?? 0, type: Number },

        { value: item.discountPrice ?? 0, type: Number },

        { value: item.sku || "", type: String },

        { value: item.stock ?? 0, type: Number },

        { value: item.brand || "", type: String },

        { value: item.shortDescription || "", type: String },

        { value: item.Category || "", type: String },

        { value: item.subCategory || "", type: String },

        { value: tags, type: String },

        { value: item.status || "", type: String },

        { value: item.field || "", type: String },

        { value: imageUrls, type: String },

        { value: mainImage, type: String }
      ]);
    }

    // Create Excel
    const buffer = await writeXlsxFile(rows).toBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=products.xlsx"
    );

    res.send(buffer);

  } catch (error) {

    console.log("EXPORT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Bulk export failed",
      error: error.message
    });
  }
};

module.exports = {createProductController,getProductControllers,getsingleProductController,productDeleteController,ProductUpdateController,bulkCreateProductController,bulkexportController}