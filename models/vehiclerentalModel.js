const mongoose = require('mongoose')

const vehiclerentalSchema = new mongoose.Schema({
    city:{
        type:String,required:true,trim:true,     
    },
    time:{
        type:String,required:true,trim:true,  
    },
    meet:{
        type:String,required:true,trim:true, 
    },
},{timestamps:true})

module.exports=mongoose.model('VehicleOwnerRental',vehiclerentalSchema)