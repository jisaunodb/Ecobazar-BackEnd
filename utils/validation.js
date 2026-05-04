let empyfieldvalidation = (res,...feilds)=>{
    console.log(feilds.includes('') || (feilds.includes(undefined)));

    if(feilds.includes('') || (feilds.includes(undefined))){
       return res.send({
            message: "please fill all the field"
        })
    }
}

module.exports= {empyfieldvalidation}