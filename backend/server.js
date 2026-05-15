import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

// app config
const app = express()
const PORT = process.env.PORT || 4000

// connect db
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors({
    origin: [
        "https://forever-frontend-ruby-kappa.vercel.app"
    ],
    credentials: true
}))

// api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

// test route
app.get('/', (req, res) => {
    res.send('API Working')
})

// start server
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})