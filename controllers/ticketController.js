const Ticket = require('../models/ticketModel');

//to post product
exports.postTicket = async (req, res) => {
    let ticket = new Ticket({
        vehicle_type: req.body.vehicle_type,
        departure: req.body.departure,
        arrival: req.body.arrival,
        dob: req.body.dob,
    
    });
    
    let savedTicket = await ticket.save();
    
    if (!savedTicket) {
      return res.status(400).json({ error: 'Something went wrong' });
    }
    
    res.send(savedTicket);
  };
  