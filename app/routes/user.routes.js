module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    const jwtToken = require('../Token/validToken.js');

    // Retrieve a single User with userId
     app.get('/users/:userId', jwtToken.checkToken, users.findOne);

    // Retrieve all Users
    app.get('/users/all', jwtToken.checkToken, users.findAll);

    // Update a User with userId
    app.put('/users/:userId', jwtToken.checkToken, users.update);

    // Delete a User with userId
    app.delete('/users/:userId', jwtToken.checkToken, users.delete);

}
