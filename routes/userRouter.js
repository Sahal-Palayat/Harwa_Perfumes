const express=require('express')
const bodyparser=require('body-parser')
const session=require('express-session')
const nocache=require('nocache')
const logger=require('morgan')
const bcrypt=require('bcrypt')
const userRouter=express.Router()
  
  
const auth = require('../middleware/userAuth')
const userController=require('../controllers/userControllers')
const cartController=require('../controllers/cartController')
const orderController=require('../controllers/orderControllers')
const config=require('../config/config')
userRouter.use(nocache());
userRouter.use(session({
    secret:config.sessionSecretId, 
    resave:false,
    saveUninitialized:true
 }))
  
// userRouter.use(bodyparser.json())
// userRouter.use(bodyparser.urlencoded({extended:true}))
// userRouter.use(logger('dev'))
// userRouter.set('view engine','ejs')
// userRouter.set('views','./views/users')
  
userRouter.get('/',auth.isLogout,userController.loadMain)
userRouter.get('/register',auth.isLogout,userController.loadRegister);
userRouter.post('/register',auth.isLogout,userController.insertUser);
   
userRouter.post('/verify-otp',userController.verifyOTP)
userRouter.get('/login',auth.isLogout,userController.loadLogin);
userRouter.post('/login',auth.isLogout,userController.verifyUser);
userRouter.get('/home',auth.isLogin,userController.loadHome);
userRouter.get('/logout',auth.isLogin,userController.userLogout);  
userRouter.get('/productdetails',auth.isLogin,userController.loadProductDetails)

userRouter.get('/userprofile',auth.isLogin,userController.loadUserProfile)
userRouter.get('/addAddress',auth.isLogin,userController.loadAddAddress)
userRouter.post('/addAddress',auth.isLogin,userController.addAddress)
userRouter.get('/editAddress',auth.isLogin,userController.loadEditAddress)
userRouter.post('/editAddress',auth.isLogin,userController.editAddress)
userRouter.get('/deleteAddress',auth.isLogin,userController.deleteAddress)
userRouter.get('/editprofile',auth.isLogin,userController.loadEditProfile)
userRouter.post('/editprofile',auth.isLogin,userController.editProfile)
 
userRouter.get('/cartPage',auth.isLogin,cartController.LoadCart)
userRouter.get('/addToCart',auth.isLogin,cartController.addToCart)
userRouter.post('/updateCart',auth.isLogin,cartController.incCartItem)
userRouter.post('/deleteItem',auth.isLogin,cartController.deleteItemCart)
userRouter.get('/dltAllItem',auth.isLogin,cartController.dltAllItem)

userRouter.get('/checkout',auth.isLogin,userController.loadCheckout)
userRouter.post('/selectProduct',auth.isLogin,cartController.selectProduct)

userRouter.post('/placeOrder',auth.isLogin,orderController.placeOrder)
userRouter.get('/orderView',auth.isLogin,orderController.loadOrderView)
userRouter.post('/cancelStatus',auth.isLogin,orderController.cancelStatus)
userRouter.get ('/resetPassword',userController.resetPassword)
userRouter.post ('/resetPassword',userController.getpassword)
userRouter.get('/forgotPass',auth.isLogin,userController.forgotpass)
userRouter.post('/updatePayment',auth.isLogin,orderController.updatePayment)
userRouter.post('/addWallet',auth.isLogin,orderController.addWallet)
userRouter.post('/updateWallet',auth.isLogin,orderController.updateWallet)
module.exports=userRouter;   