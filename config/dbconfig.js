const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2
const dbconfig = ()=>{
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("Database connected");

    })
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports= {dbconfig,cloudinary}
// mongodb+srv://<db_username>:<db_password>@cluster0.le7bphi.mongodb.net/?appName=Cluster0