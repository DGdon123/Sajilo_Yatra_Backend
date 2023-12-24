const express = require('express')
const { postVehicleTicket} = require('../controllers/vehicle_owner_ticketController')
const router = express.Router()
const { ticketValidation } = require('../utils/validation')

router.post('/postVehicleTicket',ticketValidation,postVehicleTicket)

module.exports = router