const Rental = require('../models/rentalModel');

//to post product
exports.postRental = async (req, res) => {
    let rental = new Rental({
        vehicle_type: req.body.vehicle_type,
        city: req.body.city,    
        dob: req.body.dob,
    });
    
    let savedRental = await rental.save();
    
    if (!savedRental) {
      return res.status(400).json({ error: 'Something went wrong' });
    }
    
    res.send(savedRental);
  };
  