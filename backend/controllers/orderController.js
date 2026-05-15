// ======================================================
// IMPORTS
// ======================================================

import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'

import Stripe from 'stripe'
import Razorpay from 'razorpay'

// ======================================================
// INITIALIZE STRIPE
// ======================================================

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// ======================================================
// INITIALIZE RAZORPAY
// ======================================================

const razorpayInstance = new Razorpay({

    key_id: process.env.RAZORPAY_KEY_ID,

    key_secret: process.env.RAZORPAY_KEY_SECRET

})

// ======================================================
// FRONTEND URL
// ======================================================

const frontend_url = process.env.FRONTEND_URL

// ======================================================
// GLOBAL VARIABLES
// ======================================================

const currency = 'inr'

const deliveryCharge = 10

// ======================================================
// PLACE ORDER USING COD
// ======================================================

const placeOrder = async (req, res) => {

    try {

        const {

            userId,
            items,
            amount,
            address

        } = req.body

        const orderData = {

            userId,
            items,
            address,
            amount,

            paymentMethod: "COD",

            payment: false,

            status: "Order Placed",

            date: Date.now()

        }

        const newOrder = new orderModel(orderData)

        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {

            cartData: {}

        })

        res.json({

            success: true,

            message: "Order Placed"

        })

    }

    catch (error) {

        console.log(error)

        res.json({

            success: false,

            message: error.message

        })

    }

}

// ======================================================
// PLACE ORDER USING STRIPE
// ======================================================

const placeOrderStripe = async (req, res) => {

    try {

        const {

            userId,
            items,
            amount,
            address

        } = req.body

        // ======================================================
        // ORDER DATA
        // ======================================================

        const orderData = {

            userId,
            items,
            address,
            amount,

            paymentMethod: "Stripe",

            payment: false,

            status: "Order Placed",

            date: Date.now()

        }

        // ======================================================
        // SAVE ORDER
        // ======================================================

        const newOrder = new orderModel(orderData)

        await newOrder.save()

        // ======================================================
        // STRIPE LINE ITEMS
        // ======================================================

        const line_items = items.map((item) => ({

            price_data: {

                currency: currency,

                product_data: {

                    name: item.name,

                    description: "Forever Ecommerce Store"

                },

                unit_amount: Math.round(item.price * 100)

            },

            quantity: item.quantity

        }))

        // ======================================================
        // DELIVERY CHARGES
        // ======================================================

        line_items.push({

            price_data: {

                currency: currency,

                product_data: {

                    name: "Delivery Charges"

                },

                unit_amount: deliveryCharge * 100

            },

            quantity: 1

        })

        // ======================================================
        // CREATE STRIPE SESSION
        // ======================================================

        const session = await stripe.checkout.sessions.create({

            payment_method_types: ['card'],

            line_items,

            mode: 'payment',

            success_url:
                `${frontend_url}/verify?success=true&orderId=${newOrder._id}&userId=${userId}`,

            cancel_url:
                `${frontend_url}/verify?success=false&orderId=${newOrder._id}&userId=${userId}`

        })

        // ======================================================
        // RESPONSE
        // ======================================================

        res.json({

            success: true,

            session_url: session.url

        })

    }

    catch (error) {

        console.log(error)

        res.json({

            success: false,

            message: error.message

        })

    }

}

// ======================================================
// VERIFY STRIPE PAYMENT
// ======================================================

const verifyStripe = async (req, res) => {

    try {

        const {

            orderId,
            success,
            userId

        } = req.body

        // ======================================================
        // PAYMENT SUCCESS
        // ======================================================

        if (success === "true") {

            await orderModel.findByIdAndUpdate(orderId, {

                payment: true,

                status: "Order Placed"

            })

            await userModel.findByIdAndUpdate(userId, {

                cartData: {}

            })

            res.json({

                success: true,

                message: "Payment Successful"

            })

        }

        // ======================================================
        // PAYMENT FAILED / CANCELLED
        // ======================================================

        else {

            await orderModel.findByIdAndDelete(orderId)

            res.json({

                success: false,

                message: "Payment Cancelled"

            })

        }

    }

    catch (error) {

        console.log(error)

        res.json({

            success: false,

            message: error.message

        })

    }

}

