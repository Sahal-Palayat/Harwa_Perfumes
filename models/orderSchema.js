const mongoose=require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId;

const orderModel=new mongoose.Schema({
    user:
    {
        type: ObjectID,
        ref: 'User',
        required: true,
    },
    address:
    {
        type:ObjectID,
        ref:'Address',
        required: true,
    },
    products:[
    {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true,
        }, 
        quantity:{
            type:Number,
            default:1,
        },
        price:{
            type:Number,
          
        },
        total:Number,
    }],
    paymentMethod: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered','Cancelled','Out for Delivery','Confirmed'],
        default: 'Pending',
      },
      createdAt:
      {
        type:Date,
        default:Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
      grandTotal:Number,
      cancelRequest:{
        type:Boolean,
        default:false,
      },
    //   reason:String,
      
 


})

const Order=mongoose.model('Order',orderModel)


module.exports={
    Order
}