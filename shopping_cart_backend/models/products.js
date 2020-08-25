const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

//Schema
const productSchema = new mongoose.Schema({
  name:{
      type:String,
      trim:true ,        //space at begining or end is trim out
      required:true,
      maxlength:32
    },
    description:{
        type:String,
        required:true,
        maxlength:5000
    },
    price:{
        type:Number,
        trim:true ,        //space at begining or end is trim out
        required:true,
        maxlength:32
    },
    category:{
        type:ObjectId,
        ref:'Category',        //Category model
        maxlength:32
    },
    quantity:{
        type:Number
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    shipping:{
        type:Boolean,
        required:false
    }

}, {timestamps : true});


module.exports = mongoose.model('Product',productSchema);