// ======================================================
// PLACE ORDER USING RAZORPAY
// ======================================================

const placeOrderRazorpay = async (req, res) => {

    try {

        const {

            userId,
            items,
            amount,
            address

        } = req.body

        // ======================================================
        // ORDER DATA
        // ======================================================

        const orderData = {

            userId,
            items,
            address,
            amount,

            paymentMethod: "Razorpay",

            payment: false,

            status: "Order Placed",

            date: Date.now()

        }

        // ======================================================
        // SAVE ORDER
        // ======================================================

        const newOrder = new orderModel(orderData)

        await newOrder.save()

        // ======================================================
        // RAZORPAY OPTIONS
        // ======================================================

        const options = {

            amount: amount * 100,

            currency: currency.toUpperCase(),

            receipt: newOrder._id.toString()

        }

        // ======================================================
        // CREATE RAZORPAY ORDER
        // ======================================================

        razorpayInstance.orders.create(

            options,

            (error, order) => {

                if (error) {

                    console.log(error)

                    return res.json({

                        success: false,

                        message: error.message

                    })

                }

                res.json({

                    success: true,

                    order

                })

            }

        )

    }

    catch (error) {

        console.log(error)

        res.json({

            success: false,

            message: error.message

        })

    }

}

// ======================================================
// VERIFY RAZORPAY PAYMENT
// ======================================================

const verifyRazorpay = async (req, res) => {

    try {

        const {

            razorpay_order_id

        } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(

            razorpay_order_id

        )

        // ======================================================
        // PAYMENT SUCCESS
        // ======================================================

        if (orderInfo.status === 'paid') {

            await orderModel.findByIdAndUpdate(

                orderInfo.receipt,

                {

                    payment: true

                }

            )

            const orderData = await orderModel.findById(

                orderInfo.receipt

            )

            await userModel.findByIdAndUpdate(

                orderData.userId,

                {

                    cartData: {}

                }

            )

            res.json({

                success: true,

                message: "Payment Successful"

            })

        }

        // ======================================================
        // PAYMENT FAILED
        // ======================================================

        else {

            res.json({

                success: false,

                message: "Payment Failed"

            })

        }

    }

    catch (error) {

        console.log(error)

        res.json({

            success: false,

            message: error.message

        })

    }

}

// ======================================================
// ALL ORDERS (ADMIN)
// ======================================================

const allOrders = async (req, res) => {

    try {

        const orders = await orderModel.find({})

        res.json({

            success: true,

            orders

        })

    }

    catch (error) {

        console.log(error)

        res.json({

            success: false,

            message: error.message

        })

    }

}

// ======================================================
// USER ORDERS
// ======================================================

const userOrders = async (req, res) => {

    try {

        const { userId } = req.body

        const orders = await orderModel.find({

            userId

        })

        res.json({

            success: true,

            orders

        })

    }

    catch (error) {

        console.log(error)

        res.json({

            success: false,

            message: error.message

        })

    }

}

// ======================================================
// UPDATE ORDER STATUS
// ======================================================

const updateStatus = async (req, res) => {

    try {

        const {

            orderId,
            status

        } = req.body

        await orderModel.findByIdAndUpdate(orderId, {

            status

        })

        res.json({

            success: true,

            message: "Status Updated"

        })

    }

    catch (error) {

        console.log(error)

        res.json({

            success: false,

            message: error.message

        })

    }

}

// ======================================================
// EXPORTS
// ======================================================

export {

    placeOrder,

    placeOrderStripe,

    verifyStripe,

    placeOrderRazorpay,

    verifyRazorpay,

    allOrders,

    userOrders,

    updateStatus

}