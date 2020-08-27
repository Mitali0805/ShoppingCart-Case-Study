const User = require('../models/user')

exports.userById = (req,res,next,id) =>{
 User.findById(id).exec((err,user)=>{
     if(err || !user){
         res.status(400).json({
             error:"User not Found"
         })
     }
     
     req.profile = user;
     next();             // continuous flow of appln
 });
};

exports.read = (req,res) =>{
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    return res.json(req.profile);
}

//To update user profile
exports.update = (req,res) =>{
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$set: req.body}, 
        {new:true},
        (err,user) =>{
            if(err) {
              return res.status(400).json({
                error:"Unauthorized User"
            })  
         }
         user.hashed_password = undefined;
         user.salt = undefined;
         res.json(user);
      }
    );
};