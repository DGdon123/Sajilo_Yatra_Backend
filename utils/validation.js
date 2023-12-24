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

  exports.vehicleticketValidation = [
    check('departure', 'Leaving Destination is required').notEmpty(),
    check('arrival', 'Going Destination is required').notEmpty(),
    check('depart_time', 'Departing Time is required').notEmpty(),
    check('arrival_time', 'Arriving Time is required').notEmpty(),
    check('meet', 'Meeting Location is required').notEmpty(),
    check('ddob', 'Departure Date is required').notEmpty(),
    check('price', 'Price is required').notEmpty(),
  ];

  exports.vehiclerentalValidation = [
    check('city', 'City is required').notEmpty(),
    check('time', 'Vehicle Availability Time is required').notEmpty(),
    check('meet', 'Meeting Location is required').notEmpty(),
  ];

  exports.ticketValidation = [
    check('vehicle_type', 'Vehicle Type is required').notEmpty(),
    check('departure', 'Leaving Destination is required').notEmpty(),
    check('arrival', 'Going Destination is required').notEmpty(),
    check('dob', 'Departure Date is required').notEmpty()
  ];


  exports.rentalValidation = [
    check('vehicle_type', 'Vehicle Type is required').notEmpty(),
    check('city', 'City is required').notEmpty(),
    check('dob', 'Departure Date is required').notEmpty()
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