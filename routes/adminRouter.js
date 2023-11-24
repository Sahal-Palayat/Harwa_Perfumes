const express=require('express')
const bodyparser=require('body-parser')
const session=require('express-session')
const nocache=require('nocache')
const logger=require('morgan')
const bcrypt=require('bcrypt')
// const userRouter = require('./userRouter')
const adminRouter=express.Router()
const {upload}=require('../multer/multer')
  
  
const auth = require('../middleware/adminAuth')
const adminController=require('../controllers/adminControllers')
const cartController=require('../controllers/cartController')
const orderController=require('../controllers/orderControllers')
const config=require('../config/config')
adminRouter.use(nocache());
adminRouter.use(session({
    secret:config.sessionSecretId, 
    resave:false,
    saveUninitialized:true
 }))  
   
// adminRouter.use(bodyparser.json())
// adminRouter.use(bodyparser.urlencoded({extended:true}))
// adminRouter.use(logger('dev'))
// adminRouter.set('view engine','ejs')
// adminRouter.set('views','./views/admin')
   
        
adminRouter.get('/admin',auth.isLogout,adminController.loadLogin)
adminRouter.post('/admin',auth.isLogout,adminController.verifyAdmin)
         
adminRouter.get('/admin/home',auth.isLogin,adminController.loadHome)
adminRouter.get('/userslist',auth.isLogin,adminController.loadUsers)
adminRouter.post('/searchUser',auth.isLogin,adminController.searchUser);
      
adminRouter.get('/admin/block',auth.isLogin,adminController.block)
adminRouter.get('/admin/unblock',auth.isLogin,adminController.unblock)

adminRouter.get('/category',auth.isLogin,adminController.loadCategoryList)
adminRouter.post('/category',auth.isLogin,adminController.addCategory)

adminRouter.get('/admin/category/block',auth.isLogin,adminController.blockCategory)
adminRouter.get('/admin/category/unblock',auth.isLogin,adminController.unBlockCategory)
adminRouter.get('/editcategory',auth.isLogin,adminController.loadEditCategory)
adminRouter.post('/editcategory',auth.isLogin,adminController.editCategory)

adminRouter.get('/listproducts',auth.isLogin,adminController.listProducts)
adminRouter.get('/addproduct',auth.isLogin,adminController.loadaddproduct)
adminRouter.post('/addproduct',auth.isLogin,upload.fields([{name:'coverimage',maxCount:1},{name:'images'}]),adminController.productadding)
  
adminRouter.get('/editproduct',auth.isLogin,adminController.loadEditProducts)
adminRouter.post('/editproduct',auth.isLogin,upload.fields([{name:'images'}]),adminController.editProducts)
adminRouter.get('/listproducts/unblock',auth.isLogin,adminController.productUnlist)
adminRouter.get('/listproducts/block',auth.isLogin,adminController.productList)

adminRouter.get('/ordersList',auth.isLogin,orderController.loadOrderList)
adminRouter.get('/orderDetails',auth.isLogin,orderController.loadOrderDetails)
adminRouter.post('/updateStatus',auth.isLogin,orderController.updateStatus)
adminRouter.get('/loadSalesReport',auth.isLogin,adminController.loadSalesReport)
adminRouter.get('/salesReport',auth.isLogin,adminController.salesReport)



module.exports=adminRouter;