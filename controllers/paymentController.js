const express = require("express");
const axios = require("axios");
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')
const paymentController = async (req, res) => {
    const {userId,cus_name,cus_email,cus_add1,cus_add2,cus_city,cus_state,cus_postcode, cus_phone} =req.body

    const cart = await Cart.find({user : userId}).populate('product')


    let totalprice = 0
    const pro = []
    cart.map(item =>{
        console.log(item);
        const finalPrice = item.product.price - (item.product.discountPrice || 0)


        pro.push({
            title: item.product.title,
            price: finalPrice,
            sku: item.product.sku,
            quantity: item.quantity,
            totalprice: item.totalPrice
        });



        totalprice += item.totalPrice
    })


    // res.send({
    //     product: pro,
    //     totalprice: totalprice
    // });


    const data = {
        store_id: "aamarpaytest",
        tran_id: Date.now(),

        success_url: "http://www.merchantdomain.com/suc esspage.html",
        fail_url: "http://www.merchantdomain.com/faile dpage.html",
        cancel_url: "http://www.merchantdomain.com/can cellpage.html",

        amount: totalprice,
        currency: "BDT",

        signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",

        desc: "Merchant Registration Payment",

        cus_name: cus_name,
        cus_email: cus_email,

        cus_add1: cus_add1,
        cus_add2: cus_add2,

        cus_city: cus_city,
        cus_state: cus_state,

        cus_postcode: cus_postcode,
        cus_country: "Bangladesh",

        cus_phone: cus_phone,

        type: "json"
    };


    try {

        const response = await axios({
            method: "POST",
            url: "https://sandbox.aamarpay.com/jsonpost.php",
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        });


        const order = new Order({
            user: userId,
            products: pro,
            totalprice: totalprice,
            tran_id: Date.now()
        })
        await order.save()

        res.send(response.data);


    } catch (error) {

        res.status(500).send(error.message);

    }

}
module.exports= (paymentController)




