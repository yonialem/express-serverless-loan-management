let jwt = require('jsonwebtoken');
let APISecret = require('./APISecret');

const generateJWTToken = (email, fullName) => {
    return jwt.sign(
        {email, fullName}, APISecret.secret,
        {
            expiresIn: 2678400 // expires in 31 days
        }
    );
}
module.exports.generateJWTToken = generateJWTToken;


