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


const Address=mongoose.model('Address',addressModel)


module.exports={
    Address
}