const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

mongoose.connect('mongodb://localhost:27017/myproject')
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err))

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: String,
  contact: String,
  role: { type: String, default: 'user' },
  status: { type: String, default: 'active' }
})
const User = mongoose.model('User', userSchema)

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: String,
  quantity: { type: Number, default: 0 },
  image: Object,
  category: { type: String, default: 'Other' },
  description: { type: String, default: '' }
})
const Product = mongoose.model('Product', productSchema)

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname)
})
const upload = multer({ storage })

// Register
app.post('/register', (req, res) => {
  const { name, email, password, address, contact } = req.body
  User.create({ name, email, password, address, contact })
    .then(() => res.json({ message: 'Registered!', status: 200 }))
})


// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then(user => {
      if (!user) return res.json({ message: 'User not found', status: 404 })
      if (user.password !== password) return res.json({ message: 'Wrong password', status: 401 })
      if (user.status === 'inactive') return res.json({ message: 'Account deactivated! Contact admin.', status: 403 })
      res.json({ message: 'Login success', status: 200, role: user.role, name: user.name })
    })
})

// Add Product
app.post('/addproduct', upload.single('image'), (req, res) => {
  const { name, price, quantity } = req.body
  Product.create({ name, price, quantity, image: req.file })
    .then(() => res.json({ message: 'Product Added!', status: 200 }))
})

// View Products
app.get('/products', (req, res) => {
  Product.find()
    .then(data => res.json({ data, status: 200 }))
})

// Forgot Password
app.post('/forgotpassword', (req, res) => {
  const { email, newPassword } = req.body
  User.findOne({ email })
    .then(user => {
      if (!user) return res.json({ message: 'User not found!', status: 404 })
      User.updateOne({ email }, { password: newPassword })
        .then(() => res.json({ message: 'Password changed!', status: 200 }))
    })
})

// View Single Product
app.get('/product/:id', (req, res) => {
  Product.findById(req.params.id)
    .then(data => res.json({ data, status: 200 }))
})

// Profile
app.post('/profile', (req, res) => {
  const { email } = req.body
  User.findOne({ email })
    .then(user => res.json({ data: user, status: 200 }))
})

// Edit Product
app.put('/editproduct/:id', (req, res) => {
  const { name, price, quantity, category, description } = req.body
  Product.updateOne({ _id: req.params.id }, { name, price, quantity, category, description })
    .then(() => res.json({ message: 'Product Updated!', status: 200 }))
})

// Delete Product
app.delete('/deleteproduct/:id', (req, res) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() => res.json({ message: 'Product Deleted!', status: 200 }))
})

// Cart Schema
const cartSchema = new mongoose.Schema({
  userEmail: String,
  productId: String,
  name: String,
  price: String,
  quantity: Number,
  image: Object
})
const Cart = mongoose.model('Cart', cartSchema)

// Add to Cart
app.post('/addtocart', (req, res) => {
  const { userEmail, productId, name, price, image } = req.body
  Cart.findOne({ userEmail, productId })
    .then(existing => {
      if(existing) {
        Cart.updateOne({ userEmail, productId }, { $inc: { quantity: 1 } })
          .then(() => res.json({ message: 'Cart updated!', status: 200 }))
      } else {
        Cart.create({ userEmail, productId, name, price, quantity: 1, image })
          .then(() => res.json({ message: 'Added to cart!', status: 200 }))
      }
    })
})

// Get Cart
app.get('/cart/:email', (req, res) => {
  Cart.find({ userEmail: req.params.email })
    .then(data => res.json({ data, status: 200 }))
})

// Remove from Cart
app.delete('/cart/:id', (req, res) => {
  Cart.deleteOne({ _id: req.params.id })
    .then(() => res.json({ message: 'Removed!', status: 200 }))
})

// Order Schema
const orderSchema = new mongoose.Schema({
  userEmail: String,
  items: Array,
  address: String,
  phone: String,
  total: Number,
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now }
})
const Order = mongoose.model('Order', orderSchema)

