const express = require('express')
const { userRegister, postEmailConfirmation, signIn, forgetPassword, resetPassword, signout, userList, userInfo, requireSignIn } = require('../controllers/userController')
const { userValidation, validation } = require('../utils/validation')
const router = express.Router()

router.post('/register',userValidation,validation,userRegister)
router.post('/confirmation/:token',postEmailConfirmation)
router.post('/signin',signIn)
router.post('/forgetpassword',forgetPassword)
router.put('/resetpassword/:token',resetPassword)
router.post('/signout',signout)
router.get('/userlist',requireSignIn, userList)
router.get('/userinfo/:id',requireSignIn, userInfo)

module.exports=router