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
        max: 100,  // percentage
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
        required: true
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
        enum: ["pending","active","inactive"],
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

},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
ProductSchema.virtual('finalPrice').get(function() {
    // return this.price - this.discountPrice;
    return this.price - (this.price * this.discountPrice / 100);   // percentage
});

module.exports = moongose.model('Product', ProductSchema)