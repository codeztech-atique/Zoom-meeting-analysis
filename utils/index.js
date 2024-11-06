const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');


exports.jwtDecode = (jwtToken) => {
    var decoded = jwt.decode(jwtToken);
    return decoded;
}
