const express = require('express')
const { processPayment, sendStripeApi } = require('../controllers/paymentController')
const router = express.Router()

router.post('/payment/process',processPayment)
router.get('/stripeapi',sendStripeApi)

module.exports=router