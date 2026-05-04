require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const dbconfig = require('./config/dbconfig')

const { registratinController } = require('./controllers/authenticationControllers')
// middleware

app.use(express.json())
app.use(cors())

// database config
dbconfig()

app.post('/registration',registratinController)

let port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server runnig on port ${port}`);

})