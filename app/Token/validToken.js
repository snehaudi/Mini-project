
let jwt = require('jsonwebtoken');

const config = require('../../config/auth.js');


let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token && token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
  
    if (token) {

        let session_token = req.session.token;
        // console.log("session token: "+session_token);
        if(session_token){
            if(session_token == token){
                jwt.verify(token, config.secret, (err, decoded) => {
                    if (err) {
                      return res.json({
                        status: false,
                        message: 'Token is not valid'
                      });
                    } else {
                      req.decoded = decoded;
                      next();
                    }
                  });
            }
            else{
                res.send({message: "Unauthorized"});
            }
        }
        else{
            res.send({message: "session error"});
        }

      
    } else {
      return res.json({
        status: false,
        message: 'Token is not provided'
      });
    }
  };
  
  module.exports = {
    checkToken: checkToken
  }
  