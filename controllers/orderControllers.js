const { User, Product, Category, Address, Cart, Order } = require('../models/schemas')
const bcrypt = require('bcrypt')
const { default: mongoose } = require('mongoose')
const Razorpay=require('razorpay')


//---------------user side-----------------------

const razorpay = new Razorpay({
    key_id: 'rzp_test_1tAVpk23yo2fMa',
    key_secret: 'WjdaaKg5wcv0IEjvQAfR6bM4',
  });
  

const placeOrder = async (req, res) => {
    //-------------------------COD--------
    try {
    const addressId = req.body.addressId;
    const paymentMethod = req.body.payment;
    const userId = req.session.user_id;
    const grandTotal=req.body.grandTotal;
  

   
  //------------------COD-------------------------

      if (paymentMethod === 'COD') {
        console.log('cod AAAAAN MMMMMMMMMMMMM ');
        
        let orderData;
  
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
        if (insertOrder) {
          console.log('Order added successfully');
          return res.status(200).json({ status: true });
        }
      }
//-----------------end cod--------------
 

//------------razorpay--------------

   if(paymentMethod==='Razorpay'){
    console.log('razorpayyyyyyyy');
    
    const options={
      
        amount:grandTotal,
        currency:'INR',
        receipt:'order_receipt_'+Date.now(),
        payment_capture:1
    }
        razorpay.orders.create(options,(err,data)=>{
            if(err){
                console.error('Error creating Razorpay order:', err);

                return res.status(500).json({status:false ,message:'Razorpay order creation failed'})
            }
            console.log('Razorpay order created:');

            return res.status(201).json({order:data})
        })
   }

   //--------------end razorpay--------------

   //---------------wallet---------------
     
        if (paymentMethod === 'Wallet') {
            console.log('wallet alle mwonu ');
         
            const userWallet = await User.findOne({ _id: userId });
            console.log(userWallet);
            const balance = userWallet.wallet
            if (grandTotal > balance) {
            console.log('Low wallet balance');
            return res.status(501).json({ status: true });

            }
            let orderData;
        
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
            userWallet.wallet -= grandTotal;
            await userWallet.save();
            if (insertOrder) {
            console.log('Order added successfully');
            return res.status(200).json({ status: true });

            }
        }



    } catch (error) {
      console.log(error);
      
     res.render('users/page-404')
    }
  };

  const updatePayment = async (req, res) => {
    try {
    
    const userId = req.session.user_id;
    console.log(req.body);
   
    const payment_details = req.body.payment_details;
  
  
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ status: false, message: 'Cart not found' });
    }
  
    const selectedProducts = cart.items.filter((item) => item.selected);

    
    
  
    const orderData = {
      user: userId,
      address: req.body.addressId,
      products: selectedProducts.map(item => ({ ...item})),
      paymentMethod: req.body.payment,
      grandTotal: req.body.total,
      payment_id: payment_details.razorpay_payment_id,
      payment_status: 'paid',
      order_Id: payment_details.razorpay_payment_id,
    };
  
    console.log(orderData);
    const order = await Order.insertMany([orderData]);
  
    if (order) {
      console.log('order added ');
    }
    } catch (error) {
            console.log(error);
            res.render('users/page-404')

    }
  
  }


  const addWallet=async (req,res)=>{
    try {
        const amount=req.body.amount
        console.log(amount);

        var options={
      
            amount:amount*100,
            currency:'INR',
            receipt:'order_receipt_'+Date.now(),
            payment_capture:1
        }
            razorpay.orders.create(options,(err,data)=>{
                if(err){
                    return res.status(500).json({status:false ,message:'Razorpay order creation failed'})
                }
    
                return res.status(200).json({order:data})
            })



    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
  }

  const updateWallet=async (req,res)=>{
    try {
        const userId=req.session.user_id
        const amount =req.body.amount
        console.log(amount);
        console.log(userId);
        const updatewallet = await User.findByIdAndUpdate(
            { _id: userId },
            { $inc: { wallet: amount } }
          );
            
        if(updatewallet){
            res.status(200).json({})
        }
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
  }


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
        res.render('users/page-404')

    }
}


const cancelStatus=async (req,res)=>{
    try {
        const orderId=req.body.orderId
        const reason=req.body.reason
        // const status=req.body.status
        
        const update=await Order.findByIdAndUpdate(orderId,{status:'Cancelled'})
        if(update){
            console.log(update);
            res.status(200).json({status:true});
        }
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
}






  //------------------admin side-----------------------

const loadOrderList=async (req,res)=>{
    try {
        const order= await Order.find({}).populate('user')
        order.reverse()
        res.render('admin/orderslist',{order})
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
}


const loadOrderDetails=async (req,res)=>{
    try {
        const order=await Order.findById(req.query.id).populate('user').populate('products.product')
        console.log(order,req.query.id);
        
        res.render('admin/orderdetails',{order:order})
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

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
        res.render('users/page-404')

    }
}







module.exports={
    placeOrder,
    loadOrderList,
    loadOrderDetails,
    loadOrderView,
    updateStatus,
    cancelStatus,
    updatePayment,
    addWallet,
    updateWallet
}