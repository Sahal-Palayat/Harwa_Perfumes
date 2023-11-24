const mongoose=require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId;

const adminModel=new mongoose.Schema({
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
    is_admin:{
        type:Boolean,
        default:true
    }
})

const Admin=mongoose.model('Admin',adminModel)


module.exports={
    Admin
}