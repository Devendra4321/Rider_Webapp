const { OAuth2Client } = require('google-auth-library');
const userModel = require("../model/user.model");
const captainModel = require("../model/captain.model");
const walletModel = require("../model/wallet.model");
const axios = require("axios");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports.googleSignUp = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if(!idToken) {
      return res.status(400).json({
        statusCode: 400,
        message: "Token is required",
      });
    }

    const ticket = await client.verifyIdToken({
       idToken,
       audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub, email, name } = payload;

    const existingUser = await userModel.findOne({ $or: [{ googleId: sub }, { email: email }] });

    if (existingUser) {
        return res.status(404).json({
            statusCode: 404,
            message: "User already exists",
        });
    }

    let user = new userModel({ 
        googleId: sub, 
        fullname: { 
            firstname: name.split(" ")[0],
            lastname: name.split(" ")[1] || "", 
        }, 
        email }); 
        
    await user.save();

    const wallet = new walletModel({
      userId: user._id,
    });
  
    await wallet.save();

    res.status(200).json({
       statusCode: 200,
       message: "User registerd successfully",
       user
    });
       
  } catch (error) {
    return res.status(500).json({
        statusCode: 500,
        message: error.message,
    });    
  }
};

module.exports.userGoogleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if(!idToken) {
      return res.status(400).json({
        statusCode: 400,
        message: "Token is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub, email } = payload;

    const user = await userModel.findOne({ googleId: sub, email: email });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found or Registered with different method",
      });
    }

    const token = user.generateAuthToken();
    
    res.status(200).json({
      statusCode: 200,
      message: "User login successfully",
      token: token,
      user,
    }); 
  } catch (error) {
    return res.status(500).json({
        statusCode: 500,
        message: error.message,
    });    
  }
};

module.exports.captainGoogleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if(!idToken) {
      return res.status(400).json({
        statusCode: 400,
        message: "Token is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const captain = await captainModel.findOne({ email: payload.email });

    if (!captain) {
      return res.status(404).json({
        statusCode: 404,
        message: "Captain not found or not registerd",
      });
    }

    const token = captain.generateAuthToken();
    
    res.status(200).json({
      statusCode: 200,
      message: "Captain login successfully",
      token: token,
      captain,
    }); 
  } catch (error) {
    return res.status(500).json({
        statusCode: 500,
        message: error.message,
    });    
  }
};

module.exports.facebookSignUp = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    if(!accessToken) {
      return res.status(400).json({
        statusCode: 400,
        message: "Token is required",
      });
    }

    // Verify Facebook Token
    const fbResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
    );   

    const { id, name, email } = fbResponse.data;

    const existingUser = await userModel.findOne({ $or: [{ facebookId: id }, { email: email }] });

    if (existingUser) {
        return res.status(404).json({
            statusCode: 404,
            message: "User already exists",
        });
    }

    let user = new userModel({ 
        facebookId: id, 
        fullname: { 
            firstname: name.split(" ")[0],
            lastname: name.split(" ")[1] || "", 
        }, 
        email });

    await user.save();

    const wallet = new walletModel({
      userId: user._id,
    });

    await wallet.save();

    res.status(201).json({
        statusCode: 201,
        message: "User registerd successfully",
        user
      });   
  } catch (error) {
    return res.status(500).json({
        statusCode: 500,
        message: error.message,
    });   
  }
};

module.exports.userFacebookLogin = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    if(!accessToken) {
      return res.status(400).json({
        statusCode: 400,
        message: "Token is required",
      });
    }

    // Verify Facebook Token
    const fbResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
    );   

    const { id, email } = fbResponse.data;

    const user = await userModel.findOne({ facebookId: id, email: email });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found or Registered with different method",
      });
    }

    const token = user.generateAuthToken();
    
    res.status(200).json({
      statusCode: 200,
      message: "User login successfully",
      token: token,
      user,
    });   
  } catch (error) {
    return res.status(500).json({
        statusCode: 500,
        message: error.message,
    });   
  }
};

module.exports.captainFacebookLogin = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    if(!accessToken) {
      return res.status(400).json({
        statusCode: 400,
        message: "Token is required",
      });
    }

    // Verify Facebook Token
    const fbResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
    );   
        
    const captain = await captainModel.findOne({ email: fbResponse.data.email });

    if (!captain) {
      return res.status(404).json({
        statusCode: 404,
        message: "Captain not found or not registerd",
      });
    }

    const token = captain.generateAuthToken();
    
    res.status(200).json({
      statusCode: 200,
      message: "Captain login successfully",
      token: token,
      captain,
    });    
  } catch (error) {
    return res.status(500).json({
        statusCode: 500,
        message: error.message,
    });   
  }
};