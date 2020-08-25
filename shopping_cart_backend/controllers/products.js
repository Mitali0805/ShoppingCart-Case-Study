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
