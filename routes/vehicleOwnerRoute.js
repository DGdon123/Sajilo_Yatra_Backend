const express = require('express')
const { vehicleownerValidation, validation } = require('../utils/validation')
const { vsignIn, vehicleownerRegister } = require('../controllers/vehicle_ownerController')
const router = express.Router()

router.post('/vehicleRegister',vehicleownerValidation,validation,vehicleownerRegister),
router.post('/vsignin',vsignIn)


module.exports=router