module.exports = (app) => {
    const auth = require('../controllers/auth.controller.js');

    const jwtToken = require('../Token/validToken.js');

    //Register a User
    app.post('/auth/register', auth.register);    

    // Login a User
    app.post('/auth/login', auth.login);

    //Logout 
    app.post('/auth/logout', auth.logout);

    //Check username
    app.post('/auth/checkusername', auth.checUsername);

    // reset password
    app.post('/auth/resetpassword', jwtToken.checkToken, auth.resetPassword);


}