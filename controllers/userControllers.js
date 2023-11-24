const {User, Product,Category,Address, Cart,Order}=require('../models/schemas')
const bcrypt=require('bcrypt')
const randomstring=require('randomstring')
const nodemailer=require('nodemailer')
const { default: mongoose } = require('mongoose')



//--------------user register-
const loadRegister= async(req,res)=>{
    try {
        res.render('users/page-register')
    } catch (error) {
        console.log(error);
    }
}

const transporter=nodemailer.createTransport({
  service:'Gmail',
  auth:{
    user:'sahalpalayat@gmail.com',
    pass:'xrmx vgxg nrve dyfx'
  }
})
const insertUser=async (req,res)=>{
  try {
      const {name,email,password,mobile}=req.body
      const checkData= await User.findOne({email:email})

      if(checkData){
          res.render('users/page-register',{errMessage:'user already founded'})
      }else{

          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

          const otp =randomstring.generate(6)
          console.log(otp);
          req.session.signupData={
            name,
            email, 
            password,
            mobile,
            otp
          }

          const mailOptions={  
            from:'sahalpalayat@gmail.com',
            to : email,
            subject:'This is your OTP',
            text:`Your otp ${otp}`
          }


          transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
              console.log(error);
              res.status(500).send('failed otp')
            }else{
              console.log('OTP sent'+info.response);
            }
            res.render('users/otp',{email:req.body.email})
          })



        
      }
  } catch (error) {  
   console.log(error.message);   
  }
}

const verifyOTP=async (req,res)=>{
  const enteredOTP=req.body.otp;
  const storedData=req.session.signupData;
  console.log(storedData.otp);
  if(enteredOTP===storedData.otp){
    try {
      const {name,email,password,mobile}=storedData
      const hashedPassword=await bcrypt.hash(password,10)
      const user = new User({
        name,
        email,
        mobile,
        password: hashedPassword,
      });
      await user.save();
      console.log("Signup successful");
      console.log(storedData);

      // Clear the session data
      delete req.session.signupData;
      // Redirect to the home page or another success page
      res.redirect('/')



    } catch (error) {
      console.error("Failed to store signup data:", error);
      res.status(500).send('An error occurred while processing your request.');
    }
  }else{
    res.status(401).send('Invalid OTP. Please try again.');
  }

}

//------------user-login-----------

const loadLogin=async (req,res)=>{
    try {
        res.render('users/page-login',{message:''})
    } catch (error) {
        console.log(error.message);
    }
}
const verifyUser = async (req, res) => {
    try {
      const name=req.body.name
      const email = req.body.email;
      const password = req.body.password;
     
      const userData = await User.findOne({ email: email });
  
      if (userData) {
        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (passwordMatch) {
          console.log(userData.is_blocked);
          if(userData.is_blocked===false){

          req.session.user_id = userData._id;
          res.redirect('/home')
          }else{
            res.render('users/page-login',{message:'User Blocked by Admin'})
          }
        } else{
          res.render('users/page-login', { message: 'Invalid email or password' });
        }
      } else {
        res.render('users/page-login', { message: 'Invalid email or password' });
      } 
    } catch (error) {
      console.log(error.message);
    }
  };

  //------------home page
  const loadHome= async(req,res)=>{
    try {
        const userData=await User.findById(req.session.user_id)
      
        const products = await Product.find({status:true})
    
        res.render('users/home',{user:userData,products})
    } catch (error) {
        console.log(error);
    }
  }
  
const loadMain=async (req,res)=>{
  try {
    const userData=await User.findById(req.session.user_id)
    console.log(userData);
    const products = await Product.find({status:true})
    res.render('users/index',{user:userData,products})
  } catch (error) {
    console.log(error);
  }
}  

