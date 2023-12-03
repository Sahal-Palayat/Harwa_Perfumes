const { query } = require('express')
const {Admin}=require('../models/schemas')
const {User}=require('../models/schemas')
const {Product}=require('../models/schemas')
const {Category}=require('../models/schemas')
const {Order}=require('../models/schemas')
const sharp=require('sharp')
const PDFDocument=require('pdfkit')


const loadLogin = async(req,res)=>{
    try {
 
       res.render('admin/admin-login',{message :''});
       
    } catch (error) {
       console.log(error.message);
       res.render('users/page-404')

    }
 }
 
 const verifyAdmin= async (req,res)=>{
    
    try {
        const email=req.body.email
        const password=req.body.password
        console.log(req.body);
         const adminData=await Admin.findOne({email:email})

         if(adminData){
            if(adminData.password===password){
                if(adminData.is_admin===false){
                    res.render('admin/admin-login',{message:'Invalid Admin'})
                }else{
                    req.session.admin_id=adminData._id
                    res.redirect('/admin/home')
                }
            }else{  
                res.render('admin/admin-login',{message:'Invalid Admin'})
            }
         }else{
            res.render('admin/admin-login',{message:'Invalid Admin'})
         }
    } catch (error) {
        console.log(error.message);
        res.render('users/page-404')

    }
 }   

 const loadHome=async (req,res)=>{
    try {
        const orderCount= await Order.find({}).count()
        const productCount= await Product.find({}).count()
        const users=await User.find({}).sort({ _id: -1 }).limit(3)
        const order=await Order.find({}).sort({_id:-1}).limit(10).populate('user')
        const products=  await Product.find()


        const aggregationResult = await Order.aggregate([
      { $match: 
        { status: 'Delivered' } },
      { $group:
         { _id: null, totalPrice: { $sum: '$grandTotal' } } }
    ]);

//-------------monthly sales-----------
    const monthlySales = await Order.aggregate([
        {
            $match: {
                status: "Delivered", // Filter by status
            },
        },
        {
            $group: {
                _id: {
                    $month: '$createdAt',
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                '_id': 1,
            },
        },
    ]);
    const monthlySalesArray = Array.from({ length: 12 }, (_, index) => {
        const monthData = monthlySales.find((item) => item._id === index + 1);
        return monthData ? monthData.count : 0;
    });

//---------monthly sales end----------------

//---------product graph---------------
            const productsPerMonth = Array(12).fill(0);
            products.forEach(product => {
            const creationMonth = product.createdAt.getMonth();
            productsPerMonth[creationMonth]++;
            });
//----------end product graph end



//------------order ststus--------------------

                    const orderStatus = await Order.aggregate([
                        {
                            $match: {
                                status: {
                                    $in: ['Delivered', 'Pending', 'Cancelled', 'Out for Delivery']
                                }
                            },
                        },
                        {
                            $group: {
                                _id: '$status', // Group by status instead of month
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $sort: {
                                '_id': 1,
                            },
                        },
                    ]);

                    const orderStatusArray = Array.from({ length: 4 }, (_, index) => {
                        const status = ['Delivered', 'Pending', 'Cancelled', 'Out for Delivery'][index];
                        const statusData = orderStatus.find((item) => item._id === status);
                        return statusData ? statusData.count : 0;
                    });
                    
//-----------end order status




    const totalRevenue = aggregationResult.length > 0 ? aggregationResult[0].totalPrice : 0;

        res.render('admin/dashboard',{orderCount,productCount,users,order,totalRevenue,monthlySalesArray,productsPerMonth,orderStatusArray})
    } catch (error) {
        console.log(error.message);
        res.render('users/page-404')

    }
 }

 const loadUsers=async (req,res)=>{
    try {
        const userData=await User.find({is_admin:false}).sort({name:1})
        res.render('admin/userslist',{users:userData})
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
 }

 const searchUser = async(req,res)=>{
    try {
       const name = req.body.name;
       const usersData = await User.find({is_admin:false,name:{$regex:name,$options :'i'}}).sort({name:1});
          res.render('admin/userslist',{users:usersData});
    } catch (error) {
       console.log(error)
       res.render('users/page-404')

    }
 }
 
 
 const block=async (req,res)=>{
    
    try {
        const userId=req.query.id
        console.log(userId);
        const blockUser=await User.findByIdAndUpdate(userId,{is_blocked:true})
        if(blockUser){
            res.redirect('/userslist')
        }else{
            res.status(404).send('User not found')
        }
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
 }

 const unblock=async (req,res)=>{
    try {
        const userId=req.query.id
        const unBlockUser=await User.findByIdAndUpdate(userId,{is_blocked:false})

        if(unBlockUser){
            res.redirect('/userslist')
        }else{
            res.status(404).send('User not found')
        }
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
 }

 const loadCategoryList=async (req,res)=>{
    try {
        const category=await Category.find({});
        // console.log(category);
        res.render('admin/categorylist',{categories:category})
        
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
 }
  
 const addCategory=async (req,res)=>{
    try {
       
        const {name,description}=req.body
        const checkData=await Category.findOne({name:name})
        if(checkData){
            const data=await Category.find({})
            res.render('admin/categorylist',{errMessage:'Category already found',categories:data})
        }else{
           
            console.log(req.body);
            const category= new Category({
                name:req.body.name,
                description:req.body.description,
            })
  
            await category.save()
            const data=await Category.find({})
            const errMessage='';
            res.render('admin/categorylist',{errMessage,categories:data})
        }

    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
 }   
 
const blockCategory=async (req,res)=>{
    try {
        const categoryId=req.query.id
        console.log(categoryId);
        const blocked=await Category.findByIdAndUpdate(categoryId,{is_listed:false})
        if(blocked){
            res.redirect('/category')
        }else{
            res.status(404).send('User not found')
        }
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
}

const unBlockCategory=async (req,res)=>{
    try {
        const categoryId=req.query.id
        console.log(categoryId);
        const unblocked=await Category.findByIdAndUpdate(categoryId,{is_listed:true})
        if(unblocked){
            res.redirect('/category')
        }else{
            res.status(404).send('User not found')
        }
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
}
const loadEditCategory=async (req,res)=>{
    try {
        const categoryId=req.query.id
        const category=await Category.findById(categoryId)
        console.log(category);
        res.render('admin/editcategory',{category:category})
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
}

const editCategory=async (req,res)=>{
    try {
      
        const categoryData= await Category.findByIdAndUpdate(req.body.id,
            {$set:{name:req.body.name,description:req.body.description}})
            
        res.redirect('/category')
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
}


const listProducts=async (req,res)=>{
    try {
        const product=await Product.find({})
 
        const itemsPerPage=10;
        const page=parseInt(req.query.page)||1
        const skip=(page-1)*itemsPerPage
       
        const products=await Product.find().skip(skip).limit(itemsPerPage)
        const totalProducts= await Product.countDocuments()
        const totalPages=Math.ceil(totalProducts/itemsPerPage)



        res.render('admin/listproducts',{products:products,currentPage:page,totalPages,req})
    

    } catch (error) {
        console.log(error); 
        res.render('users/page-404')

    }

}

const loadaddproduct=async (req,res)=>{
    try {
        const listedCategory=await Category.find({status:true}).sort({name:1})
        res.render('admin/addproduct',{category:listedCategory})
    } catch (error) {
        console.log(error);
    }
}
const productadding=async (req,res)=>{
    try {
        console.log(req.body,req.session.images,"=======================");
        const product={
            name:req.body.name,
            description:req.body.description,
            price:req.body.price,
            category:req.body.category,
            brand:req.body.brand,
            volume:req.body.volume,
            fragrance:req.body.fragrance,
            quantity:req.body.quantity,
            coverimage: `/products/${req.session.images[0]}`,
            images: [
                `/products/${req.session.images[1]}`,
                `/products/${req.session.images[2]}`,
                `/products/${req.session.images[3]}`,
            ]
        }
        console.log(product);
 

        req.session.images=null
        await Product.insertMany([product])

        res.redirect('/listproducts')

    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
}  

const loadEditProducts=async (req,res)=>{
    try {
        const productId=req.query.id
        const products=await Product.findById(productId)
        console.log(products);
        // const listedCategory=await Category.find({status:true}).sort({name:1})
        res.render('admin/editproducts',{products})
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }

}
  
const editProducts=async (req,res)=>{
    try {
        const productData= await Product.findByIdAndUpdate(req.body.id,
             {$set:{name:req.body.name,
                description:req.body.description,
                price:req.body.price,
                category:req.body.category,
                brand:req.body.brand,
                volume:req.body.volume,
                fragrance:req.body.fragrance,
                quantity:req.body.quantity,
                coverimage:req.session.coverimage,
                images:req.session.images
            
            }})
            res.redirect('/listproducts')

    } catch (error) {
        console.log(error)
        res.render('users/page-404')

    }
}

const productList=async (req,res)=>{
    try {
        const productId=req.query.id
        const blockProduct=await Product.findByIdAndUpdate(productId,{status:false})
        if(blockProduct){
            res.redirect('/listproducts')
        }else{
            res.status(404).send('User not found')
        }
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
}


const   productUnlist=async (req,res)=>{
    try {
        const productId=req.query.id
        const unBLockProduct=await Product.findByIdAndUpdate(productId,{status:true})
        if(unBLockProduct){
            res.redirect('/listproducts')
        }else{
            res.status(404).send('User not found')
        }
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
}

const loadSalesReport=async (req,res)=>{

    try {

        const orders= await Order.find({status:'Delivered'}).populate('user')

        const itemsPerPage=3
        const currentpage=parseInt(req.query.page)||1;
        const startIndex=(currentpage-1)*itemsPerPage
        const endIndex=startIndex+itemsPerPage
        const totalpages=Math.ceil(orders.length/3)
        const currentProduct=orders.slice(startIndex,endIndex)

        console.log(currentProduct);
        res.render('admin/salesreport',{orders:currentProduct,totalpages,currentpage})
        
    } catch (error) {
        console.log(error);
    }
}



const salesReport= async (req,res)=>{

    try {
        const date = req.query.date;
        let orders;

        const currentDate = new Date();

        // Helper function to get the first day of the current month
        function getFirstDayOfMonth(date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        }

        // Helper function to get the first day of the current year
        function getFirstDayOfYear(date) {
            return new Date(date.getFullYear(), 0, 1);
        }

        switch (date) {
            case 'today':
                orders = await Order.find({
                    status: 'Delivered',
                    createdAt: {
                        $gte: new Date().setHours(0, 0, 0, 0), // Start of today
                        $lt: new Date().setHours(23, 59, 59, 999), // End of today
                    },
                });
                break;
             case 'week':
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the first day of the week (Sunday)
                startOfWeek.setHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the last day of the week (Saturday)
                endOfWeek.setHours(23, 59, 59, 999);

                orders = await Order.find({
                    status: 'Delivered',
                    createdAt: {
                        $gte: startOfWeek,
                        $lt: endOfWeek,
                    },
                }).populate('user');
                break;
            case 'month':
                const startOfMonth = getFirstDayOfMonth(currentDate);
                const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

                orders = await Order.find({
                    status: 'Delivered',
                    createdAt: {
                        $gte: startOfMonth,
                        $lt: endOfMonth,
                    },
                }).populate('user');
                break;
            case 'year':
                const startOfYear = getFirstDayOfYear(currentDate);
                const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999);

                orders = await Order.find({
                    status: 'Delivered',
                    createdAt: {
                        $gte: startOfYear,
                        $lt: endOfYear,
                    },
                }).populate('user');
               
                break;
            default:
                // Fetch all orders
                orders = await Order.find({ status: 'Delivered' }).populate('user');
        }

        const itemsperpage = 3;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(orders.length / 3);
        const currentproduct = orders.slice(startindex,endindex);

        if (req.query.downloadPdf) {
            const doc = new PDFDocument();
            // Customize your PDF content here based on the sales report data
            doc.text('Sales Report', { align: 'center' });
            doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
            doc.moveDown();
            let orderCounter = 0;
            // Add your sales data to the PDF
            orders.forEach((order) => {
              doc.text(`Order ID: ORD${String(order._id.toString().slice(-4)).padStart(5, '0')}`, { fontSize: 12 });
              doc.text(`Customer Name: ${order.user ? order.user.name : 'N/A'}`, { fontSize: 12 });
              doc.text(`Price: ${order.grandTotal}`, { fontSize: 12 });
              doc.text(`Status: ${order.status}`, { fontSize: 12 });
              doc.text(`Date: ${order.createdAt ? order.createdAt.toLocaleDateString() : 'N/A'}`, { fontSize: 12 });
              doc.moveDown(); // Add spacing between entries
            });

            
            // Set the response headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="sales_report.pdf"');
            // Pipe the PDF content to the response stream
            doc.pipe(res);
            doc.end();
          } else{
            res.render('admin/salesreport',{orders:currentproduct,totalpages,currentpage})

          }




      
    } catch (error) {
        console.log('Error occurred in salesReport route:', error);
        // Handle errors and send an appropriate response
        res.status(500).json({ error: 'An error occurred' });
    }
}




const downloadPdf = async (req, res) => {
    try {
        // ... Your existing sales report generation logic ...
  
        // Generate PDF using pdfkit
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');
        doc.pipe(res);
  
        // Add PDF content here
        doc.text('Sales Report', { align: 'center', underline: true });
        // ... Add more content based on your requirements ...
  
        doc.end();
  
    } catch (error) {
        console.log('Error occurred in downloadPdf route:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
  };

//-----------offer---------------------------------------------------------------------------------

const loadProductOffer=async (req,res)=>{
    try {
        const product=await Product.find()
        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(product.length / 8);
        const currentproduct = product.slice(startindex,endindex);
       
    
       



        res.render('admin/productOffer',{product: currentproduct, totalpages, currentpage})
    } catch (error) {
        console.log('Error happence in the offerctrl in the funtion productOfferpage ')
    }
}




// updating the product offer-------------------------------------------------
const updateProductOffer= async(req,res)=>{
    try{
        
        const { id,offerPrice}= req.body
        console.log(id,offerPrice,'id,offerPrice');

        const product= await Product.findById(id)
           console.log(product,'product');


           const cappedPercentage = Math.min(offerPrice, 100);

           const percentage = (product.price * cappedPercentage) / 100
           product.offerPrice=Math.round( product.price-percentage)
           product.offerPercentage=cappedPercentage
          await product.save()
 
            console.log(product.offerPrice,'updated product price');
            res.redirect('/offerProduct')

    }catch(error){
        console.log(error,'error');
    }
}
//-------------------------------------------------------------------------------------------

const loadCategoryOffer= async(req,res)=>{
    try {
        const catogary=await Category.find()


        const itemsperpage = 8;
        const currentpage = parseInt(req.query.page) || 1;
        const startindex = (currentpage - 1) * itemsperpage;
        const endindex = startindex + itemsperpage;
        const totalpages = Math.ceil(catogary.length / 8);
        const currentproduct = catogary.slice(startindex,endindex);

        res.render('admin/catogaryOffer',{catogary:currentproduct, totalpages, currentpage })
        
    } catch (error) {
        console.log('Error happened in the offerctrl in the function catogaryOffer:', error);
        
    }
}

//-------------------make changed in catogary offer --------------------------------------

const updateCategoryOffer = async (req, res) => {
    try {
        const { id, offerPercentage } = req.body;
        // Find the category
        const category = await Category.findById(id);

        // Find all products in the category
        const products = await Product.find({ category: category.name });
        // Update prices based on the offer percentage
        products.forEach(async (product) => {

            const discountAmount = (offerPercentage / 100) * product.price;


            const newOfferPrice =  Math.round(product.price - discountAmount);
            const newPrice = product.price;


            await Product.findByIdAndUpdate(product._id, {
                offerPrice: newOfferPrice,
                price:newPrice ,
            });
        });

        console.log('Updated prices for products in category:', category.name);

        res.redirect('/offerProduct');
    } catch (error) {
        console.log('Error happened in the offerctrl in the function updateCatogaryOffer:', error);
        // Handle the error appropriately, e.g., send an error response to the client
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//----------------------------------------------

 module.exports={
    loadLogin,
    verifyAdmin,
    loadHome,
    loadUsers,
    block,
    unblock,
    loadCategoryList,
    addCategory,
    blockCategory,
    unBlockCategory,
    listProducts,
    loadaddproduct,
    productadding,
    loadEditProducts,
    editProducts,
    productList,
    productUnlist,
    loadEditCategory,
    editCategory,
    searchUser,
    loadSalesReport,
    salesReport,
    loadProductOffer,
    updateProductOffer,
    loadCategoryOffer,
    updateCategoryOffer,
    downloadPdf
 } 