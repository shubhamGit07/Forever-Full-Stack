// controllers/cartController.js

import userModel from "../models/userModel.js"

// ======================================================
// ADD TO CART
// ======================================================

const addToCart = async (req, res) => {

    try {

        const { userId, itemId, size } = req.body

        // FIND USER

        const userData = await userModel.findById(userId)

        // CHECK USER EXISTS

        if (!userData) {

            return res.json({
                success: false,
                message: "User not found"
            })

        }

        // GET CART DATA

        let cartData = userData.cartData || {}

        // CHECK ITEM EXISTS

        if (cartData[itemId]) {

            // CHECK SIZE EXISTS

            if (cartData[itemId][size]) {

                cartData[itemId][size] += 1

            }

            else {

                cartData[itemId][size] = 1

            }

        }

        else {

            cartData[itemId] = {}

            cartData[itemId][size] = 1

        }

        // UPDATE DATABASE

        await userModel.findByIdAndUpdate(userId, { cartData })

        // RESPONSE

        res.json({
            success: true,
            message: "Added To Cart"
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
// UPDATE CART
// ======================================================

const updateCart = async (req, res) => {

    try {

        const { userId, itemId, size, quantity } = req.body

        // FIND USER

        const userData = await userModel.findById(userId)

        // CHECK USER EXISTS

        if (!userData) {

            return res.json({
                success: false,
                message: "User not found"
            })

        }

        // GET CART DATA

        let cartData = userData.cartData || {}

        // CHECK ITEM EXISTS

        if (!cartData[itemId]) {

            cartData[itemId] = {}

        }

        // UPDATE QUANTITY

        cartData[itemId][size] = quantity

        // UPDATE DATABASE

        await userModel.findByIdAndUpdate(userId, { cartData })

        // RESPONSE

        res.json({
            success: true,
            message: "Cart Updated"
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
// GET USER CART
// ======================================================

const getUserCart = async (req, res) => {

    try {

        const { userId } = req.body

        // FIND USER

        const userData = await userModel.findById(userId)

        // CHECK USER EXISTS

        if (!userData) {

            return res.json({
                success: false,
                message: "User not found"
            })

        }

        // GET CART DATA

        let cartData = userData.cartData || {}

        // RESPONSE

        res.json({
            success: true,
            cartData
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
    addToCart,
    updateCart,
    getUserCart
}