const fs = require('fs');
const formidable = require('formidable');
const _ = require('lodash')
const Product = require('../models/products');

//Find Product by Id  (every time productId is present this method runs first)
exports.productById = (req,res,next,id) =>{
  Product.findById(id).exec((err,product) => {
      if(err || !product) {
          return res.status(400).json({
              error:"Product Not Found"
          });
      }
      req.product = product;
      next();
  });
};

//read the single generated product 
exports.read = (req,res)  =>{
  req.product.photo = undefined      //photo is send afterwards as its size is large
  return res.json(req.product) ;
}

exports.create = (req,res) =>{
    let form = new formidable.IncomingForm()  //all form data are available from this
    form.keepExtensions = true           //extensions 
    form.parse(req, (err,fields,files) =>{
        if(err){
            return res.status(400).json({
                error:'Failed to upload Image'
            })
        }
        
        //check for all fields
        const {name,description,price,category,quantity,shipping} = fields

        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error:'All fields are required'
            });
        }

        let product = new Product(fields)

        if(files.photo){
            //to restrict photos gt than 1mb
            if(files.photo.size > 1000000){                 //1kb=1000 1mb=1000000
                return res.status(400).json({
                    error:'Image size should be less than 1mb'
                }); 
            }

            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type        //add photo into product
        }

        //save product in dB
        product.save((err,result) =>{
            if(err){
                return res.status(400).json({
                    err
                })
            }

            res.json(result);
        })
    })
};

//to delete Product
exports.remove = (req,res) =>{
    let product = req.product;

    product.remove((err,deleteProduct) =>{
        if(err){
            return res.status(400).json({
                error:'Unable to Delete Product'
            });
        }
        res.json({
             message:'Product Deleted successfully'
        });
  });

} ;

//To update existing Product
exports.update = (req,res) =>{
    let form = new formidable.IncomingForm()  //all form data are available from this
    form.keepExtensions = true           //extensions 
    form.parse(req, (err,fields,files) =>{
        if(err){
            return res.status(400).json({
                error:'Failed to upload Image'
            })
        }
        
        //check for all fields
        const {name,description,price,category,quantity,shipping} = fields

        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error:'All fields are required'
            });
        }

        let product = req.product        //existing product
        product = _.extend(product,fields)  //method provided by lodash for update

        if(files.photo){
            //to restrict photos gt than 1mb
            if(files.photo.size > 1000000){                 //1kb=1000 1mb=1000000
                return res.status(400).json({
                    error:'Image size should be less than 1mb'
                }); 
            }

            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type        //add photo into product
        }

        //save product in dB
        product.save((err,result) =>{
            if(err){
                return res.status(400).json({
                    err
                })
            }

            res.json(result);
        })
    })
};

/**
 * sell/arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=2
 * if no params are sent,then all products are returned
 */
exports.list = (req,res) =>{
    let order = req.query.order ? req.query.order : "asc" ;        //grab route query
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 8

    Product.find()
            .select("-photo")     //deselect photo as size is big =>slow processing
             .populate('category')
             .sort([[sortBy,order]])
             .limit(limit)
             .exec((err,products)=>{
                 if(err){
                 return res.status(400).json({
                     error:'Products not found'
                 });
                } 
                res.json(products);
             });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
 
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);     //for loading more products
    let findArgs = {};  
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-╣10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],     //$gte(0) - $lte(100)
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")       //don't select photo
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

//To get Product photo
exports.photo = (req,res,next) =>{
  if(req.product.photo.data) {
    res.set('Content-Type',req.product.photo.contentType)                            //res is not json
    return res.send(req.product.photo.data)
  }  
  next();
}
