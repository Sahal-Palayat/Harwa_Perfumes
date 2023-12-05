const { User, Product, Category, Address, Cart, Order } = require('../models/schemas')
const bcrypt = require('bcrypt')
const { default: mongoose } = require('mongoose')
const Razorpay=require('razorpay')
var easyinvoice = require('easyinvoice');
const { Readable } = require("stream");
const { log } = require('console');
const mongodb = require("mongodb");

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
        let products=[]
        if (cart) {
         const Products= cart.items.filter((item) => item.selected === true);
       

         for (let element of cart.items) {
            products.push({ product: element.product, quantity: element.quantity });
            const product = await Product.findOne({ _id: element.product });
            let quantity = product.quantity - element.quantity;
            await Product.findByIdAndUpdate(product._id, { quantity });
          }


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
      
        amount:grandTotal*100,
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
            // let products=[]

            let orderData;
        
                const cart = await Cart.findOne({ user: userId });
            
                if (cart) {
                const Products= cart.items.filter((item) => item.selected === true);
            
            //     for (let element of cart.items) {
            //         products.push({ product: element.product, quantity: element.quantity });
            //         const product = await Product.findOne({ _id: element.product });
            //         let quantity = product.quantity - element.quantity;
            //         await Product.findByIdAndUpdate(product._id, { quantity });
            //       }
                
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
      grandTotal: req.body.total/100,
      payment_id: payment_details.razorpay_payment_id,
      payment_status: 'paid',
      order_Id: payment_details.razorpay_payment_id,
    };
  
    console.log(orderData);
    const order = await Order.insertMany([orderData]);
    res.status(200).json({ message: 'Success' });
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
        const amount =req.body.amount/100
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
        alert(orderId)
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


        const itemsperpage = 6;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(order.length / 3);
        const currentproduct = order.slice(startindex,endindex);
        res.render('admin/orderslist',{order:currentproduct,totalpages,currentpage})
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
}


const loadOrderDetails=async (req,res)=>{
    try {
        const order=await Order.findById(req.query.id).populate('user').populate('products.product')
      
        
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

const invoice=async(req,res)=>{
   try {
        console.log('thsan is quirey >>>>>>',req.query);

        const user=await User.findById(req.session.user_id)
        const order=await Order.findById(req.query.id).populate('user')
        console.log('this is order dtaa <<<<<',order,user);

        const address = order.user.address.find((item) => item._id.toString() === order.address.toString());


        if (order){
            res.render('users/invoice',{order,user,address})
        }
                
            } catch (error) {
                console.log('Error hapence in invoice controller in the funtion invoice',error);
            }
    }


const invoiceDownload=async (req,res)=>{
   
        try {
                const id = req.query.id;
                console.log('///////////////// ',id);
                const userId = req.session.user_id;
                const result = await Order.findById({ _id: id }).populate('user').populate('products.product')
             // Extract the user's address based on the Order's address ID

                const address = result.user.address.find((item) => item._id.toString() === result.address.toString());

                
                const user = await User.findById({ _id: userId });      
               
                if (!result || !result.address) {
                    return res.status(404).json({ error: "Order not found or address missing" });
                }
         
                const order = {
                    id: id,
                    total: result.grandTotal,
                    date: result.createdAt, // Use the formatted date
                    paymentMethod: result.paymentMethod,
                    orderStatus: result.status,
                    name: address.name,
                    mobile: address.mobile,
                    house: address.areastreet,
                    pincode: address.pincode,
                    city: address.city,
                    state: address.state,
                    products: result.products,
                };
                console.log(order,';;;;;;;;;;;;;;;;;;;;;;;');        
                // Assuming products is an array, adjust if needed
                const products = order.products.map((product, i) => ({
                    quantity: parseInt(product.quantity),
                    description: product.product.name,
                    price: parseInt(product.product.offerPrice),
                    total: parseInt(result.grandTotal),
                    "tax-rate": 0,
                }));
        console.log(products);
                      
                const isoDateString = order.date;
                const isoDate = new Date(isoDateString);
            
                const options = { year: "numeric", month: "long", day: "numeric" };
                const formattedDate = isoDate.toLocaleDateString("en-US", options);
                const data = {
                  customize: {
                    //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
                  },
                  images: {
                    // The invoice background
                    background: "",
                  },
                  // Your own data
                  sender: {
                    company: "Harwa Perfumes",
                    address: "Decide Your Feel",
                    city: "Ernakulam",
                    country: "India",
                  },
                  client: {
                    company: "Customer Address",
                    "zip": order.name,
                    "city": order.city,
                    "address": order.pincode,
                    // "custom1": "custom value 1",
                    // "custom2": "custom value 2",
                    // "custom3": "custom value 3"
                  },
                  information: {
                    number: "order" + order.id,
                    date: formattedDate,
                  },
                  products: products,
                  "bottom-notice": "Happy shoping and visit Evara again",
                };
                console.log(data+'/////////////////////////////////////////////////////////////////');
            let pdfResult = await easyinvoice.createInvoice(data);
                const pdfBuffer = Buffer.from(pdfResult.pdf, "base64");
           
                // Set HTTP headers for the PDF response
                res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
                res.setHeader("Content-Type", "application/pdf");
            
                // Create a readable stream from the PDF buffer and pipe it to the response
                const pdfStream = new Readable();
                pdfStream.push(pdfBuffer);
                pdfStream.push(null);
                pdfStream.pipe(res);
            } catch (error) {
                console.error('Error in invoiceDownload:', error);
                res.status(500).json({ error: error.message });
            }
            
      
}

const returnOrder = async (req, res) => {
    try {

        console.log('hjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
      const orderId = req.query.orderId;
      const userId = req.session.user_id;
  
   
      const user = await User.findOne({ _id: userId });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const order = await Order.findByIdAndUpdate(orderId, {
        status: 'Returned'
      }, { new: true });
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      user.wallet += order.grandTotal;


      wallet= user.wallet
        // amount: user.wallet ,
       
    
    
   
      await user.save(wallet);
  
      for (const productData of order.products) {
        const productId = productData.ProductId;
        const quantity = productData.quantity;
  
        // Find the corresponding product in the database
        const product = await Product.findById(productId);
  
        if (product) {
          product.quantity += quantity;
          await product.save();
        }
      }
      
  
      res.redirect('/userprofile');
    } catch (error) {
      console.log('Error occurred in returnOrder function:', error);
     
      res.status(500).json({ message: 'Internal Server Error' });
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
    updateWallet,
    invoiceDownload,
    invoice,
    returnOrder
}