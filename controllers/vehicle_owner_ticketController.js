const VehicleTicket = require('../models/vehicleticketModel');

//to post product
exports.postVehicleTicket = async (req, res) => {
    let ride = new VehicleTicket({
        departure: req.body.departure,
        arrival: req.body.arrival,
        depart_time: req.body.depart_time,
        arrival_time: req.body.arrival_time,
        meet: req.body.meet,
        ddob: req.body.ddob,
        price: req.body.price,
    });
    
    let savedRental = await ride.save();
    
    if (!savedRental) {
      return res.status(400).json({ error: 'Something went wrong' });
    }
    
    res.send(savedRental);
  };
  