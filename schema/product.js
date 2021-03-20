const mongoose = require('mongoose');

//////////// schema for product table in DB ////////////////////
const productSchema=new mongoose.Schema({
    title:{type:String,required:true},
    image:{type:String},
    price:{type:Number,required:true} ,
    details:{ type:String,required:true 
    }
})
   ///////match product schema with product table ///////
 const  Product=mongoose.model('product',productSchema)

 module.exports=Product;
