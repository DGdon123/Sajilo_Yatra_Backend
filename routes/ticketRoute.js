const express = require('express')
const { postTicket} = require('../controllers/ticketController')
const router = express.Router()
const { ticketValidation } = require('../utils/validation')

router.post('/postTicket',ticketValidation,postTicket)

module.exports = router