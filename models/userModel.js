const mongoose = require('mongoose')
const uuidv1 = require('uuidv1')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        require:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    gender:{
        type:String,
        required:true,
        trim:true,

    },
    age:{
        type:Number,
        required:true,
        trim:true,
        
    },
    phoneNumber:{
        type:String,
        required:true,
        trim:true,
        
    },
    location:{
        type:String,
        required:true,
        trim:true,
        
    },
    image:{
        type:String,required:false
    },
    dob: {
        type:String,
        required:true,
        trim:true,
      },
    role:{
        type:Number,
        deafult:0
    },
    hashed_password:{
        type:String,
        required:true
    },
    salt:String,
    isVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

// virtual fields
userSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt=uuidv1()
    this.hashed_password=this.encryptPassword(password)
})
.get(function(){
    return this._password
})

//defining methods
userSchema.methods={
    encryptPassword:function(password){
        if(!password) return ''
        try{
            return crypto
            .createHmac('sha1',this.salt)
            .update(password)
            .digest('hex')
        }
        catch(err){
            return ''
        }
    },
    authenticate:function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password
    }
}

module.exports=mongoose.model('User',userSchema)