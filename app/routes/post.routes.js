module.exports = (app) => {
    const posts = require('../controllers/post.controller.js');

    const jwtToken = require('../Token/validToken.js');

    // Create a new Post
    app.post('/posts', posts.create);

    // Retrieve a single Post with postId
    app.get('/posts/:postId', posts.findOne);

    // Retrieve all Posts
    app.get('/posts', posts.findAll);

    // Update a Post with postId
    app.put('/posts/:postId', posts.update);

    // Delete a Post with postId
    app.delete('/posts/:postId', posts.delete);
}