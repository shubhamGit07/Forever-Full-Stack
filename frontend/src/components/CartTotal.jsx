// components/CartTotal.jsx

import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {

  // ======================================================
  // CONTEXT
  // ======================================================

  const {
    currency,
    delivery_fee,
    getCartAmount
  } = useContext(ShopContext)

  // ======================================================
  // TOTAL CALCULATION
  // ======================================================

  const subtotal = getCartAmount()

  const total =
    subtotal === 0
      ? 0
      : subtotal + delivery_fee

  // ======================================================
  // RETURN JSX
  // ======================================================

  return (

    <div className='w-full'>

      {/* TITLE */}

      <div className='text-2xl'>

        <Title
          text1={'CART'}
          text2={'TOTALS'}
        />

      </div>

      {/* TOTAL DETAILS */}

      <div className='flex flex-col gap-2 mt-6 text-sm'>

        {/* SUBTOTAL */}

        <div className='flex justify-between'>

          <p>Subtotal</p>

          <p>
            {currency}
            {subtotal}.00
          </p>

        </div>

        <hr className='border-gray-200' />

        {/* SHIPPING FEE */}

        <div className='flex justify-between'>

          <p>Shipping Fee</p>

          <p>

            {
              subtotal === 0
                ? `${currency}0.00`
                : `${currency}${delivery_fee}.00`
            }

          </p>

        </div>

        <hr className='border-gray-200' />

        {/* TOTAL */}

        <div className='flex justify-between'>

          <b>Total</b>

          <b>

            {currency}
            {total}.00

          </b>

        </div>

      </div>

    </div>

  )

}

export default CartTotal