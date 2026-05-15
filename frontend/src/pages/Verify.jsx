import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Verify = () => {

    // ======================================================
    // LOCATION & NAVIGATION
    // ======================================================

    const location = useLocation()

    const navigate = useNavigate()

    // ======================================================
    // CONTEXT
    // ======================================================

    const {
        backendUrl,
        token,
        setCartItems
    } = useContext(ShopContext)

    // ======================================================
    // VERIFY PAYMENT
    // ======================================================

    const verifyPayment = async () => {

        try {

            const query = new URLSearchParams(location.search)

            const success = query.get('success')

            const orderId = query.get('orderId')

            const userId = query.get('userId')

            // ======================================================
            // API CALL
            // ======================================================

            const response = await axios.post(

                backendUrl + '/api/order/verifyStripe',

                {
                    success,
                    orderId,
                    userId
                },

                {
                    headers: { token }
                }

            )

            // ======================================================
            // PAYMENT SUCCESS
            // ======================================================

            if (response.data.success) {

                setCartItems({})

                toast.success('Payment Successful')

                navigate('/orders')

            }

            // ======================================================
            // PAYMENT FAILED / CANCELLED
            // ======================================================

            else {

                toast.error('Payment Cancelled')

                navigate('/cart')

            }

        }

        catch (error) {

            console.log(error)

            toast.error(error.message)

            navigate('/cart')

        }

    }

    // ======================================================
    // USE EFFECT
    // ======================================================

    useEffect(() => {

        if (token && location.search) {

            verifyPayment()

        }

    }, [token])

    // ======================================================
    // RETURN JSX
    // ======================================================

    return (

        <div className='min-h-[60vh] flex items-center justify-center text-xl'>

            Verifying Payment...

        </div>

    )

}

export default Verify