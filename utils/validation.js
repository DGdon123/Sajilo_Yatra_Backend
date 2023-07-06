const {check,validationResult}=require('express-validator')
exports.categoryValidation=[
    check('category_name','Category name is required').notEmpty()
    .isLength({min:3}).withMessage('category must contain at least 3 characters')
]

exports.productValidation=[
    check('product_name','Product name is required').notEmpty()
    .isLength({min:3}).withMessage('product must contain at least 3 characters'),
    check('poroduct_price','price is required').notEmpty()
    .isNumeric().withMessage('price must contain numeric characters'),
    check('countInStock','stock quantity is required').notEmpty()
    .isNumeric().withMessage('stock quantity must contain numeric characters'),
    check('product_description','Product description is required').notEmpty()
    .isLength({min:30}).withMessage('product description must contain at least 30 characters'),
    check('category','category is required').notEmpty()
    
]

exports.userValidation = [
    check('name', 'Name is required').notEmpty().isLength({ min: 2 }).withMessage('Name should be at least 2 characters'),
    check('email', 'Email is required').notEmpty().isEmail().withMessage('Invalid email format'),
    check('password', 'Password is required').notEmpty().matches(/[a-z]/).withMessage('Password must contain one lowercase letter')
      .matches(/[A-Z]/).withMessage('Password must contain one uppercase letter').matches(/[0-9]/).withMessage('Password must contain one numeric digit')
      .matches(/[@#$%&*^?.,-_]/).withMessage('Password must contain one special character').isLength({ min: 8 }).withMessage('Password must be minimum of 8 characters').isLength({ max: 100 }).withMessage('Password must not exceed more than 100 characters'),
  ];

  exports.vehicleownerValidation = [
    check('name', 'Name is required').notEmpty().isLength({ min: 2 }).withMessage('Name should be at least 2 characters'),
    check('email', 'Email is required').notEmpty().isEmail().withMessage('Invalid email format'),
    check('password', 'Password is required').notEmpty().matches(/[a-z]/).withMessage('Password must contain one lowercase letter')
      .matches(/[A-Z]/).withMessage('Password must contain one uppercase letter').matches(/[0-9]/).withMessage('Password must contain one numeric digit')
      .matches(/[@#$%&*^?.,-_]/).withMessage('Password must contain one special character').isLength({ min: 8 }).withMessage('Password must be minimum of 8 characters').isLength({ max: 100 }).withMessage('Password must not exceed more than 100 characters'),
  ];
  
  exports.validation = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
    } else {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
  };