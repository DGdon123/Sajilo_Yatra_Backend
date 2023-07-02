const Product = require('../models/productModel');

//to post product
exports.postProduct = async (req, res) => {
  let product = new Product({
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    countInStock: req.body.countInStock,
    product_description: req.body.product_description,
    product_image: req.file.path,
    category: req.body.category
  });
  
  let savedProduct = await product.save();
  
  if (!savedProduct) {
    return res.status(400).json({ error: 'Something went wrong' });
  }
  
  res.send(savedProduct);
};

// To show all products
exports.productList = async (req, res) => {
    try{const products = await Product.find().populate('category');
    
        if (!products) {
          return res.status(400).json({ error: 'Something went wrong' });
        }
        
        res.send(products);}
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
          }
    
  };

//to show product details
exports.productDetails = async (req, res) => {
    try{const products = await Product.findById(req.params.id).populate('category');
    
        if (!products) {
          return res.status(400).json({ error: 'Something went wrong' });
        }
        
        res.send(products);}
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
          }
    
  };

  // to delete category
exports.deleteProduct = (req, res) => {
    try {
      const categories = Product.findByIdAndRemove(req.params.id).then(categories=>{
  
      if (!categories) {
        return res.status(403).json({ error: 'product not found' });
      }
      else{
        return res.status(200).json({ error: 'product deleted' });
      }
  
    }).catch(err=>{
        return res.status(400).json({ error: err });
    })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  };

  // update product
exports.updateProduct = async (req, res) => {
  try {
    const categories = await Product.findByIdAndUpdate(req.params.id,{
      product_name: req.body.product_name,
    product_price: req.body.product_price,
    countInStock: req.body.countInStock,
    product_description: req.body.product_description,
    product_image: req.file.path,
    category: req.body.category
    },{new:true});

    if (!categories) {
      return res.status(400).json({ error: 'Something went wrong' });
    }

    res.send(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};
  
//list product related same category
exports.listRelated=async(req,res)=>{
  let single_product=await Product.findById(req.params.id)
  let limit = req.query.limit ? parseInt(req.params.limit):6
  let product=await Product.find({_id:{$ne:single_product},category:single_product.category})
  .limit(limit)
  .populate('category','category_name')
  if (!product) {
    return res.status(400).json({ error: 'Something went wrong' });
  }

  res.send(product);
}