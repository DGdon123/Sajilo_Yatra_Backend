const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const crypto = require('crypto');
const sendEmail = require('../utils/setEmail');
const jwt = require('jsonwebtoken');


// to register user
exports.userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email must be unique' });
    }

    // Create a new user
    const user = new User({
      name,
      email,
      password,
    });

    // Save the user to the database
    await user.save();

    let token = new Token({
      token: crypto.randomBytes(16).toString('hex'),
      userId: user._id,
    });

    token = await token.save();

    if (!token) {
      return res.status(400).json({ error: 'Failed to store token' });
    }

    sendEmail({
      from: 'no-reply@expresscommerce.com',
      to: user.email,
      subject: 'Email Verification Link',
      text: `Hello, \n\nPlease verify your email by clicking the below link:\n\nhttp:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`,
    });

    // Return the response with user details
    res.status(200).json({
      message: 'User registered successfully',
      user: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  } catch (error) {
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
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email is registered or not
    const user = await User.findOne({ email });
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

    // Check if user is verified or not
    if (!user.isVerified) {
      return res.status(400).json({ error: 'Please verify your email before logging in' });
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
    return res.status(500).json({ error: 'Internal server error' });
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
    });

    token = await token.save();

    if (!token) {
      return res.status(400).json({ error: 'Failed to store token' });
    }

    const resetPasswordLink = `http://${req.headers.host}/api/resetpassword/${token.token}`;
    const emailContent = `Hello,\n\nPlease reset your password by clicking the below link:\n\n${resetPasswordLink}`;

    await sendEmail({
      from: 'no-reply@expresscommerce.com',
      to: user.email,
      subject: 'Password Reset Link',
      text: emailContent,
    });

    res.status(200).json({ message: 'A password reset link has been sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.params.token });

    if (!token) {
      return res.status(400).json({ error: 'Invalid token or token may have expired' });
    }

    const user = await User.findOne({ _id: token.userId });

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
