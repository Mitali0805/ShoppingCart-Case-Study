const mongoose = require('mongoose');
const crypto = require('crypto');
const { v1: uuidv1} = require('uuid');


//console.log(uuidv1());

//Schema
const userSchema = new mongoose.Schema({
  name:{
      type:String,
      trim:true ,        //space at begining or end is trim out
      required:true,
      maxlength:32
  },

  email:{
    type:String,
    trim:true ,        //space at begining or end is trim out
    required:true,
    unique:true
    },

    hashed_password:{
        type:String,
        required:true
    },
    
    mobile:{
        type:Number,
        required:true,
        maxlength:10
    },
    about:{
        type:String,
        trim:true      //space at begining or end is trim out
        
    },

    salt: String,

    role:{
        type:Number,   // 0=>auth user , 1=>Admin
        default: 0
    },

    history:{
        type:Array,
        default:[]
    }

}, {timestamps : true});


//virtual field
userSchema.virtual('password')           //pw is virtual field which is not stored in DB
.set(function(password){                // client side password
   this._password = password;          
   this.salt = uuidv1();                //random string
   this.hashed_password = this.encryptPassword(password);    // hashed_pwd is encrypted version of pwd which is stord in DB

})
.get(function(){
    return this._password;
});

userSchema.methods = {           //add methods to userSchema
   
   authenticate:function(plainText){
     return this.encryptPassword(plainText) === this.hashed_password
   },   

    encryptPassword: function(password){
        if(!password) return '';
        try{
          return crypto
                 .createHmac('sha1',this.salt)   //method for hashing password
                 .update(password)
                 .digest('hex');
        }
        catch(err){
            return '';
        }
    }
};

module.exports = mongoose.model('User',userSchema);