const moment = require('moment');

//Create simple middleware function 
//always need to call 'next' to go to next middleware function
const logger = (req, res, next) => { 
    console.log(
        `${req.protocol}://${req.get('host')}${
            req.originalUrl}: ${moment().format()}`
    );
    // will output "http://localhost:5000/api/members" when the API Get is called
    next();
}

module.exports = logger;