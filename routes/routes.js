const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json());

// Authentication
// const authentication = require('../authentication');

// Middleware
const tokenValidation = require('../middleware/headerValidation');
const requestBodyValidation = require('../middleware/validation')

// Permission
// const permissions = require('../permission/index')

// Controller
const userController = require('../controllers/userController');


// Join Zoom Meeting as a AI Bot
app.post('/auth', [requestBodyValidation.validateAuthAPI], (req, res) => {
   userController.generateToken(req, res);
})

app.post('/meetings/webhook', (req, res) => {
   userController.getMeetingWebHooks(req, res);
})

module.exports = app;
