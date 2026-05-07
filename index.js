require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const dbconfig = require('./config/dbconfig')

const { registratinController, loginController, forgotpasswordController, resetpasswordController, resendvarificationEamilCOntroller, resendVarificationEamilCOntroller } = require('./controllers/authenticationControllers')
// middleware

app.use(express.json())
app.use(cors())

// database config
dbconfig()

app.post('/registration',registratinController)
app.post('/login',loginController)
app.post('/forgotpassword',forgotpasswordController)
app.post('/resetpassword/:token',resetpasswordController)
app.post('/resendvarification/',resendVarificationEamilCOntroller)

let port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server runnig on port ${port}`);

})