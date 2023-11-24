const { User, Product, Category, Address, Cart } = require('../models/schemas')
const bcrypt = require('bcrypt')
const { default: mongoose } = require('mongoose')



  
const LoadCart = async (req, res) => {
    try {
        const userId=req.session.user_id
        const user= await User.findById(userId)
        
        const cart = await Cart.findOne({ user: user._id }).populate("items.product");
       
        if (cart) {
        cart.items = cart.items.filter((item) => item.product !== null);
        await cart.save();
         }
        res.render("users/cartpage", { cart:cart,user:user });
       } catch (error) {
         console.error(error);
         res.render('users/page-404')

       }
    };
  
  
const addToCart = async (req, res) => {
    try {
        const { id } = req.query

        const user = req.session.user_id
       
        const cart = await Cart.findOne({ user: user })
    
        const product = await Product.findById(id)
     
        const price=product.price
        if (!product) {
            res.status(404).json({ message: 'Product not Found' })
        }
        
        if (cart === null) {
            console.log("found cart nulll === ", new mongoose.Types.ObjectId(id));
            console.log(price)
           const itewsz= await Cart.insertMany({
                user: user,
               
                items: [{
                    product: new mongoose.Types.ObjectId(id),
                    quantity: 1,
                    
                }]
            })
            console.log(itewsz)
        } else {

            const cartItem = cart.items.find((item) => item?.product+"" === id)
            
            if (cartItem) {
                cartItem.quantity += 1
            } else {
                cart.items.push({ product: id })
            }
            console.log(cart);
            await cart.save()
        }

        res.status(200).json({ message: 'Product add to the Cart' ,status:true})

    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
}



const deleteItemCart = async (req, res) => {
    try {
        const id = req.session.user_id;
        const user = await User.findById(id);
        const cart = await Cart.findOne({ user: user._id })
        // .populate("items.product");
        const productId = req.body.productId;
       
        if (cart) {
            // Use filter to create a new array excluding the item to be deleted
            cart.items = cart.items.filter(item => item._id.toString() !== productId);
         console.log('////////////////////////////////'+cart.items);
            // Save the updated cart
            await cart.save();

            res.json({ status: true });
        } else {
            res.json({ status: false, message: "Cart not found" });
        }
    } catch (error) {
        console.log(error, 'error while deleting cart item');
        res.render('users/page-404')

    }
};

const dltAllItem = async (req, res) => {
    try {
        const id = req.session.user_id
        const user = await User.findById(id)
        const cart = await Cart.findOne({ user: user._id}).populate("items.product");
        cart.items = []
        const updatedUserData = await cart.save()

        console.log(updatedUserData, 'this is the updated user details');
        res.redirect('/cartpage')
        res.json({ status: true })


    } catch (error) {
        console.log(error, 'error occur while Dlt all elements in the cart');
        res.render('users/page-404')

    }
}


  
  let incCartItem = async (req, res) => {
    const productId = req.body.productId;
    const newQuantity = req.body.quantity;
  
    console.log('ProductId:'+productId);
    console.log('NewQuantity:'+newQuantity);
  
    try {
        let cart = await Cart.findOne({ user: req.session.user_id });
        console.log(cart);
        if(cart){
          console.log('cart found');
        }
        const index = cart.items.findIndex((item) => item.id.toString() === productId);

        console.log(index);
  
        if (index !== -1) {
            console.log('q---------------------q');
            cart.items[index].quantity = newQuantity;
            const updatedCart = await cart.save();
  
            if (updatedCart) {
                console.log('Quantity updated');
                return res.status(200).json({ message: 'Quantity updated successfully' });
            } else {
                console.log('Error updating quantity');
                return res.status(500).json({ error: 'Error updating quantity' });
            }
        } else {
            console.log('Product not found in cart');
            return res.status(404).json({ error: 'Product not found in cart' });
        }
    } catch (error) {
        console.error(error);
        res.render('users/page-404')


    }
  };


  const selectProduct=async (req,res)=>{
    try {
        const id = req.session.user_id;
        const user = await User.findById(id);
        const cart = await Cart.findOne({ user: user._id })
        const productId=req.body.productId
        console.log(productId);
        if(cart){
           index= cart.items.findIndex((item)=>item._id.toString()===productId)
          console.log(cart.items);
            if(cart.items[index].selected===false){
                cart.items[index].selected=true
            }else{
                cart.items[index].selected=false
            }
            await cart.save()
        }
        console.log();
    } catch (error) {
        console.log(error);
        res.render('users/page-404')

    }
  }

module.exports = {
    LoadCart,
    addToCart,
    deleteItemCart,
    dltAllItem,
    incCartItem,
    selectProduct
}