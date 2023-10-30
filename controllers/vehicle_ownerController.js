const Vehicle = require('../models/vehicleOwnerModel');
const Token = require('../models/tokenModel');
const crypto = require('crypto');
const sendEmail = require('../utils/setEmail');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

exports.vehicleownerRegister = async (req, res) => {
    try {
      const { name, email, password, gender, age, phoneNumber, location, dob, vehicleName, vehicleType, vehicleNumber, vehicleSeat  } = req.body;
  
      // Check if the email is already registered
      const existingUser = await Vehicle.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email must be unique' });
      }
  
      // Create a new user
      const user = new Vehicle({
        name,
        email,
        password,
        gender,
        age,
        phoneNumber,
        location,
        dob,
        vehicleName,
        vehicleType,
        vehicleNumber,
        
        vehicleSeat
      });
  
      // Save the user to the database
      await user.save();
  
      
  
      // Return the response with user details
      res.status(200).json({
        message: 'Vehicle Owner registered successfully',
        vehicle_owner: {
          name: user.name,
          email: user.email,
          password: user.password,
          gender: user.gender,
          age: user.age,
          phoneNumber: user.phoneNumber,
          location: user.location,
          vehicleName:user.vehicleName,
          vehicleType: user.vehicleType,
         
          vehicleNumber:user.vehicleNumber,
          vehicleSeat:user.vehicleSeat,
          dob: user.dob,
        },
      });
    } catch (error) {
        console.error(error); // Log the full error object
        res.status(500).json({ error: 'Internal server error' });
      }
      
  };
  
  // Confirming the email
exports.postEmailConfirmation = async (req, res) => {
    try {
      const token = await Token.findOne({ token: req.params.token });
  
      if (!token) {
        return res.status(400).json({ error: 'Invalid token or token may have expired' });
      }
  
      const user = await Vehicle.findById(token.vehicleOwnerIdId);
  
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
 exports.vsignIn = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the email is registered or not
      const user = await Vehicle.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: 'Sorry, the email you provided was not found in our system' });
      }
  
      // Check the matching password for that email
      const isPasswordValid = await user.authenticate(password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Email and password do not match' });
      }
  
      
  
      // Generate token using user id and JWT secret
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
  
      // Store token in the cookie
      res.cookie('testCookie', token, { expires: new Date(Date.now() + 99999) });
  
      // Return user information to frontend
      const { _id, name, role } = user;
      return res.json({ vehicle_owner: { _id, name, email, role, token } });
    } catch (error) {
      // Handle any potential errors
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  //forgot password
exports.vforgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Vehicle.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Sorry, the email was not found in our system. Please try another email or register first.' });
    }

    let token = new Token({
      userId:user._id,
     
      token: crypto.randomBytes(16).toString('hex'),
      vehicleId: user._id,
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

//reset password
exports.vresetPassword = async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.params.token });

    if (!token) {
      return res.status(400).json({ error: 'Invalid token or token may have expired' });
    }

    const user = await Vehicle.findOne({ _id: token.vehicleId })   ;

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