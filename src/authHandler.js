let express = require('express');
let router = express.Router();
const VerifyToken = require('./util/verifyToken');
const GenerateToken = require('./util/generateToken');
const bcrypt = require('bcryptjs');
const db = require("./db");

router.get('/', function (req, res, next) {
    res.send('Auth-Route');
});

router.post('/signup', async function (req, res, next) {

    const {bankEmail, state, firstName, lastName, phoneNumber, personalEmail, category, password} = req.body;

    let fullName = firstName + " " + lastName

    const userData = await db.getUser(personalEmail)

    if (userData.code === 201) {

        db.addUser(bankEmail, state, firstName, lastName, phoneNumber, personalEmail, category, password, "USER").then(async response => {

            const token = await GenerateToken.generateJWTToken(personalEmail, fullName)

            res.status(200).send({success: true, token});

        }).catch(err => {
            res.status(500).send({success: false});
        })
    } else {
        res.send({code: 400, data: "User Already Exists"});
    }

});

router.post('/login', function (req, res, next) {

    console.log(req.body)

    db.getUser(req.body.email).then(async response => {

        if (response.code === 200) {

            let passwordIsValid = bcrypt.compareSync(req.body.password, response.data.password);

            if (passwordIsValid) {

                const token = await GenerateToken.generateJWTToken(req.body.email, response.data.firstName + " " + response.data.lastName)

                res.status(200).send({
                    code: 200,
                    success: true,
                    token: token,
                    data: "Login Successful"
                });

            } else {
                res.status(400).send({
                    success: false,
                    message: "Invalid Username/Password"
                });
            }
        } else {
            res.status(404).send({
                success: false,
                message: "User Not Found"
            });
        }
    }).catch(err => {
        console.log(err)
        res.status(500).send({"message": "Invalid Username / Password"});
    })
});


module.exports = router;
