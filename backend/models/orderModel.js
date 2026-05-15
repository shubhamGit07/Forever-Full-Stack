// models/orderModel.js

import mongoose from 'mongoose'

// ======================================================
// ORDER SCHEMA
// ======================================================

const orderSchema = new mongoose.Schema(

    {

        // ---------------- USER ID ----------------

        userId: {

            type: String,
            required: true

        },

        // ---------------- ORDER ITEMS ----------------

        items: {

            type: Array,
            required: true

        },

        // ---------------- TOTAL AMOUNT ----------------

        amount: {

            type: Number,
            required: true

        },

        // ---------------- DELIVERY ADDRESS ----------------

        address: {

            type: Object,
            required: true

        },

        // ---------------- ORDER STATUS ----------------

        status: {

            type: String,
            required: true,
            default: 'Order Placed'

        },

        // ---------------- PAYMENT METHOD ----------------

        paymentMethod: {

            type: String,
            required: true

        },

        // ---------------- PAYMENT STATUS ----------------

        payment: {

            type: Boolean,
            required: true,
            default: false

        },

        // ---------------- ORDER DATE ----------------

        date: {

            type: Number,
            required: true

        }

    },

    {

        minimize: false

    }

)

// ======================================================
// ORDER MODEL
// ======================================================

const orderModel =

    mongoose.models.order ||

    mongoose.model(
        'order',
        orderSchema
    )

export default orderModel