// Place Order
app.post('/placeorder', (req, res) => {
  const { userEmail, address, phone, total, paymentMethod } = req.body
  
  Cart.find({ userEmail })
    .then(cartItems => {
      Order.create({ userEmail, items: cartItems, address, phone, total, paymentMethod })
        .then(() => {
          // Stock reduce pannunga
          const updatePromises = cartItems.map(async item => {
          const product = await Product.findById(item.productId)
          const currentQty = Number(product.quantity) || 0
          const reduceQty = Number(item.quantity) || 1
          return Product.updateOne(
            { _id: item.productId },
            { $set: { quantity: currentQty - reduceQty } }
          )
        })
          Promise.all(updatePromises)
            .then(() => {
              Cart.deleteMany({ userEmail })
                .then(() => res.json({ message: 'Order placed!', status: 200 }))
            })
        })
    })
})

// Get My Orders
app.get('/myorders/:email', (req, res) => {
  Order.find({ userEmail: req.params.email })
    .sort({ date: -1 })
    .then(data => res.json({ data, status: 200 }))
})

// Get All Orders (Admin)
app.get('/allorders', (req, res) => {
  Order.find()
    .sort({ date: -1 })
    .then(data => res.json({ data, status: 200 }))
})

// Update Order Status
app.put('/orderstatus/:id', (req, res) => {
  const { status } = req.body
  Order.updateOne({ _id: req.params.id }, { status })
    .then(() => res.json({ message: 'Status updated!', status: 200 }))
})

// Admin Stats
app.get('/adminstats', async (req, res) => {
  const users = await User.countDocuments()
  const products = await Product.countDocuments()
  const orders = await Order.countDocuments()
  const revenueData = await Order.aggregate([
    { $group: { _id: null, total: { $sum: '$total' } } }
  ])
  const revenue = revenueData.length > 0 ? revenueData[0].total : 0
  const recentOrders = await Order.find().sort({ date: -1 }).limit(5)
  res.json({ stats: { users, products, orders, revenue }, recentOrders })
})

// Cancel Order
app.delete('/cancelorder/:id', (req, res) => {
  Order.deleteOne({ _id: req.params.id })
    .then(() => res.json({ message: 'Order cancelled!', status: 200 }))
})

// Get All Users
app.get('/allusers', (req, res) => {
  User.find()
    .then(data => res.json({ data, status: 200 }))
})

// Delete User
app.delete('/deleteuser/:id', (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then(() => res.json({ message: 'User deleted!', status: 200 }))
})

// Activate/Deactivate User
app.put('/userstatus/:id', (req, res) => {
  const { status } = req.body
  User.updateOne({ _id: req.params.id }, { status })
    .then(() => res.json({ message: 'Status updated!', status: 200 }))
})

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
  userEmail: String,
  productId: String,
  name: String,
  price: String,
  image: Object
})
const Wishlist = mongoose.model('Wishlist', wishlistSchema)

// Add to Wishlist
app.post('/addwishlist', (req, res) => {
  const { userEmail, productId, name, price, image } = req.body
  Wishlist.findOne({ userEmail, productId })
    .then(existing => {
      if(existing) {
        return res.json({ message: 'Already in wishlist!', status: 400 })
      }
      Wishlist.create({ userEmail, productId, name, price, image })
        .then(() => res.json({ message: 'Added to wishlist!', status: 200 }))
    })
})

// Get Wishlist
app.get('/wishlist/:email', (req, res) => {
  Wishlist.find({ userEmail: req.params.email })
    .then(data => res.json({ data, status: 200 }))
})

// Remove from Wishlist
app.delete('/wishlist/:id', (req, res) => {
  Wishlist.deleteOne({ _id: req.params.id })
    .then(() => res.json({ message: 'Removed!', status: 200 }))
})

// Update Profile
app.put('/updateprofile', (req, res) => {
  const { email, name, address, contact } = req.body
  User.updateOne({ email }, { name, address, contact })
    .then(() => res.json({ message: 'Profile Updated!', status: 200 }))
})

app.listen(5000, () => console.log('Server running on port 5000'))