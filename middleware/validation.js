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