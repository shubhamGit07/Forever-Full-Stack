import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Navigate } from 'react-router-dom'

const Login = () => {

  // ---------------- CONTEXT ----------------

  const {
    token,
    setToken,
    navigate,
    backendUrl
  } = useContext(ShopContext)

  // ---------------- STATES ----------------

  const [currentState, setCurrentState] = useState('Login')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  // ---------------- CHECK TOKEN ON RELOAD ----------------

  useEffect(() => {

    const savedToken = localStorage.getItem('token')

    if (savedToken && !token) {
      setToken(savedToken)
    }

  }, [])

  // ---------------- REDIRECT AFTER LOGIN ----------------

  useEffect(() => {

    if (token) {
      navigate('/')
    }

  }, [token])

  // ---------------- FORM SUBMIT ----------------

  const onSubmitHandler = async (event) => {

    event.preventDefault()

    try {

      setLoading(true)

      let response

      // ---------- SIGN UP ----------

      if (currentState === 'Sign Up') {

        response = await axios.post(
          backendUrl + '/api/user/register',
          {
            name,
            email,
            password
          }
        )

      }

      // ---------- LOGIN ----------

      else {

        response = await axios.post(
          backendUrl + '/api/user/login',
          {
            email,
            password
          }
        )

      }

      // ---------- SUCCESS ----------

      if (response.data.success) {

        const newToken = response.data.token

        const userName = response.data.user?.name || name

        localStorage.setItem('userName', userName)

        setToken(newToken)

        localStorage.setItem('token', newToken)

        toast.success(
          currentState === 'Login'
            ? 'Login Successful'
            : 'Account Created Successfully'
        )

        // Clear fields

        setName('')
        setEmail('')
        setPassword('')

        navigate('/')

      }

      // ---------- FAILED ----------

      else {

        toast.error(response.data.message)

      }

    } catch (error) {

      console.log(error)

      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Something went wrong'
      )

    } finally {

      setLoading(false)

    }

  }

  // ---------------- IF ALREADY LOGGED IN ----------------

  if (token) {
    return <Navigate to="/" />
  }

  // ---------------- UI ----------------

  return (

    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'
    >

      {/* ---------- TITLE ---------- */}

      <div className='inline-flex items-center gap-2 mb-2 mt-10'>

        <p className='prata-regular text-3xl'>
          {currentState}
        </p>

        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />

      </div>

      {/* ---------- NAME ---------- */}

      {
        currentState === 'Sign Up' && (

          <input
            type="text"
            placeholder='Name'
            className='w-full px-3 py-2 border border-gray-300 outline-none'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

        )
      }

      {/* ---------- EMAIL ---------- */}

      <input
        type="email"
        placeholder='Email'
        className='w-full px-3 py-2 border border-gray-300 outline-none'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* ---------- PASSWORD ---------- */}

      <input
        type="password"
        placeholder='Password'
        className='w-full px-3 py-2 border border-gray-300 outline-none'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* ---------- LINKS ---------- */}

      <div className='w-full flex justify-between text-sm mt-[-8px]'>

        <p className='cursor-pointer hover:text-black'>
          Forgot your password?
        </p>

        {
          currentState === 'Login'

            ? (

              <p
                onClick={() => setCurrentState('Sign Up')}
                className='cursor-pointer hover:text-black'
              >
                Create Account
              </p>

            )

            : (

              <p
                onClick={() => setCurrentState('Login')}
                className='cursor-pointer hover:text-black'
              >
                Login Here
              </p>

            )
        }

      </div>

      {/* ---------- BUTTON ---------- */}

      <button
        type='submit'
        disabled={loading}
        className='bg-black text-white font-light px-8 py-2 mt-4 w-full active:bg-gray-700 disabled:opacity-70'
      >

        {
          loading
            ? 'Please Wait...'
            : currentState === 'Login'
              ? 'Sign In'
              : 'Sign Up'
        }

      </button>

    </form>

  )

}

export default Login