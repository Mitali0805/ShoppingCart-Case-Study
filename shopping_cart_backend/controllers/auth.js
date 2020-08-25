const User = require('../models/user');
const jwt = require('jsonwebtoken');    // to generate signed token
const expressJwt = require('express-jwt'); //for authorization

//signup
exports.signup = (req,res) =>{
    
    console.log('req.body',req.body);
    const user = new User(req.body);

    user.save((err,user)=>{
        if(err){
            return res.status(400).json({
                err
            });
        }

        user.salt = undefined                // not to display (hiding) salt & hashed_pwd 
        user.hashed_password = undefined

        res.json({
            user
        });
    });
};

//signin
exports.signin = (req,res) =>{
  //find the user based on email
  const {email,password} = req.body
  User.findOne({email},(err,user) =>{
        if(err || !user){
            return res.status(400).json({
                error:"User not exist.Please SignUp"
            });
        }

        //if user is there make sure email & password matches
        //create authenticate method in user model
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email & PWD does'nt match"
            })
        }

        //generate signed token with user id & secret
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET)
        
        //persist the token as 'tok' in cookie with expiry date
        res.cookie('tok',token,{expire:new Date() + 9999})

        //return response with user & token to frontend client
        const {_id,name,email,role} = user               //destructuring user
        return res.json({token,user:{_id,name,email,role}})
  });
};

//signout   (clear the cookie)
exports.signout = (req,res) =>{
   res.clearCookie('tok') 
   res.json({message:"Successfully Signout"});
};

//To protect routes
exports.requireSignin = expressJwt({        // foe expressJWT we need cookieParser installed
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],   //HS & RS algorithms are used ,RS is not working here
    userProperty:"auth"   
});

//user authentication
exports.isAuth = (req,res,next) =>{
    let user = req.profile && req.auth && req.profile._id == req.auth._id  //logged in user & authenticate user have same id
        if(!user){
            return res.status(403).json({
               error:"Access denied" 
            });
        }

       next() ;
}

//Admin authentication  Admin role=1
exports.isAdmin = (req,res,next) =>{
    if(req.profile.role === 0){
        return res.status(403).json({
            error:"Admin Resource! Access denied "
        });
    }
    next() ;
}