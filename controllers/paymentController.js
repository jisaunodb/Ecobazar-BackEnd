// const express = require("express");
// const axios = require("axios");
// const Cart = require('../models/cartModel')
// const Order = require('../models/orderModel')
// const paymentController = async (req, res) => {
//     const {userId,cus_name,cus_email,cus_add1,cus_add2,cus_city,cus_state,cus_postcode, cus_phone} =req.body

//     const cart = await Cart.find({user : userId}).populate('product')


//     let totalprice = 0
//     const pro = []
//     cart.map(item =>{
//         console.log(item);
//         const finalPrice = item.product.price - (item.product.discountPrice || 0)


//         pro.push({
//             title: item.product.title,
//             price: finalPrice,
//             sku: item.product.sku,
//             quantity: item.quantity,
//             totalprice: item.totalPrice
//         });



//         totalprice += item.totalPrice
//     })


//     // res.send({
//     //     product: pro,
//     //     totalprice: totalprice
//     // });


//     const data = {
//         store_id: "aamarpaytest",
//         tran_id: Date.now(),

//         success_url: "http://www.merchantdomain.com/suc esspage.html",
//         fail_url: "http://www.merchantdomain.com/faile dpage.html",
//         cancel_url: "http://www.merchantdomain.com/can cellpage.html",

//         amount: totalprice,
//         currency: "BDT",

//         signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",

//         desc: "Merchant Registration Payment",

//         cus_name: cus_name,
//         cus_email: cus_email,

//         cus_add1: cus_add1,
//         cus_add2: cus_add2,

//         cus_city: cus_city,
//         cus_state: cus_state,

//         cus_postcode: cus_postcode,
//         cus_country: "Bangladesh",

//         cus_phone: cus_phone,

//         type: "json"
//     };


//     try {

//         const response = await axios({
//             method: "POST",
//             url: "https://sandbox.aamarpay.com/jsonpost.php",
//             data: data,
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });


//         const order = new Order({
//             user: userId,
//             products: pro,
//             totalprice: totalprice,
//             tran_id: Date.now()
//         })
//         await order.save()

//         res.send(response.data);


//     } catch (error) {

//         res.status(500).send(error.message);

//     }

// }
// module.exports= (paymentController)










// const axios = require("axios");
// const Cart = require('../models/cartModel')
// const Order = require('../models/orderModel')
// const Product = require('../models/productModel')
// const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"
// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"
// const AAMARPAY_URL = process.env


// const TAX_RATE = 0.05
// const FREE_SHIPPING_ABOVE = 1000
// const SHIPPING_FEE = 60

// const round2 = (n) => Math.round(n * 100) / 100
// const paymentController = async (req, res) => {
//     try {
//         const { userId,items: reqItems, cus_name, cus_email, cus_add1, cus_add2, cus_city, cus_state, cus_postcode, cus_phone } = req.body

//         if (!userId) {
//             return res.status(400).json({ success: false, message: "userId is required" })
//         }
//          if (!cus_name || !cus_email || !cus_add1 || !cus_city || !cus_postcode || !cus_phone) {
//             return res.status(400).json({ success: false, message: "Shipping information is incomplete" })
//         }


//          let items = []

//         if (Array.isArray(reqItems) && reqItems.length > 0) {
//             const products = await Product.find({
//                 _id: { $in: reqItems.map((i) => i.productId) }
//             })
//             items = reqItems
//                 .map((i) => {
//                     const product = products.find((p) => String(p._id) === String(i.productId))
//                     const quantity = Math.max(1, Number(i.quantity) || 1)
//                     return product ? { product, quantity } : null
//                 })
//                 .filter(Boolean)
//         } else {
//             const cart = await Cart.find({ user: userId }).populate('product')
//             items = cart
//                 .filter((c) => c.product)
//                 .map((c) => ({ product: c.product, quantity: c.quantity }))
//         }

//         if (items.length === 0) {
//             return res.status(400).json({ success: false, message: "Cart is empty" })
//         }

//         // discountPrice = percentage
//         const pro = items.map(({ product, quantity }) => {
//             const price = Number(product.price) || 0
//             const discount = Number(product.discountPrice) || 0
//             const finalPrice = price - (price * discount) / 100
//             return {
//                 title: product.title,
//                 price: round2(finalPrice),
//                 sku: product.sku,
//                 quantity,
//                 totalprice: round2(finalPrice * quantity)
//             }
//         })

