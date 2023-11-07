const express = require('express')
const { userRegister, postEmailConfirmation, signIn, forgetPassword, resetPassword, editProfile, signout, userList, userInfo, requireSignIn, sendOTP } = require('../controllers/userController')
const { userValidation, validation } = require('../utils/validation')
const router = express.Router()

router.post('/register',userValidation,validation,userRegister)
router.post('/confirmation/:token',postEmailConfirmation)
router.post('/signin',signIn)
router.post('/forgetpassword',forgetPassword)
router.put('/editProfile/:id',editProfile)
router.put('/resetpassword/:token',resetPassword)
router.post('/signout',signout)
router.get('/userlist',requireSignIn, userList)
router.get('/userinfo/:id', userInfo)
router.post("/forgotpassword", async (req,res) =>{
    try{
        const {email} = req.body;
        if(!email) throw Error("An email is required.")
        const createdPasswordResetOTP = await sendOTP(email);
        res.status(200).json(createdPasswordResetOTP);
    }
    catch(error){
        res.status(400).send(error.message);
    }
});

module.exports=router