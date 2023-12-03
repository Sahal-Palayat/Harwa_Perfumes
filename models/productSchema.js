const mongoose=require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId;

const productModel=new mongoose.Schema({
    images:[
        {
            type:String
        }
    ],
    coverimage:{
        type:String,
     

    },
    name:{
        type:String,
       
    },
    price:{
        type:Number,
        
    },
    offerPrice:{
        type:Number
    },
    volume:{
        type:Number
       
    },
    fragrance:{
        type:String
    },
    quantity:{
        type:Number
        
    },
    category:{
        type:String,
        required:true
        
    },
   
    brand:{
        type:String
    },
    status:{
        type:Boolean,
        default:true
    },
    isFeatured:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    description:{
        type:String
    }   
})

const Product =mongoose.model('Product',productModel)



module.exports={
    Product
}