//         const itemsPrice = round2(pro.reduce((acc, p) => acc + p.totalprice, 0))
//         const shippingPrice = itemsPrice > FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE
//         const taxPrice = round2(itemsPrice * TAX_RATE)
//         const totalprice = round2(itemsPrice + shippingPrice + taxPrice)

//         if (!totalprice || totalprice <= 0) {
//             return res.status(400).json({ success: false, message: "Invalid cart total" })
//         }

//         // aamarPay e request

//         const tran_id = String(Date.now())

//          const response = await axios.post(
//             `${AAMARPAY_URL}/jsonpost.php`,
//             {
//                 store_id: STORE_ID,
//                 signature_key: SIGNATURE_KEY,
//                 tran_id,
//                 success_url: `${BACKEND_URL}/payment/success?tran_id=${tran_id}`,
//                 fail_url: `${BACKEND_URL}/payment/fail?tran_id=${tran_id}`,
//                 cancel_url: `${BACKEND_URL}/payment/cancel?tran_id=${tran_id}`,
//                 amount: totalprice.toFixed(2),
//                 currency: "BDT",
//                 desc: "EcoBazar Order Payment",
//                 cus_name,
//                 cus_email,
//                 cus_add1,
//                 cus_add2: cus_add2 || "N/A",
//                 cus_city,
//                 cus_state: cus_state || cus_city,
//                 cus_postcode,
//                 cus_country: "Bangladesh",
//                 cus_phone,
//                 type: "json"
//             },
//             { headers: { "Content-Type": "application/json" } }
//         )

//         // payment_url na ashle (jemon invalid store) order save korbo na
//         if (!response.data?.payment_url) {
//             console.error("aamarPay error:", response.data)
//             return res.status(502).json({
//                 success: false,
//                 message: typeof response.data === "string" ? response.data : "Could not create payment link"
//             })
//         }


//         // 4) order save (status: pending)

//         await Order.create({
//             user: userId,
//             products: pro,
//             itemsPrice,
//             shippingPrice,
//             taxPrice,
//             totalprice,
//             tran_id,
//             shippingAddress: {
//                 name: cus_name,
//                 phone: cus_phone,
//                 address: cus_add1,
//                 city: cus_city,
//                 postcode: cus_postcode
//             }
//         })

//        res.json({ success: true, payment_url: response.data.payment_url, tran_id })
//     } catch (error) {
//         console.error("payment error:", error)
//         res.status(500).json({ success: false, message: error.message })
//     }
// }

// // aamarPay POST kore ei route gulote
// paymentController.success = async (req, res) => {
//     const { tran_id } = String(req.query.tran_id || "")
//     try {
//         const order = await Order.findOne({ tran_id })

//          if (order && order.status === 'pending'){
//             let paid = false
//              try {
//                 // query string fake kora jay, tai aamarPay ke diye verify kori
//                 const { data } = await axios.get(`${AAMARPAY_URL}/api/v1/trxcheck/request.php`, {
//                     params: {
//                         request_id: tran_id,
//                         store_id: STORE_ID,
//                         signature_key: SIGNATURE_KEY,
//                         type: "json"
//                     }
//                 })
//                 paid = data?.pay_status === "Successful"
//             } catch (e) {
//                 console.error("verify error:", e.message)
//                 // shudhu development e body er pay_status trust kori
//                 paid = process.env.NODE_ENV !== "production" && req.body?.pay_status === "Successful"
//             }

//             order.status = paid ? 'approved' : 'rejected'
//             await order.save()
//             if (paid) await Cart.deleteMany({ user: order.user })
//          }
//     } catch (error) {
//         console.error("payment success error:", error)
//     }
//     res.redirect(303, `${FRONTEND_URL}/order-success?tran_id=${tran_id}`)
// }

// paymentController.fail = async (req, res) => {
//     const { tran_id } = String(req.query.tran_id || "")
//     try {
//         if (tran_id) {
//             await Order.findOneAndUpdate({ tran_id, status: 'pending' }, { status: 'rejected' })
//         }
//     } catch (error) {
//         console.error("payment fail error:", error)
//     }
//     res.redirect(303, `${FRONTEND_URL}/order-success?tran_id=${tran_id}`)
// }

