require('dotenv').config()

const server = require('./index');
const chalk = require('chalk');
const port = process.env.PORT || 8081;


// Server
server.listen(port, () => {
    console.log(chalk.green('╔═══════════════════════════════════════════════════════════'));
    console.log(chalk.green('║ Background Server Listening at | port: %s', port));
    console.log(chalk.green('╚═══════════════════════════════════════════════════════════'));
});