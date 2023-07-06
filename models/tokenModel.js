const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const tokenSchema = new mongoose.Schema({
    token:{
        type:String,required:true
    },
    userId:{
        type:ObjectId,
        required:true,
        ref:'User'
    },
    vehicleOwnerId: { // New reference to the vehicle owner
        type: ObjectId,
        required: true,
        ref: 'VehicleOwner',
      },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:86400
    }
})

module.exports=mongoose.model('Token',tokenSchema)