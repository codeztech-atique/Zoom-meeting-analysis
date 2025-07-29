const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Authentication
const authentication = require('../authentication');

// Middleware
const middleware = require('../middleware/validation');

// Validate Token
const validateToken = require('../middleware/headerValidation');

// Controller
const authController = require('../controllers/authController');

app.post('/register', (req, res) => {
   authController.register(req, res);
});

app.post('/login', [middleware.validateLoginUserAPI], (req, res) => {
   authController.login(req, res);
});

app.post('/verifytoken', [middleware.validateVerifyTokenAPI], (req, res) => {
   authController.verifyToken(req, res);
});


module.exports = app;