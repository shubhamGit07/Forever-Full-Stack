// App.jsx

import React from 'react'
import { Routes, Route } from 'react-router-dom'

// ======================================================
// PAGES
// ======================================================

import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Verify from './pages/Verify' // ✅ ADDED

// ======================================================
// COMPONENTS
// ======================================================

import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import Footer from './components/Footer'

// ======================================================
// TOASTIFY
// ======================================================

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {

  return (

    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

      {/* ======================================================
          TOAST CONTAINER
      ====================================================== */}

      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />

      {/* ======================================================
          NAVBAR + SEARCH
      ====================================================== */}

      <Navbar />

      <SearchBar />

      {/* ======================================================
          ROUTES
      ====================================================== */}

      <Routes>

        {/* HOME */}

        <Route
          path='/'
          element={<Home />}
        />

        {/* COLLECTION */}

        <Route
          path='/collection'
          element={<Collection />}
        />

        {/* ABOUT */}

        <Route
          path='/about'
          element={<About />}
        />

        {/* CONTACT */}

        <Route
          path='/contact'
          element={<Contact />}
        />

        {/* PRODUCT */}

        <Route
          path='/product/:productId'
          element={<Product />}
        />

        {/* CART */}

        <Route
          path='/cart'
          element={<Cart />}
        />

        {/* LOGIN */}

        <Route
          path='/login'
          element={<Login />}
        />

        {/* PLACE ORDER */}

        <Route
          path='/place-order'
          element={<PlaceOrder />}
        />

        {/* ORDERS */}

        <Route
          path='/orders'
          element={<Orders />}
        />

        {/* VERIFY PAYMENT */}

        <Route
          path='/verify'
          element={<Verify />}
        />

      </Routes>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <Footer />

    </div>

  )

}

export default App