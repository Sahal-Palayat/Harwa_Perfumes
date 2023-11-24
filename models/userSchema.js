const mongoose=require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId;

const userModel=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    address:[addressModel],
    is_admin:{
        type:Boolean,
        default:false
    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    token:{
        type:String
    },
    tokenExpiry:{
        type:String
    }
   
})






const User=mongoose.model('User',userModel);

module.exports={
    User
}