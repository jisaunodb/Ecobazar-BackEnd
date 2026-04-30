const mongoose = require('mongoose')
const dbconfig = ()=>{
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("Database connected");

    })
}

module.exports= dbconfig
// mongodb+srv://<db_username>:<db_password>@cluster0.le7bphi.mongodb.net/?appName=Cluster0