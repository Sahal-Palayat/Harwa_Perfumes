
  
const {User}=require('../models/schemas')

const isLogin = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      const user = await User.findById(req.session.user_id);

      if (user) {
        if (user.is_blocked) {
          req.session.destroy((err) => {
            if (err) {
              console.error(err);
              res.status(500).send('Internal Server Error');
            } else {
              res.redirect('/login');
            }
          });
        } else {
          next();
        }
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
};


 const isLogout=async (req,res,next)=>{
    try {
        if(req.session.user_id){
            res.redirect('/home');
        }else{
         next();
     }
    }catch (error) {
        console.log(error.message);
    }
 }

 module.exports={
    isLogin,
    isLogout
 }