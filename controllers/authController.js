//Load cognito wrapper.
const cognito = require('../services/cognito.js');
const exception = require('../exception/index');
const authentication = require('../authentication');

exports.register = async function (req, res) {
  try {

    //Send to cognito the signup request.
    let result = await cognito.signUp(req.body);
   
    res.status(200).json(result);

  } catch (err) {
    console.log("Error:", err);
    const getException = exception.userException(err.name)
    res.status(400).json(getException);
  }
}

exports.login = async function (req, res) { 
  let {
      email,
      password
  } = req.body;

  try {
    //Send to cognito the signup request.
    let result = await cognito.logIn(email, password);
  
    res.status(200).json(result);
    
  } catch (err) {
    console.log(err);
    const getException = exception.userException(err.name)
    res.status(400).json(getException);
  }
}


exports.verifyCode = async function (req, res) {
  const {
    body
  } = req;

  //Validate request format.
  if (body.user && body.code) {
    const {
      user,
      code
    } = body;

    try {

      //Send to cognito the signup request.
      let result = await cognito.verifyCode(user, code);
      res.status(200).json({
        "result": result
      });

    } catch (error) {
      console.log(error);
      res.status(400).json({
        "error": error
      });
    }

  } else {
    res.status(400).json({
      "error": "bad format"
    });
  }
}


exports.verifyToken = async function (req, res) {
  const {
    body
  } = req;

  //Validate request format.
  if (body.token) {
    try {
      //Verify token.
      let result = await authentication.verify(req, res);
      res.status(200).json({
        "result": result
      });

    } catch (e) {
      console.log(e);
      res.status(500).json({
        "error": e
      });
    }
  } else {
    res.status(400).json({
      "error": "bad format"
    });
  }
}

exports.renewToken = async function (req, res) {
  const {
    body
  } = req;
  //Validate request format.
 let {
    token
  } = body;

  try {
    //Send to cognito the renew token request.
    let result = await cognito.renew(token);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      "error": err
    });
  }
}