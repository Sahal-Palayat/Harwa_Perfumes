const mongoose=require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId;

const cartItemModel = new mongoose.Schema({
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
    
  });
  
  const cartModel = new mongoose.Schema({
    user: {
      type: String, 
    },
    items: [cartItemModel],
  });
  

  const Cart=mongoose.model('Cart',cartModel)

  module.exports={
    Cart
}