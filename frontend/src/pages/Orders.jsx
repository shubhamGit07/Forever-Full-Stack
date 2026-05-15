// pages/Orders.jsx

import React, {
  useContext,
  useEffect,
  useState
} from 'react'

import axios from 'axios'

import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { toast } from 'react-toastify'

const Orders = () => {

  // ======================================================
  // CONTEXT
  // ======================================================

  const {
    backendUrl,
    token,
    currency
  } = useContext(ShopContext)

  // ======================================================
  // STATE
  // ======================================================

  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(false)

  // ======================================================
  // LOAD USER ORDERS
  // ======================================================

  const loadOrderData = async () => {

    try {

      if (!token) return

      setLoading(true)

      const response = await axios.post(

        backendUrl + '/api/order/userorders',

        {},

        {
          headers: { token }
        }

      )

      if (response.data.success) {

        const allOrdersItem = []

        response.data.orders.forEach((order) => {

          order.items.forEach((item) => {

            allOrdersItem.push({

              ...item,

              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id

            })

          })

        })

        setOrderData(allOrdersItem.reverse())

      }

      else {

        toast.error(response.data.message)

      }

    }

    catch (error) {

      console.log(error)

      toast.error(error.message)

    }

    finally {

      setLoading(false)

    }

  }

  // ======================================================
  // USE EFFECT
  // ======================================================

  useEffect(() => {

    loadOrderData()

  }, [token])

  // ======================================================
  // STATUS COLOR
  // ======================================================

  const getStatusColor = (status) => {

    switch (status) {

      case "Delivered":
        return "bg-green-600"

      case "Out For Delivery":
        return "bg-yellow-500"

      case "Packing":
        return "bg-blue-500"

      default:
        return "bg-green-500"

    }

  }

  // ======================================================
  // RETURN JSX
  // ======================================================

  return (

    <div className='border-t border-gray-300 pt-16'>

      {/* TITLE */}

      <div className='text-2xl'>

        <Title
          text1={'MY'}
          text2={'ORDERS'}
        />

      </div>

      {/* LOADING */}

      {

        loading && (

          <p className='mt-10 text-gray-500'>
            Loading orders...
          </p>

        )

      }

      {/* EMPTY ORDERS */}

      {

        !loading && orderData.length === 0 && (

          <p className='mt-10 text-gray-500'>
            No orders found.
          </p>

        )

      }

      {/* ORDER LIST */}

      <div>

        {

          orderData

            .filter(

              (item) =>

                item.payment === true ||

                item.paymentMethod === 'COD'

            )

            .map((item, index) => (

              <div

                key={`${item.orderId}-${index}`}

                className='py-4 border-t border-b border-gray-200 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'

              >

                {/* LEFT SIDE */}

                <div className='flex items-start gap-6 text-sm'>

                  <img
                    className='w-16 sm:w-20 object-cover rounded'
                    src={item.image?.[0] || '/placeholder.png'}
                    alt={item.name}
                  />

                  <div>

                    <p className='sm:text-base font-medium'>
                      {item.name}
                    </p>

                    <div className='flex flex-wrap items-center gap-3 mt-2 text-base text-gray-700'>

                      <p className='text-lg'>
                        {currency}{item.price}
                      </p>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                      <p>
                        Size: {item.size}
                      </p>

                    </div>

                    <p className='mt-2'>

                      Date:

                      <span className='text-gray-400 ml-1'>

                        {new Date(item.date).toDateString()}

                      </span>

                    </p>

                    <p className='mt-2'>

                      Payment:

                      <span className='text-gray-400 ml-1'>

                        {item.paymentMethod}

                      </span>

                    </p>

                  </div>

                </div>

                {/* RIGHT SIDE */}

                <div className='md:w-1/2 flex justify-between items-center'>

                  {/* STATUS */}

                  <div className='flex items-center gap-2'>

                    <p
                      className={`min-w-2 h-2 rounded-full ${getStatusColor(item.status)}`}
                    ></p>

                    <p className='text-sm md:text-base'>
                      {item.status}
                    </p>

                  </div>

                  {/* TRACK BUTTON */}

                  <button

                    onClick={loadOrderData}

                    className='border border-gray-300 px-4 py-2 text-sm font-medium rounded hover:bg-black hover:text-white transition-all duration-300'

                  >

                    Track Order

                  </button>

                </div>

              </div>

            ))

        }

      </div>
    </div>

  )

}

export default Orders