const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    vehicle_type:{
        type:String,required:true,trim:true
    },
    departure:{
        type:String,required:true
    },
    arrival:{
        type:String,required:true
    },
   dob: {
        type:String,
        required:true,
        trim:true,
      },
},{timestamps:true})

module.exports=mongoose.model('Ticket',ticketSchema)