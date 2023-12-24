const mongoose = require('mongoose')

const vehicleticketSchema = new mongoose.Schema({
    departure:{
        type:String,required:true,trim:true,     
    },
    arrival:{
        type:String,required:true,trim:true,     
    }, 
    depart_time:{
        type:String,required:true,trim:true,  
    },
    arrival_time:{
        type:String,required:true,trim:true, 
    },
    meet:{
        type:String,required:true,trim:true, 
    },
   ddob: {
        type:String,
        required:true,
        trim:true,
      },
    price:{
        type:String,required:true,trim:true,
    },
},{timestamps:true})

module.exports=mongoose.model('VehicleOwnerTicket',vehicleticketSchema)