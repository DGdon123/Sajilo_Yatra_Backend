const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const crypto = require('crypto');
const sendEmail = require('../utils/setEmail');
const jwt = require('jsonwebtoken');
const API_KEY = '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';
const sgMail = require('@sendgrid/mail');
const nodemailer = require("nodemailer");

sgMail.setApiKey(API_KEY);

// to register user
exports.userRegister = async (req, res) => {
  try {const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    gender: req.body.gender,
    image: req.file.path,
    age: req.body.age,
    phoneNumber: req.body.phoneNumber,
    location: req.body.location,
    dob: req.body.dob,
  });
   

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email must be unique' });
    }

   
    // Save the user to the database
    await user.save();

   

    // Return the response with user details
    res.status(200).json({
      message: 'User registered successfully',
      user: {
        name: user.name,
        email: user.email,
        password: user.password,
        gender: user.gender,
        age: user.age,
        image: user.image,
        phoneNumber: user.phoneNumber,
        location: user.location,
        dob: user.dob,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

//reset password
exports.editProfile = async (req, res) => {
  try {
  const user = await User.findById(req.params.id).select('-hashed_password').select('-salt')
  if(!user){
    return res.status(400).json({error:'something went wrong'})
  }
     // Check if the email is already registered
    
    user.name = req.body.name;
    user.email = req.body.email;
    user.phoneNumber = req.body.phoneNumber;
    user.location = req.body.location;
    user.dob =req.body.dob;
    const existingUser = await User.findOne({ name: user.name });
if (existingUser) {
  return res.status(400).json({ message: 'Name must be new' });
}
// Check if a user with the same phone number already exists
const existingUserByEmail = await User.findOne({ email: user.email });
if (existingUserByEmail) {
  return res.status(400).json({ message: 'Email must be new' });
}
// Check if a user with the same phone number already exists
const existingUserByPhoneNumber = await User.findOne({ phoneNumber: user.phoneNumber });
if (existingUserByPhoneNumber) {
  return res.status(400).json({ message: 'Phone number must be new' });
}

const existingUserByLocation = await User.findOne({ location: user.location });
if (existingUserByLocation) {
  return res.status(400).json({ message: 'Location must be new' });
}

const existingUserByDOB = await User.findOne({ dob: user.dob });
if (existingUserByDOB) {
  return res.status(400).json({ message: 'Date of Birth must be new' });
}
    await user.save();

    res.status(200).json({
      message: 'Profile has been updated successfully',
      user: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location,
        dob: user.dob,
      },
    });

    
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};


// Confirming the email
exports.postEmailConfirmation = async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.params.token });

    if (!token) {
      return res.status(400).json({ error: 'Invalid token or token may have expired' });
    }

    const user = await User.findById(token.userId);

    if (!user) {
      return res.status(400).json({ error: 'We are unable to find the valid user for this token' });
    }

    // Check if already verified or not
    if (user.isVerified) {
      return res.status(400).json({ error: 'Email is already verified. Please login to continue' });
    }

    user.isVerified = true;
    await user.save();

    // Delete the token from the database after verification
    await Token.deleteOne({ token: req.params.token });

    res.json({ message: 'Congratulations, your email has been verified' });
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};




  //sign in
 //sign in
 exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email is registered or not
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Sorry, the email you provided was not found in our system' });
    }

    // Check the matching password for that email
    const isPasswordValid = await user.authenticate(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email and password do not match' });
    }

   

    // Generate token using user id and JWT secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });


    // Store token in the cookie
    res.cookie('testCookie', token, { expires: new Date(Date.now() + 99999) });

    // Return user information to frontend
    const { _id, name, role } = user;
    return res.json({ user: { _id, name, email, role, token } });
  } catch (error) {
    // Handle any potential errors
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//forgot password
exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Sorry, the email was not found in our system. Please try another email or register first.' });
    }

    let token = new Token({
      token: crypto.randomBytes(16).toString('hex'),
      userId: user._id,
      vehicleId: user._id
    });

    token = await token.save();

    if (!token) {
      return res.status(400).json({ error: 'Failed to store token' });
    }

    const resetPasswordLink = `${token.token}`;
    const emailContent = `Hello,\n\nPlease copy the token and use it in app:\n\n${resetPasswordLink}`;

    const transporter = nodemailer.createTransport({service:"gmail",auth:{
      user:"dipeshgurung797@gmail.com",
      pass:"aauucqdprnpdhkal"
    }});

   
    const message = {
      from: "dipeshgurung797@gmail.com",
      to: user.email,
      subject: 'Password Reset Link',
      text: emailContent,
     
    };

    transporter.sendMail(message, function(error, info){
      if(error){
        console.log(error);
      }
      else{
        console.log("Email sent: " + info.response);
      }
    });

    
    res.status(200).json({ message: 'A password reset link has been sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

//send otp for password reset
exports.sendOTP = async(email)=>{
  try{
    const existingUser = await User.findOne({email});
    if(!existingUser){
      throw Error("Ther's no account for the provided email.")
    }
    
    const otpDetails ={
      email,
      subject:"Password Reset",
      message:"Enter the code below to reset your password",duration:1
    }
    const createdOTP = await this.sendOTP(otpDetails);
    return createdOTP;
  }catch(error){
    throw error;
  }
}

//reset password
exports.resetPassword = async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.params.token });

    if (!token) {
      return res.status(400).json({ error: 'Invalid token or token may have expired' });
    }

    const user = await User.findOne({ _id: token.userId })   ;

    if (!user) {
      return res.status(400).json({ error: 'Sorry, this user is not associated with this token' });
    }

    user.password = req.body.password;
    
    await user.save();

    // Delete the token from the database after password reset
    await Token.deleteOne({ token: req.params.token });

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};


//signout
exports.signout = async (req,res) =>{
  res.clearCookie('testCookie')
  res.json({message:'signout success'})
}

//userlist
exports.userList = async(req,res) =>{
  const user = await User.find().select('-hashed_password').select('-salt')
  if(!user){
    return res.status(400).json({error:"something went wrong"})
  }
  res.send(user)
}

//user details
exports.userInfo=async(req,res)=>{
  const user = await User.findById(req.params.id).select('-hashed_password').select('-salt')
  if(!user){
    return res.status(400).json({error:'something went wrong'})
  }
  res.send(user)
}

// Middleware to require sign-in
exports.requireSignIn = (req, res, next) => {
  try {
    // Check if the authorization header exists
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded;
    next();
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ error: 'Invalid token' });
  }
};
