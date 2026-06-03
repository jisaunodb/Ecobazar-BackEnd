const moongose = require('mongoose')
const {Schema} = moongose

const ProductSchema = new Schema({

    title : {
        type: String,
        unique : true,
        required: true
    },
    description:{
        type: String
    },
    AdditionalInfo:{
        type: String
    },
    price :{
        type: Number,
        required: true
    },
    discountPrice :{
        type: Number,
        min: 0,
        default: 0
    },
    sku:{
        type: String,
        required: true,
        unique: true
    },
    stock:{
        type: Number,
        min: 0,
        default: 0
    },
    brand:{
        type : String
    },
    shortDescription: {
        type: String
    },
    Category: {
        type: String,
        require: true
    },
    subCategory: {
        type: String
    },

    // category:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category'
    // },
    //  subCategory: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'SubCategory'
    // },

    tag: [
        {
            type: String,
        }
    ],
    status: {
        type : String,
        enam: ["pending","active","inactive"],
        default: "pending"
    },
    images:[
        {
            url: {
                type: String,
                isMain: {
                    type: Boolean,
                    default: false
                }
            }
        }
    ]

},{timestamps: true})

module.exports = moongose.model('Product', ProductSchema)