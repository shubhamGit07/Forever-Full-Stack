// routes/orderRoute.js

import express from 'express'

import {

    placeOrder,

    placeOrderStripe,

    verifyStripe,

    placeOrderRazorpay,

    verifyRazorpay,

    allOrders,

    userOrders,

    updateStatus

} from '../controllers/orderController.js'

import adminAuth from '../middleware/adminAuth.js'

import authUser from '../middleware/auth.js'

// ======================================================
// ROUTER
// ======================================================

const orderRouter = express.Router()

// ======================================================
// ADMIN FEATURES
// ======================================================

// GET ALL ORDERS

orderRouter.post(

    '/list',

    adminAuth,

    allOrders

)

// UPDATE ORDER STATUS

orderRouter.post(

    '/status',

    adminAuth,

    updateStatus

)

// ======================================================
// PAYMENT FEATURES
// ======================================================

// CASH ON DELIVERY

orderRouter.post(

    '/place',

    authUser,

    placeOrder

)

// STRIPE PAYMENT

orderRouter.post(

    '/stripe',

    authUser,

    placeOrderStripe

)

// VERIFY STRIPE PAYMENT

orderRouter.post(

    '/verifyStripe',

    authUser,

    verifyStripe

)

// RAZORPAY PAYMENT

orderRouter.post(

    '/razorpay',

    authUser,

    placeOrderRazorpay

)

// VERIFY RAZORPAY PAYMENT

orderRouter.post(

    '/verifyRazorpay',

    authUser,

    verifyRazorpay

)

// ======================================================
// USER FEATURES
// ======================================================

// USER ORDERS

orderRouter.post(

    '/userorders',

    authUser,

    userOrders

)

// ======================================================
// EXPORT
// ======================================================

export default orderRouter