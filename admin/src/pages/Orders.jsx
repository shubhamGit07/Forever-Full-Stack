// admin/src/pages/Orders.jsx

import React, {
  useEffect,
  useState
} from 'react'

import axios from 'axios'

import { backendUrl, currency } from '../App'

import { toast } from 'react-toastify'

const Orders = ({ token }) => {

  // ======================================================
  // STATE
  // ======================================================

  const [orders, setOrders] = useState([])

  // ======================================================
  // FETCH ALL ORDERS
  // ======================================================

  const fetchAllOrders = async () => {

    if (!token) {
      return null
    }

    try {

      const response = await axios.post(

        backendUrl + '/api/order/list',

        {},

        {
          headers: { token }
        }

      )

      if (response.data.success) {

        setOrders(response.data.orders.reverse())

      }

      else {

        toast.error(response.data.message)

      }

    }

    catch (error) {

      console.log(error)

      toast.error(error.message)

    }

  }

  // ======================================================
  // STATUS HANDLER
  // ======================================================

  const statusHandler = async (event, orderId) => {

    try {

      const response = await axios.post(

        backendUrl + '/api/order/status',

        {
          orderId,
          status: event.target.value
        },

        {
          headers: { token }
        }

      )

      if (response.data.success) {

        await fetchAllOrders()

      }

    }

    catch (error) {

      console.log(error)

      toast.error(error.message)

    }

  }

  // ======================================================
  // USE EFFECT
  // ======================================================

  useEffect(() => {

    fetchAllOrders()

  }, [token])

  // ======================================================
  // RETURN JSX
  // ======================================================

  return (

    <div>

      <h3 className='text-xl font-semibold mb-5'>
        Order Page
      </h3>

      <div>

        {

          orders.map((order, index) => (

            <div

              key={index}

              className='grid grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 p-5 md:p-8 my-3 text-xs sm:text-sm text-gray-700'

            >

              {/* ICON */}

              {/* ICON */}

              <img
                className='w-14 h-14 object-contain border p-2 rounded'
                src='https://cdn-icons-png.flaticon.com/512/679/679720.png'
                alt=""
              />

              {/* ORDER DETAILS */}

              <div>

                <div>

                  {

                    order.items.map((item, index) => {

                      if (index === order.items.length - 1) {

                        return (

                          <p key={index} className='py-0.5'>

                            {item.name} x {item.quantity}

                            <span> {item.size} </span>

                          </p>

                        )

                      }

                      else {

                        return (

                          <p key={index} className='py-0.5'>

                            {item.name} x {item.quantity}

                            <span> {item.size} </span>,

                          </p>

                        )

                      }

                    })

                  }

                </div>

                {/* ADDRESS */}

                <div className='mt-3 mb-2 font-medium'>

                  <p>

                    {order.address.firstName + " " + order.address.lastName}

                  </p>

                  <p>

                    {order.address.street + ","}

                  </p>

                  <p>

                    {order.address.city + ", " + order.address.state + ", " + order.address.country}

                  </p>

                  <p>

                    {order.address.zipcode}

                  </p>

                </div>

                {/* PHONE */}

                <p>

                  {order.address.phone}

                </p>

              </div>

              {/* PAYMENT */}

              <div>

                <p className='text-sm sm:text-[15px]'>

                  Items : {order.items.length}

                </p>

                <p className='mt-3'>

                  Method : {order.paymentMethod}

                </p>

                <p>

                  Payment : {order.payment ? 'Done' : 'Pending'}

                </p>

                <p>

                  Date : {new Date(order.date).toDateString()}

                </p>

              </div>

              {/* AMOUNT */}

              <p className='text-sm sm:text-[15px]'>

                {currency}{order.amount}

              </p>

              {/* STATUS */}

              <select

                onChange={(event) => statusHandler(event, order._id)}

                value={order.status}

                className='p-2 font-semibold'

              >

                <option value="Order Placed">
                  Order Placed
                </option>

                <option value="Packing">
                  Packing
                </option>

                <option value="Shipped">
                  Shipped
                </option>

                <option value="Out For Delivery">
                  Out For Delivery
                </option>

                <option value="Delivered">
                  Delivered
                </option>

              </select>

            </div>

          ))

        }

      </div>

    </div>

  )

}

export default Orders