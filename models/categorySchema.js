const mongoose=require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId;


const categoryModel=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    is_listed:{
        type:Boolean,
        default:true
    }

})


const Category=mongoose.model('Category',categoryModel)


module.exports={
    Category
}