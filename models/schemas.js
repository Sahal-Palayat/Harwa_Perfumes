const mongoose=require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId;
const addressModel=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    pincode:{
        type:Number
    },
    state:{
        type:String
    },
   
    city:{
        type:String
    },
    landmark:{
        type:String
    },
    areastreet:{
        type:String
    }
})


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
    },
    wallet:{
        type:Number,
        default:0
    },
    history: {
        type:Array,
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        reason:{
            type:String,
        
        },
        timestamp: {
            type: Date,
            default:Date.now,
            
        }
    },
    wishlist:{
        type:Array,
        ProductId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Product"
        },
    },
   
})

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
    offerPercentage:{
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
    description:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
   
})

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
// const cartItemModel = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//   },
//   quantity: {
//     type: Number,
//     default: 1,
//   },

//   selected:{
//     type:Boolean,
//     default:false
//   },
  
  
// });

const cartModel = new mongoose.Schema({
  user: {
    type: String, 
  },
  items: [
{
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
      },
}

  ],
});

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
            offerPrice:{
                type:Number
            },
            total:Number,
            productStatus: {
                type: String,
                enum:  ['Pending', 'Shipped', 'Delivered','Cancelled','Out for Delivery','Confirmed','Returned'],
                default: 'Pending',
            },
        }],
        paymentMethod: {
            type: String,
            required: true
          },
          status: {
            type: String,
            enum: ['Pending', 'Shipped', 'Delivered','Cancelled','Out for Delivery','Confirmed',"Returned"],
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
          payment_id:{
            type:String
          },
          order_Id:{
            type:String
          }
          
})





const User=mongoose.model('User',userModel);
const Admin=mongoose.model('Admin',adminModel)
const Product =mongoose.model('Product',productModel)
const Category=mongoose.model('Category',categoryModel)
const Address=mongoose.model('Address',addressModel)
const Cart=mongoose.model('Cart',cartModel)
const Order=mongoose.model('Order',orderModel)

module.exports={
    User,
    Admin,
    Product,
    Category,
    Address,
    Cart,
    Order,
   
}