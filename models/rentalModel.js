const mongoose = require('mongoose')

const rentalSchema = new mongoose.Schema({
    vehicle_type:{
        type:String,required:true,trim:true
    },
    city:{
        type:String,required:true
    },
   dob: {
        type:String,
        required:true,
        trim:true,
      },
},{timestamps:true})

module.exports=mongoose.model('Rental',rentalSchema)