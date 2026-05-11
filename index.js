require('node:dns').setServers(['1.1.1.1','8.8.8.8'])
require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const dbconfig = require('./config/dbconfig')

const { registratinController, loginController, forgotpasswordController, resetpasswordController, resendvarificationEamilCOntroller, resendVarificationEamilCOntroller, verifyemailController } = require('./controllers/authenticationControllers')
const { getAlUsersController, singleuserDataController, deletUserController, UpdateUserController } = require('./controllers/userController')
// const rateLimit = require('express-rate-limit')

// middleware

// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
// 	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
// 	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
// 	// store: ... , // Redis, Memcached, etc. See below.
// })
// app.use(limiter)
app.use(express.json())
app.use(cors())

// database config
dbconfig()

app.post('/registration',registratinController)
app.post('/login',loginController)
app.post('/forgotpassword',forgotpasswordController)
app.post('/resetpassword/:token',resetpasswordController)
app.post('/resendvarification',resendVarificationEamilCOntroller)
app.post('/verifyemail/:token', verifyemailController)

// Product Create

// Order Management

// User Management
app.post('/allusers', getAlUsersController)
app.post('/singleusers/:id', singleuserDataController)
app.post('/delete/:id', deletUserController)
app.post('/update/:id', UpdateUserController)






let port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server runnig on port ${port}`);

})