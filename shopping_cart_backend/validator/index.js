exports.userSignupValidator = (req,res,next) =>{
    req.check('name','Name is required').notEmpty();
    
    req.check('email','Email is required').notEmpty()
       .matches(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)   //regex
       .withMessage('Invalid Email')
       .isLength({  max:32 });

    req.check('mobile','Mobile No. is required').notEmpty()
       .matches(/^([+]\d{2}[ ])?\d{10}$/)
       .withMessage('Invalid Mobile No.');
      
       

    req.check('password','Password is required').notEmpty()   
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain atleast 6 characters')
        .matches(/\d/)            
        .withMessage('Password contain atleast a number');

      const errors = req.validationErrors()
      if(errors){                                   //map each errors & return 1st one
         const firstError = errors.map(error=>error.msg)[0]
         return res.status(400).json({ error : firstError })
      }
  next();
}