const express = require('express')
const { vehicleownerValidation, validation } = require('../utils/validation')
const { vsignIn, vehicleownerRegister, vforgetPassword, vresetPassword, vsignout } = require('../controllers/vehicle_ownerController')
const router = express.Router()

router.post('/vehicleRegister',vehicleownerValidation,validation,vehicleownerRegister),
router.post('/vsignin',vsignIn)
router.post('/vforgotpassword',vforgetPassword)
router.put('/vresetpassword/:token',vresetPassword)
router.post('/vsignout',vsignout)

module.exports=router