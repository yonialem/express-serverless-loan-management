let jwt = require('jsonwebtoken');
let APISecret = require('./APISecret');

const verifyToken = (req, res, next) => {
    let authorization = req.headers['authorization'];
    if (!authorization || (authorization.split(" ")[0]).toLowerCase() !== 'bearer')
        return res.status(403).send({auth: false, message: 'No token provided.'});
    let token = authorization.split(" ")[1]

    jwt.verify(token, APISecret.secret, function (err, decoded) {
        if (err)
            return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        // email, fullName, verified, isAdmin
        req.email = decoded.email;
        req.fullName = decoded.fullName;
        next();
    });
}

module.exports = verifyToken;
