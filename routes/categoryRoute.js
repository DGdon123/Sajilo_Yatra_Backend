const express = require('express')
const { testFunction, postCategory, categoryList, categoryDetails, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { categoryValidation, validation } = require('../utils/validation')
const router = express.Router()


router.get('/',testFunction)
router.post('/postcategory',categoryValidation,validation,postCategory)
router.get('/categorylist',categoryList)
router.get('/categorydetails/:id',categoryDetails)
router.put('/updatecategory/:id',categoryValidation,validation,updateCategory)
router.delete('/deletecategory/:id',deleteCategory)

module.exports=router