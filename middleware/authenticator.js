const jwt = require('jsonwebtoken');
const User = require('../models/User');

let JWT_SECRET = 'AchillesDrill2022'

exports.authenticateJwt = async (req, res, next) => {
  let token; 
  console.log(req.headers);

  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      token = req.headers.authorization.split(" ")[1]
  }

  console.log("token from authenticator",token);                                                                                                                                                                    

  if(!token) {
      res.status(401).json({errorMessage : 'No Token. Authorization denied. Please Login to have access'})
  }

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log(decoded);

      const user = await User.findById(decoded.id);

      if(!user) {
        return res.status(404).json({errorMessage : 'Invalid User Id'})
      }

      req.user = user;

      next();
  } catch (error) {
      console.log('jwtError', error.message)
    return res.status(401).json({errorMessage : 'Invalid Token. Not Authorized to access this route'})
  }
}