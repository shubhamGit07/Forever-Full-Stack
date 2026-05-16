import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {

  const [visible, setVisible] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    userData
  } = useContext(ShopContext)

  // ======================================================
  // LOGOUT
  // ======================================================

  const logout = () => {

    localStorage.removeItem('token')

    setToken('')

    setCartItems({})

    navigate('/login')

  }

  return (

    <div className='flex items-center justify-between py-5 font-medium border-b border-gray-200'>

      {/* ======================================================
          LOGO
      ====================================================== */}

      <Link to='/'>

        <img
          src={assets.logo}
          className='w-36'
          alt="Logo"
        />

      </Link>

      {/* ======================================================
          DESKTOP MENU
      ====================================================== */}

      <ul className='hidden sm:flex gap-6 text-sm text-gray-700 items-center'>

        <NavLink
          to='/'
          className='flex flex-col items-center gap-1 hover:text-black transition'
        >
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink
          to='/collection'
          className='flex flex-col items-center gap-1 hover:text-black transition'
        >
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink
          to='/about'
          className='flex flex-col items-center gap-1 hover:text-black transition'
        >
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink
          to='/contact'
          className='flex flex-col items-center gap-1 hover:text-black transition'
        >
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        {/* ADMIN PANEL BUTTON */}

        {/* ADMIN PANEL BUTTON */}

        <a
          href='https://forever-admin-five-orpin.vercel.app'
          target='_blank'
          rel='noreferrer'
          className='px-5 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:text-black hover:border-gray-300 transition-all duration-300 outline-none focus:outline-none focus:ring-0'
        >
          Admin Panel
        </a>

      </ul>

      {/* ======================================================
          RIGHT SECTION
      ====================================================== */}

      <div className='flex items-center gap-6'>

        {/* SEARCH */}

        <img

          onClick={() => {

            navigate('/collection')

            setShowSearch(true)

          }}

          src={assets.search_icon}

          className='w-5 cursor-pointer'

          alt="Search"

        />

        {/* PROFILE */}

        <div className='group relative'>

          <img

            onClick={() => {

              if (!token) {
                navigate('/login')
              } else {
                setProfileOpen(!profileOpen)
              }

            }}

            className='w-5 cursor-pointer'

            src={assets.profile_icon}

            alt="Profile"

          />

          {

            token && (

              <div className={`${profileOpen ? 'block' : 'hidden'} absolute dropdown-menu right-0 pt-4 z-10`}>

                <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-500 rounded shadow-lg border border-gray-100'>

                  <p className='text-black font-semibold'>
                    Hi, {userData?.name || "User"}
                  </p>

                  <p className='text-xs text-gray-400'>
                    Signed In
                  </p>

                  <hr />

                  <p
                    onClick={() => navigate('/orders')}
                    className='cursor-pointer hover:text-black transition'
                  >
                    Orders
                  </p>

                  <p
                    onClick={logout}
                    className='cursor-pointer hover:text-red-500 transition'
                  >
                    Logout
                  </p>

                </div>

              </div>

            )

          }

        </div>

        {/* CART */}

        <Link
          to='/cart'
          className='relative'
        >

          <img
            src={assets.cart_icon}
            className='w-5 min-w-5'
            alt="Cart"
          />

          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>

            {getCartCount()}

          </p>

        </Link>

        {/* MOBILE MENU */}

        <img

          onClick={() => setVisible(true)}

          src={assets.menu_icon}

          className='w-5 cursor-pointer sm:hidden'

          alt="Menu"

        />

      </div>

      {/* ======================================================
          MOBILE SIDEBAR
      ====================================================== */}

      <div
        className={`${visible ? 'w-full' : 'w-0'} absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-20`}
      >

        <div className='flex flex-col text-gray-600'>

          {/* BACK */}

          <div

            onClick={() => setVisible(false)}

            className='flex items-center gap-4 p-3 cursor-pointer'

          >

            <img
              className='h-4 rotate-180'
              src={assets.dropdown_icon}
              alt="Back"
            />

            <p>Back</p>

          </div>

          {/* MOBILE LINKS */}

          <NavLink

            onClick={() => setVisible(false)}

            className='py-2 pl-6 border-b border-gray-100'

            to='/'

          >

            HOME

          </NavLink>

          <NavLink

            onClick={() => setVisible(false)}

            className='py-2 pl-6 border-b border-gray-100'

            to='/collection'

          >

            COLLECTION

          </NavLink>

          <NavLink

            onClick={() => setVisible(false)}

            className='py-2 pl-6 border-b border-gray-100'

            to='/about'

          >

            ABOUT

          </NavLink>

          <NavLink

            onClick={() => setVisible(false)}

            className='py-2 pl-6 border-b border-gray-100'

            to='/contact'

          >

            CONTACT

          </NavLink>

          {/* MOBILE ADMIN PANEL */}

          <a

            href='https://forever-admin-five-orpin.vercel.app'

            target='_blank'

            rel='noreferrer'

            className='py-2 pl-6 border-b border-gray-100'

          >

            ADMIN PANEL

          </a>

          {

            token && (

              <NavLink

                onClick={() => setVisible(false)}

                className='py-2 pl-6 border-b border-gray-100'

                to='/orders'

              >

                ORDERS

              </NavLink>

            )

          }

        </div>

      </div>

    </div>

  )

}

export default Navbar