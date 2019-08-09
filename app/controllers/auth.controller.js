const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const config = require('../../config/auth.js');

const User = require('../models/user.model.js');

//Login user
exports.login = (req, res) => {
 // Validate request
 if(!req.body.username) {
    return res.status(400).send({
        message: "Username can not be empty(400)"
    });
}
//Hash Password
let Hashpassword = bcrypt.hashSync(req.body.password, 10);

    console.log("Hashpassword: "+Hashpassword);

    User.findOne({ username: req.body.username})
    .then(user => {

        // console.log(user);
        if(!user){
            res.status(404).send({
                message: "User not found(404)"
            });
        }
        else{
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result == true) {
                    let token = jwt.sign({user}, config.secret, { expiresIn: '1h' });

                    if(!req.session.token){
                        req.session.token = token;

                        req.session.save(function(err) {
                            // session saved
                            console.log("session was saved");
                          });
                    }
                    
                    res.send(token);

                } else {
                    res.status(401).send({
                        message: "Unauthorized requst(401)"
                    });
                }
              });
        }
    }).catch(err => {
        res.status(401).send({
            message: err.message || "Some error occurred user login(401)"
        });
    });

};

//Register user
exports.register = (req, res) => {
// Validate request
if(!req.body.username) {
    return res.status(400).send({
        message: "User content can not be empty(400)"
    });
}
//Hash Password
let Hashpassword = bcrypt.hashSync(req.body.password, 10);


//Create a User
const user = new User({
    title: req.body.title || "Untitled User", 
    
    username: req.body.username,
    password: Hashpassword,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    avatarurl: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortCurly&accessoriesType=Blank&hairColor=Black&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Happy&eyebrowType=Default&mouthType=Default&skinColor=Light",
    enableflag: req.body.enableflag,
    userLevel: req.body. userLevel
   

});

//Save User in the database
user.save()
.then(data => {
    res.send(data);
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred User(500)"
    });
});

};

//logout 

exports.logout = (req, res) => {
    // Validate request
    if(!req.body.token) {
       return res.status(400).send({
           message: "Token can not be empty(400)"
       });
   }

   if(req.session.token){
       if(req.session.token == req.body.token){
           req.session.token = null;
           res.send({
               message: "logout successful"
           });
       }
       res.send({
        message: "token mismatch"
    });
   }
   else{
    res.send({
        message: "session not set"
    });
   }
   
   }; 


//Check username

exports.checUsername = (req, res) => {
    //Validate request
    if(!req.body.username) {
        return res.status(400).send({
            message: "Username can not be empty(400)"
        });
    }

    try {

        User.findOne({ username: req.body.username})
        .then(user => {
            if(!user){
                res.send({
                    status: 1,
                    message: "Username is avaliable"
                });
            }
            else{
                res.send({
                    status: 0,
                    message: "Username is NOT avaliable"
                });
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred username(500)"
            });
        });
    } catch(err) {
    // err
    res.status(401).send({
            message: "Database connection error(401)"
        });
    }


}; 

   
//Reset password

exports.resetPassword = (req, res) => {
    //Validate request
    if(!req.body.username || !req.body.old_password || !req.body.new_password) {
       return res.status(400).send({
           message: "Required fields can not be empty(400)"
       });
   }
   
   let oldHashpassword = bcrypt.hashSync(req.body.old_password, 10);

   let newHashpassword = bcrypt.hashSync(req.body.new_password, 10);
   
    //console.log("Hashpassword: "+Hashpassword);
   
       User.findOne({ username: req.body.username})
       .then(user => {
   
           //console.log(user);
           if(!user){
               res.status(404).send({
                   message: "User not found(404)"
               });
           }
           else{
               bcrypt.compare(req.body.old_password, user.password, function (err, result) {
                   if (result == true) {
                       
                    User.findByIdAndUpdate(user._id, {
                       
                        password: newHashpassword
                        
                    }, {new: true})
                    .then(user => {
                        if(!user) {
                            return res.status(404).send({
                                message: "User not found(404) " + user._id
                            });
                        }
                        res.send({
                            status: 1,
                            message: "Password reset successful"
                        });
                    }).catch(err => {
                        if(err.kind === 'ObjectId') {
                            return res.status(404).send({
                                message: "User not found(404) " +  user._id
                            });                
                        }
                        return res.status(500).send({
                            message: "Error updating user(500) " +  user._id
                        });
                    });
   
                   } else {
                       res.status(401).send({
                           message: "Unauthorized requst(401)"
                       });
                   }
                 });
           }
       }).catch(err => {
           res.status(401).send({
               message: err.message || "Some error occurred user login(401)"
           });
       });
   
   };


