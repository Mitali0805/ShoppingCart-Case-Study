const mongoose = require('mongoose');

//Schema
const categorySchema = new mongoose.Schema({
  name:{
      type:String,
      trim:true ,        //space at begining or end is trim out
      required:true,
      maxlength:32,
      unique:true
  }

}, {timestamps : true});



module.exports = mongoose.model('Category',categorySchema);