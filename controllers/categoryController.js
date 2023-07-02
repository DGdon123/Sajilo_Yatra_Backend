const Category = require('../models/categoryModel');

exports.testFunction = (req, res) => {
  res.send('Welcome to Express');
};

// Post Category
exports.postCategory = async (req, res) => {
  try {
    const category = new Category({
      category_name: req.body.category_name,
    });

    const existingCategory = await Category.findOne({
      category_name: category.category_name,
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category must be unique' });
    }

    const savedCategory = await category.save();

    if (!savedCategory) {
      return res.status(400).json({ error: 'Something went wrong' });
    }

    res.send(savedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Show all categories
exports.categoryList = async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories) {
      return res.status(400).json({ error: 'Something went wrong' });
    }

    res.send(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Show single category by id
exports.categoryDetails = async (req, res) => {
    try {
      const categories = await Category.findById(req.params.id);
  
      if (!categories) {
        return res.status(400).json({ error: 'Something went wrong' });
      }
  
      res.send(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  };

// update category
exports.updateCategory = async (req, res) => {
    try {
      const categories = await Category.findByIdAndUpdate(req.params.id,{
        category_name:req.body.category_name
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

// to delete category
exports.deleteCategory = (req, res) => {
    try {
      const categories = Category.findByIdAndRemove(req.params.id).then(categories=>{
  
      if (!categories) {
        return res.status(403).json({ error: 'category not found' });
      }
      else{
        return res.status(200).json({ error: 'category deleted' });
      }
  
    }).catch(err=>{
        return res.status(400).json({ error: err });
    })
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  };
