import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './components/Landing'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import ForgotPassword from './components/ForgotPassword'
import ViewProduct from './components/ViewProduct'
import Profile from './components/Profile'
import EditProduct from './components/EditProduct'
import Cart from './components/Cart'
import PlaceOrder from './components/PlaceOrder'
import OrderConfirm from './components/OrderConfirm'
import MyOrders from './components/MyOrders'
import AdminOrders from './components/AdminOrders'
import AdminDashboard from './components/AdminDashboard'
import ManageUsers from './components/ManageUsers'
import Wishlist from './components/Wishlist'
import Payment from './components/Payment'
import PaymentSuccess from './components/PaymentSuccess'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/viewproduct/:id" element={<ViewProduct />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editproduct/:id" element={<EditProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/orderconfirm" element={<OrderConfirm />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/adminorders" element={<AdminOrders />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/manageusers" element={<ManageUsers />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  )
}

export default App