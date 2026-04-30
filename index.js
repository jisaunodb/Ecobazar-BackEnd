require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const dbconfig = require('./config/dbconfig')

// middleware

app.use(express.json())
app.use(cors())

// database config
dbconfig()

app.get('/', (req,res)=>{
    res.send("hello")
})

let port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server runnig on port ${port}`);

})