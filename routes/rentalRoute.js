const express = require('express')
const { postRental} = require('../controllers/rentalController')
const router = express.Router()
const { rentalValidation } = require('../utils/validation')

router.post('/postRental',rentalValidation,postRental)

module.exports = router