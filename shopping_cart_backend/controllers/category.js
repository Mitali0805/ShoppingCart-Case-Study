const Category = require('../models/category') ;

//Find Category by Id 
exports.categoryById = (req,res,next,id)=>{
    Category.findById(id).exec((err,category) =>{
        if(err || !category){
            res.status(400).json({
               error:"Category doesn't exist" 
            })
        }
        req.category = category;
        next();
    });
};

//read the single generated category
exports.read = (req,res,next) =>{
    return res.json(req.category);
};

exports.create = (req,res) =>{

    const category = new Category(req.body)
    category.save((err,data)=>{
        if(err){
        return res.status(400).json({
            error:err
        });
     } 

    res.json({data})

 });
};

//to delete Category
exports.remove = (req,res) =>{
    const category = req.category;
      category.remove((err,data) =>{
        if(err){
            return res.status(400).json({
               error:"error occured while deleting category" 
            })
        }
        res.json({
            message:"Category deleted successfully"
        });
    });

}

//to update Category
exports.update = (req,res) =>{
    const category = req.category;
    category.name = req.body.name;
    category.save((err,data) =>{
        if(err){
            return res.status(400).json({
               error:"error occured while creating categoryer" 
            });
        }
        res.json(data);
    });

};

//to list out Category
exports.list = (req,res) =>{
    Category.find().exec((err,data) =>{
        if(err){
            return res.status(400).json({
               error:"error occured while showing category" 
            });
        }

        res.json(data);
    })

}