// paymentController.cancel = (req, res) => res.redirect(303, `${FRONTEND_URL}/cart`)

// paymentController.getOrder = async (req, res) => {
//     try {
//         const order = await Order.findOne({ tran_id: String(req.params.tran_id) })
//         if (!order) return res.status(404).json({ success: false, message: "Order not found" })
//         res.json(order)
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message })
//     }
// }


// module.exports = paymentController


const axios = require("axios");
const mongoose = require("mongoose");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
// FIX: file er exact naam boshao (productController e jeta ache, shetai). Linux/Render e case mile na gele crash kore.
const Product = require("../models/ProductModel");

// const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const BACKEND_URL = process.env.BACKEND_URL || "https://ecobazar-backend-1qs6.onrender.com";
// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://eco-front-end-coral.vercel.app";
const AAMARPAY_URL = process.env.AAMARPAY_URL || "https://sandbox.aamarpay.com";
const STORE_ID = process.env.STORE_ID || "aamarpaytest";
const SIGNATURE_KEY = process.env.SIGNATURE_KEY || "dbb74894e82415a2f7ff0ec3a97e4183";

// Frontend (CartPage / CheckoutPage / Navbar) er sathe EKOI rakho
const TAX_RATE = 0.05;
const FREE_SHIPPING_ABOVE = 50;
const SHIPPING_FEE = 5;

const round2 = (n) => Math.round(n * 100) / 100;

// =====================================================
// POST /payment
// body: { userId, items: [{ productId, quantity }], cus_* }
// =====================================================
const paymentController = async (req, res) => {
    try {
        const {
            userId,
            items: reqItems,
            cus_name,
            cus_email,
            cus_add1,
            cus_add2,
            cus_city,
            cus_state,
            cus_postcode,
            cus_phone
        } = req.body;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Valid userId is required" });
        }

        if (!cus_name || !cus_email || !cus_add1 || !cus_city || !cus_postcode || !cus_phone) {
            return res.status(400).json({ success: false, message: "Shipping information is incomplete" });
        }

        // -------------------------------------------------
        // Items: frontend cart (Redux) theke ashe, kintu DAM
        // shob shomoy DB er Product theke nei (tamper kora jay na)
        // -------------------------------------------------
        let items = [];

        if (Array.isArray(reqItems) && reqItems.length > 0) {
            const ids = reqItems
                .map((i) => i.productId)
                .filter((id) => mongoose.Types.ObjectId.isValid(id));

            const products = await Product.find({ _id: { $in: ids } });

            items = reqItems
                .map((i) => {
                    const product = products.find((p) => String(p._id) === String(i.productId));
                    const quantity = Math.max(1, Math.floor(Number(i.quantity) || 1));
                    return product ? { product, quantity } : null;
                })
                .filter(Boolean);
        } else {
            // fallback: DB cart
            const cart = await Cart.find({ user: userId }).populate("product");
            items = cart
                .filter((c) => c.product)
                .map((c) => ({ product: c.product, quantity: c.quantity }));
        }

        if (items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        // discountPrice = percentage
        const pro = items.map(({ product, quantity }) => {
            const price = Number(product.price) || 0;
            const discount = Number(product.discountPrice) || 0;
            const finalPrice = price - (price * discount) / 100;

            return {
                title: product.title,
                price: round2(finalPrice),
                sku: product.sku,
                quantity,
                totalprice: round2(finalPrice * quantity),
                image: product.photos?.[0]?.path || product.photos?.[0] || ""

            };
        });

        const itemsPrice = round2(pro.reduce((acc, p) => acc + p.totalprice, 0));
        const shippingPrice = itemsPrice > FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
        const taxPrice = round2(itemsPrice * TAX_RATE);
        const totalprice = round2(itemsPrice + shippingPrice + taxPrice);

        if (!Number.isFinite(totalprice) || totalprice <= 0) {
            return res.status(400).json({ success: false, message: "Invalid cart total" });
        }

        const tran_id = `ECO-${Date.now()}`;

        const paymentData = {
            store_id: STORE_ID,
            signature_key: SIGNATURE_KEY,
            tran_id,
            success_url: `${BACKEND_URL}/payment/success?tran_id=${tran_id}`,
            fail_url: `${BACKEND_URL}/payment/fail?tran_id=${tran_id}`,
            cancel_url: `${BACKEND_URL}/payment/cancel?tran_id=${tran_id}`,
            amount: totalprice.toFixed(2),
            currency: "USD", // tomar dam dollar e, tai USD
            desc: "EcoBazar Order Payment",
            cus_name,
            cus_email,
            cus_add1,
            cus_add2: cus_add2 || "N/A",
            cus_city,
            cus_state: cus_state || cus_city,
            cus_postcode,
            cus_country: "Bangladesh",
            cus_phone,
            type: "json"
        };

        const response = await axios.post(`${AAMARPAY_URL}/jsonpost.php`, paymentData, {
            headers: { "Content-Type": "application/json" }
        });

        // payment_url na ashle order save korbo na
        if (!response.data || !response.data.payment_url) {
            console.error("aamarPay error:", response.data);
            return res.status(502).json({
                success: false,
                message: "Could not create aamarPay payment",
                gateway_response: response.data
            });
        }

        await Order.create({
            user: userId,
            products: pro,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalprice,
            tran_id,
            status: "pending",
            shippingAddress: {
                name: cus_name,
                phone: cus_phone,
                address: cus_add1,
                city: cus_city,
                postcode: cus_postcode
            }
        });

        return res.json({
            success: true,
            payment_url: response.data.payment_url,
            tran_id,
            totalprice
        });
    } catch (error) {
        console.error("payment error:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error.response?.data || error.message
        });
    }
};

