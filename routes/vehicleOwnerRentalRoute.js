const express = require('express')
const { postVehicleRental} = require('../controllers/vehicle_owner_rentalController')
const router = express.Router()
const { ticketValidation } = require('../utils/validation')

router.post('/postVehicleTicket',ticketValidation,postVehicleTicket)

module.exports = router