const chalk = require('chalk');

exports.validateAuthAPI = (req, res, next) => {
    console.log();
    console.log(chalk.bgYellowBright("---------------- Validated Auth API Data ----------------"));
    var error = '';
    if (req.body.meetingNumber === undefined || req.body.meetingNumber === '') {
      console.log(chalk.red('meetingNumber is missing'));
      error += "meetingNumber, "
    }
    if (req.body.role === undefined || req.body.role === '') {
      console.log(chalk.red('role is missing'));
      error += "role, "
    }
    if (error !== '') {
      res.status(400).send({
        status: 400,
        message: error + ' is required !!!'
      });
    } else {
      next();
    }
  };

  exports.validateRegisterUserAPI = (req, res, next) => {
  // console.log();
  // console.log(chalk.bgYellowBright("---------------- Validated API Data ----------------"));
  var error = '';
  
  if (req.body.email === undefined || req.body.email === '') {
    console.log(chalk.red('email is missing'));
    error += "email, "
  }
  if (req.body.password === undefined || req.body.password === '') {
    console.log(chalk.red('password is missing'));
    error += "password, "
  }

  if (error !== '') {
    res.status(400).send({
      status: 400,
      message: error + ' is required !!!'
    });
  } else {
    next();
  }
};



// Validate API
exports.validateLoginUserAPI = (req, res, next) => {
  // console.log();
  // console.log(chalk.bgYellowBright("---------------- Validated API Data ----------------"));
  var error = '';
  if (req.body.email === undefined || req.body.email === '') {
    console.log(chalk.red('email is missing'));
    error += "email, "
  }
  if (req.body.password === undefined || req.body.password === '') {
    console.log(chalk.red('password is missing'));
    error += "password, "
  }
  if (error !== '') {
    res.status(400).send({
      status: 400,
      message: error + ' is required !!!'
    });
  } else {
    next();
  }
};


exports.validateVerifyTokenAPI = (req, res, next) => {
  // console.log();
  // console.log(chalk.bgYellowBright("---------------- Validated API Data ----------------"));
  var error = '';
  if (req.body.token === undefined || req.body.token === '') {
    console.log(chalk.red('token is missing'));
    error += "token, "
  }

  if (error !== '') {
    res.status(400).send({
      status: 400,
      message: error + ' is required !!!'
    });
  } else {
    next();
  }
};
