const mongoose=require('mongoose')
const{ObjectId}=mongoose.Schema

const orderSchema=new mongoose.Schema({
    orderItems:[{
        type:ObjectId,
        required:true,
        ref:'OrderItem'
    }],
    shippingAddress1:{
        type:String,
        required:true
    },
    shippingAddress2:{
        type:String
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'Pending'
    },
    totalPrice:{
        type:Number,
        required:true
    },
    user:{
        type:ObjectId,
        required:true,
        ref:'User'
    },
    dateOrdered:{
        type:Date,
        defaulot:Date.now()
    
    },
})

module.exports=mongoose.model('Order',orderSchema)