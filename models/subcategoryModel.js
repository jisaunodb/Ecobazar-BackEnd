// const { Timestamp } = require('mongodb')
// const mongoose = require('mongoose')

// const {Schema} = mongoose

// const SubCategorySchema = new Schema ({
//     title : {
//         type : String,
//         required: true,
//         unique: true
//     },
//     status: {
//         type: String,
//         enum : ["pending","approve","reject"],
//         default: "pending"
//     },
//     category:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Category'
//     }
// },{Timestamp: true})

// module.exports = mongoose.model("SubCategory",SubCategorySchema)