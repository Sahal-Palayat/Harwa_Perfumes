const { User, Product, Category, Address, Cart, Order } = require('../models/schemas')
const bcrypt = require('bcrypt')
const { default: mongoose } = require('mongoose')


//---------------user side-----------------------
const placeOrder = async (req, res) => {

    const addressId = req.body.addressId;
    const paymentMethod = req.body.paymentMethod;
    const userId = req.session.user_id;
    const grandTotal=req.body.grandTotal;
    let orderData;
    try {
      const cart = await Cart.findOne({ user: userId });
      if (cart) {
       const Products= cart.items.filter((item) => item.selected === true);
       
        
        orderData = {
          user: userId,
          address:addressId,
          products: Products,
          paymentMethod:paymentMethod,
          grandTotal:grandTotal,
        };
  
       
      }
  
      const insertOrder = await Order.insertMany(orderData);
      res.redirect('/checkout')
    } catch (error) {
      console.log(error);
      res.status(404).json({ status: true });
    }
  };


const loadOrderView=async (req,res)=>{
    try {
        const userId=req.query.id
        const user =await User.findById(userId)
        const userData=await User.find({is_admin:false}).sort({name:1})
        const order=await Order.findById(req.query.id).populate('user').populate('products.product')
        console.log(order,req.query.id);
        
        res.render('users/orderview',{order:order,user:userData})
    } catch (error) {
        console.log(error);
    }
}




















  //------------------admin side-----------------------

const loadOrderList=async (req,res)=>{
    try {
        const order= await Order.find({}).populate('user')

     
        res.render('admin/orderslist',{order})
    } catch (error) {
        console.log(error);
    }
}


const loadOrderDetails=async (req,res)=>{
    try {
        const order=await Order.findById(req.query.id).populate('user').populate('products.product')
        console.log(order,req.query.id);
        
        res.render('admin/orderdetails',{order:order})
    } catch (error) {
        console.log(error);
    }
}

const updateStatus=async (req,res)=>{
    try {
        const orderId=req.body.orderId
        const newStatus=req.body.status 

        console.log(orderId)
        console.log(newStatus)

        const updateStatus= await Order.findByIdAndUpdate({_id:orderId},{$set:{status:newStatus}})
        console.log(updateStatus);

    } catch (error) {
        console.log(error);
    }
}







module.exports={
    placeOrder,
    loadOrderList,
    loadOrderDetails,
    loadOrderView,
    updateStatus
}