const mongoose=require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId;

  
  const cartModel = new mongoose.Schema({
    user: {
      type: String, 
    },
    items: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      },
    
      selected:{
        type:Boolean,
        default:false
      }
    }],
  });
  

  const Cart=mongoose.model('Cart',cartModel)

  module.exports={
    Cart
}