const {Admin}=require('../models/schemas')
const {User}=require('../models/schemas')
const {Product}=require('../models/schemas')
const {Category}=require('../models/schemas')



const loadLogin = async(req,res)=>{
    try {
 
       res.render('admin/admin-login',{message :''});
       
    } catch (error) {
       console.log(error.message);
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
    }
 }   

 const loadHome=async (req,res)=>{
    try {
        res.render('admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
 }

 const loadUsers=async (req,res)=>{
    try {
        const userData=await User.find({is_admin:false}).sort({name:1})
        res.render('admin/userslist',{users:userData})
    } catch (error) {
        console.log(error);
    }
 }

 const searchUser = async(req,res)=>{
    try {
       const name = req.body.name;
       const usersData = await User.find({is_admin:false,name:{$regex:name,$options :'i'}}).sort({name:1});
          res.render('admin/userslist',{users:usersData});
    } catch (error) {
       console.log(error)
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
    }
 }

 const loadCategoryList=async (req,res)=>{
    try {
        const category=await Category.find({});
        // console.log(category);
        res.render('admin/categorylist',{categories:category})
        
    } catch (error) {
        console.log(error);
    }
 }
  
 const addCategory=async (req,res)=>{
    try {
       
        const {name,description}=req.body
        const checkData=await Category.findOne({name:name})
        if(checkData){
            res.render('/category',{errMessage:'User already found'})
        }else{
           
            console.log(req.body);
            const category= new Category({
                name:req.body.name,
                description:req.body.description,
            })
  
            await category.save()
            const data=await Category.find({})
            res.render('admin/categorylist',{categories:data})
        }

    } catch (error) {
        console.log(error);
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
    }
}

const editCategory=async (req,res)=>{
    try {
      
        const categoryData= await Category.findByIdAndUpdate(req.body.id,
            {$set:{name:req.body.name,description:req.body.description}})
            
        res.redirect('/category')
    } catch (error) {
        console.log(error);
    }
}


const listProducts=async (req,res)=>{
    try {
        const products=await Product.find({})
        console.log(products);
        res.render('admin/listproducts',{products:products})

    } catch (error) {
        console.log(error); 
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
        console.log(req.body);
        const product={
            name:req.body.name,
            description:req.body.description,
            price:req.body.price,
            category:req.body.category,
            brand:req.body.brand,
            volume:req.body.volume,
            fragrance:req.body.fragrance,
            quantity:req.body.quantity,
            coverimage:'/products/' +req.session.images[0],
            images:[
                '/products/' +req.session.images[1],
                '/products/' +req.session.images[2],
                '/products/' +req.session.images[3]
            ]
        }
        req.session.images=null
        await Product.insertMany([product])

        res.redirect('/listproducts')

    } catch (error) {
        console.log(error);
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
    }
}



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
    searchUser
 } 