// =====================================================
// aamarPay ei route gulote POST/GET kore (app.all)
// =====================================================
paymentController.success = async (req, res) => {
    const tran_id = String(req.query.tran_id || "");

    try {
        if (!tran_id) {
            return res.redirect(303, `${FRONTEND_URL}/order-success`);
        }

        const order = await Order.findOne({ tran_id });

        if (!order) {
            return res.redirect(303, `${FRONTEND_URL}/order-success?tran_id=${tran_id}`);
        }

        // ekbar process hole abar kora jabe na
        if (order.status !== "pending") {
            return res.redirect(303, `${FRONTEND_URL}/order-success?tran_id=${tran_id}`);
        }

        let verified = false;
        let paid = false;

        // query string fake kora jay, tai aamarPay ke diye verify kori
        try {
            const { data } = await axios.get(`${AAMARPAY_URL}/api/v1/trxcheck/request.php`, {
                params: {
                    request_id: tran_id,
                    store_id: STORE_ID,
                    signature_key: SIGNATURE_KEY,
                    type: "json"
                }
            });
            verified = true;
            paid = data?.pay_status === "Successful";
        } catch (error) {
            console.error("verification error:", error.response?.data || error.message);
        }

        // FIX: verify korte na parle "rejected" na kore pending rakho (taka kete thakte pare)
        if (!verified) {
            return res.redirect(303, `${FRONTEND_URL}/order-success?tran_id=${tran_id}`);
        }

        order.status = paid ? "approved" : "rejected";

        if (paid) {
            order.orderStatus = "placed";
            order.statusHistory.push({ status: "placed", note: "Payment confirmed" });
        }

        await order.save();

        if (paid) {
            await Cart.deleteMany({ user: order.user });
        }
    } catch (error) {
        console.error("payment success error:", error);
    }

    return res.redirect(303, `${FRONTEND_URL}/order-success?tran_id=${tran_id}`);
};

paymentController.fail = async (req, res) => {
    const tran_id = String(req.query.tran_id || "");

    try {
        if (tran_id) {
            await Order.findOneAndUpdate({ tran_id, status: "pending" }, { status: "rejected" });
        }
    } catch (error) {
        console.error("payment fail error:", error);
    }

    return res.redirect(303, `${FRONTEND_URL}/order-success?tran_id=${tran_id}`);
};

paymentController.cancel = async (req, res) => {
    const tran_id = String(req.query.tran_id || "");

    try {
        if (tran_id) {
            // FIX: 'cancelled' ke orderModel er enum e add korte hobe (neeche dilam)
            await Order.findOneAndUpdate({ tran_id, status: "pending" }, { status: "cancelled" });
        }
    } catch (error) {
        console.error("payment cancel error:", error);
    }

    return res.redirect(303, `${FRONTEND_URL}/cart`);
};

paymentController.getOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ tran_id: String(req.params.tran_id) });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        return res.json(order);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = paymentController;