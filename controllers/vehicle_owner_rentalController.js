const VehicleRental = require('../models/vehiclerentalModel');

//to post product
exports.postVehicleRental = async (req, res) => {
    let rental = new VehicleRental({
      city: req.body.city,
        depart_time: req.body.depart_time,
        arrival_time: req.body.arrival_time,
        meet: req.body.meet,
        ddob: req.body.ddob,
        rdob: req.body.rdob,
        price: req.body.price,
    });
    
    let savedRental = await rental.save();
    
    if (!savedRental) {
      return res.status(400).json({ error: 'Something went wrong' });
    }
    
    res.send(savedRental);
  };
  