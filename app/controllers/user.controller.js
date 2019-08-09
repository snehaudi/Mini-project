const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const User = require('../models/user.model.js');

const config = require('../../config/auth.js');

//Retrieve a single user with a userId
exports.findOne = (req, res) => {
    User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found(404) " + req.params.userId
            });            
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found(404) " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user(500) " + req.params.userId
        });
    });
};

//Retrieve all users from the database
exports.findAll = (req, res) => {

try {

    let token = req.session.token;

    
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred users(500)"
        });
    });
  } catch(err) {
    // err
    res.status(401).send({
        message: "Unauthorized request(401)"
    });
  }

    
};

//Update a user identified by the userId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "User content can not be empty(400)"
        });
    }
    //Hash Password
    let Hashpassword = bcrypt.hashSync(req.body.password, 10);

    //Find user and update it with the request body
    User.findByIdAndUpdate(req.params.userId, {
        title: req.body.title || "Untitled User",
        
        username: req.body.username,
        password: Hashpassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        avatarurl: req.body.avatarurl,
        enableflag: req.body.enableflag,
        userLevel: req.body.userLevel


        
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found(404) " + req.params.userId
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found(404) " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Error updating(500) " + req.params.userId
        });
    });
};

//Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found(404) " + req.params.userId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found(404) " + req.params.userId
            });                
        }
        return res.status(500).send({
            message: "Could not delete user(500) " + req.params.userId
        });
    });
};