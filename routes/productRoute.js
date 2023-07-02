const express = require('express')
const { postProduct, productList, productDetails, deleteProduct, updateProduct, listRelated } = require('../controllers/productController')
const router = express.Router()
const upload = require('../middleware/file-upload')
const { productValidation, validation } = require('../utils/validation')

router.post('/postProduct',upload.single('product_image'),productValidation,validation,postProduct)
router.get('/productlist',productList)
router.get('/productdetails/:id',productDetails)
router.delete('/deleteproduct/:id',deleteProduct)
router.put('/updateproduct/:id',upload.single('product_image'),productValidation,validation,updateProduct)
router.get('/listrelated/:id',listRelated)

module.exports = router