//----------user-logout
  const userLogout= async (req,res)=>{
    try {
        req.session.user_id = null;
      res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
  }
//---------------product management
  const loadProductDetails= async (req,res)=>{

    try {
      const userData=await User.findById(req.session.user_id)
    
      const username=userData.name
        const ProductId=req.query.id
        const product= await Product.findById(ProductId)

        res.render('users/product-details',{products:product,user:userData});
    } catch (error) {
        console.log(error);
    }
}
//-------------user profile
const loadUserProfile=async (req,res)=>{
try {
  const userId =req.session.user_id
  const user =await User.findById(userId)
  const userData=await User.find({is_admin:false}).sort({name:1})
  const order=await Order.find({user:req.session.user_id}).populate('user').populate('products.product')
  order.reverse()
  res.render('users/userprofile',{users:userData,user:user,order})
} catch (error) {
  console.log(error);
  res.render('users/page-404')

}
}

const loadEditProfile=async (req,res)=>{
  try {
    const userId=req.session.user_id
    const user=await User.findById(userId)
    res.render('users/editprofile',{user:user})
  } catch (error) {
    console.log(error);
    res.render('users/page-404')

  }
}
const editProfile=async (req,res)=>{
  try {
    const id=req.query.id
    const userId=req.session.user_id
    const { name,mobile,email}=req.body 
    const user= await User.findById(userId)
    if(user){
      
      
        user.name=name
        user.mobile=mobile
        user.email=email
    
        

        user.save()
        res.redirect('/userprofile')

      
    }
    
  } catch (error) {
    console.log(error);
    res.render('users/page-404')

  }
}

//-------------address
const loadAddAddress= async(req,res)=>{
  try {
    const userId =req.query.id
    const user =await User.findById(userId)
    const userData=await User.find({is_admin:false}).sort({name:1})
    res.render('users/addaddress',{users:userData,user:user})
  } catch (error) {
    console.log(error);
    res.render('users/page-404')

  }
}
const addAddress=async (req,res)=>{
  try {

    const {name,mobile,pincode,state,areastreet,landmark,city}=req.body

    const id=req.session.user_id;
    console.log(id);
    const user= await User.findById(id)
    console.log(user);
    const newAddress={
      name,
      mobile,
      pincode,
      state,
      city,
      landmark,
      areastreet
    };
    if(user.address.length===0){
      newAddress.main=true;
    }
    user.address.push(newAddress)
    await user.save()
    res.redirect('/userprofile')





//  const id=new mongoose.Types.ObjectId(req.session.user_id)
//   console.log(id);

  } catch (error) {
    console.log(error);
    res.render('users/page-404')

  }
}

const loadEditAddress=async (req,res)=>{
  try {
    const id=req.query.id
    const userId=req.session.user_id;
    console.log(id);
    const user= await User.findById(userId)
    const address=user.address.id(id)
    res.render('users/editaddress',{user:user,address:address})
  } catch (error) {
    console.log(error);
    res.render('users/page-404')

  }
}

const editAddress=async (req,res)=>{
  try {
    
    const userId=req.session.user_id
    const { name,mobile,pincode,state,areastreet,landmark,city,id}=req.body 
    const user=await User.findById(userId)
    if(user){
      const updateAddress=user.address.id(id)
      if(updateAddress){
        updateAddress.name=name
        updateAddress.mobile=mobile
        updateAddress.pincode=pincode
        updateAddress.state=state
        updateAddress.city=city
        updateAddress.landmark=landmark
        updateAddress.areastreet=areastreet
        

        user.save()
        res.redirect('/userprofile')

      }else{
        console.log('address not found');
 

      }
    }



    res.redirect('/userprofile')
  } catch (error) {
    console.log(error);
  }
}
const deleteAddress= async (req,res)=>{
  try {
   const id=req.query.id
   const userId=req.session.user_id
   const deleteAdd=await User.findOneAndUpdate(
    {_id:userId},{$pull:{address:{_id:id}}},{new:true},
    res.redirect('/userprofile')
   )

    // const addressData= await User.findByIdAndRemove({_id:req.query.id})
    res.redirect('/userprofile')
  } catch (error) {
    console.log(error);
    res.render('users/page-404')

  }
}


const loadCheckout= async(req,res)=>{
  try {
    const userId=req.session.user_id
    const user= await User.findById(userId)
    const cart = await Cart.findOne({ user: user._id }).populate("items.product");
   const products= cart.items.filter((item)=>item.selected===true)
   console.log(products);
    res.render('users/checkout',{user:user,cart:cart,products:products})
  } catch (error) {
    console.log(error);
    res.render('users/page-404')

  }
} 
  
      // let changepass=async(req,res,next)=>{
      //   const {oldpass,newpass,conpass}=req.body;
      //   console.log(oldpass);
      //   console.log(newpass);
      //   console.log(conpass);

      //   const findpass=await User.findById({_id:req.session.user},{_id:0,password:1})
      //   console.log(findpass.password)
      //   if(findpass.password!==oldpass)
      //   {
      //     return res.status(400).json({message:'Invalid Password',status:false})
      //   }
      //   if(newpass!==conpass)
      //   {
      //     return res.status(400).json({message:'Passwords do not match',status:false})
      //   }
      //   const insertPass=await User.findByIdAndUpdate({_id:req.session.user},{password:conpass})
      //   if(insertPass)
      //   {
      //     console.log("Password updated");
      //     res.status(200).json({status:true})
      //   }
      // }
      const crypto = require('crypto');

      const randomToken = () => {
      return crypto.randomBytes(32).toString('hex');
      };

      const resetPasswordMail = async (user, token) => {
      try {
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user:'sahalpalayat@gmail.com',
            pass:'xrmx vgxg nrve dyfx'
          },
        });

        const mailOptions = {
          from:'sahalpalayat@gmail.com',
          to: 'sahalpalayat5894@gmail.com',
          subject: 'Change password link',
          html: `
            <p>Hello ${user.name},</p>
            <p>You requested a password reset for your account. Click the link below to reset your password:</p>
            <a href="http://127.0.0.1:7000/resetPassword?token=${token}">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
          `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Mail sent successfully:', info);
      } catch (error) {
        console.error('Failed to send link via mail:', error);
        throw new Error('Failed to send password reset link');
      }
      };

      const forgotpass = async (req, res, next) => {
      
      try {
        const user = await User.findOne({ _id: req.session.user_id }, {email: 1 });
        console.log(user);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const token = randomToken();
        console.log(token);
        console.log(user);
        user.token = token;
        user.tokenExpiry = Date.now() + 36000000;
        await user.save();

      const sendMail=  await resetPasswordMail(user.email, token);
      if(sendMail)
      {
      console.log('set set')
      }
      res.redirect('/userprofile')
       
      } catch (error) {
        console.log(error) 
        res.render('users/page-404')
  
      }
      };


      const resetPassword=async(req,res,next)=>{
      try{ 
        console.log('user keri')
      const token=req.query.token;
      console.log(token,'/////////////////////////');
      const user=await User.findOne({token:token,tokenExpiry:{$gte:Date.now()}})
      console.log(user);
      if(!user) 
      {
      res.status(404).json({nouser:true});
      } else {
        let categories = await Category.find({ active: 'true' })
  
        res.render('users/forgotpassword',{token,categories});
      }
      
      }
      catch (error) {
      console.error('Error in reset-password route:', error);
      res.status(500).send('Internal Server Error');
      }
      }




      const getpassword=async(req,res,next)=>{
      try{
      const{token,npassword,cpassword}=req.body;
      console.log('hjdhciwd')
      console.log(token);
      console.log(npassword);
      console.log(cpassword);

      const user = await User.findOne({token: token,
                                         tokenExpiry: { $gt: Date.now() }, 
                                          });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      const hashedPassword=await bcrypt.hash(npassword,10)
      user.password=hashedPassword;
      user.token=undefined;
      user.tokenExpiry=undefined;

      await user.save();
      res.redirect('/login');
      } catch (error) {
        console.error('Error in reset-password route:', error);
        res.render('users/page-404')

      }
      }
 
 

module.exports= {
    loadRegister,
    insertUser,
    loadLogin,
    verifyUser,
    loadHome,
    verifyOTP,
    userLogout,
    loadMain,
    loadProductDetails,
    loadUserProfile,
    addAddress,
    loadAddAddress,
    loadEditAddress,
    editAddress,
    deleteAddress,
    loadEditProfile,
    editProfile,
    loadCheckout,
    forgotpass,
    resetPassword,
    getpassword
}