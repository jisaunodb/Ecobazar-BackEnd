const mongoose = require('mongoose')

const {Schema} = mongoose

const UseSchema = new Schema({
    name :{
        type: String
    },
    // lastName: {
    //     type: String
    // },
    email:{
        type: String
    },
    password:{
        type: String
    },
    phoneNumber:{
        type: String
    },
    // terms: {
    //     type: Boolean
    // },
    profile:{
        type: String
    },
    isVarified: {
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        enum: ['admin','user','editor','vendor'],
        default: 'user'
    },
    ishold:{
        type: Boolean,
        default: false
    },

    address:{
        street:{
            type: String
        },
        city:{
            type: String
        },
         country:{
            type: String
        },
         zipCode:{
            type : String
        },
    },

    billingAddress:{
        fullName :{
            type: String
        },
        // lastName: {
        //     type: String
        // },
        email:{
            type: String
        },
        companyName:{
            type: String
        },
        street:{
            type: String
        },
        // state:{
        //     type: String
        // },
        zipCode:{
            type : String
        },
        phoneNumber:{
        type: String
        },
        country:{
            type: String
        },
        city:{
            type: String
        }
    }
})

module.exports = mongoose.model('User', UseSchema)