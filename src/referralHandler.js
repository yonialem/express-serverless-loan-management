let express = require('express');
let router = express.Router();
const VerifyToken = require('./util/verifyToken');
const GenerateToken = require('./util/generateToken');
const bcrypt = require('bcryptjs');
const db = require("./db");

router.post('/', VerifyToken, async function (req, res, next) {

    const {firstName, lastName, contactNumber, emailAddress, loanAmount, specificAmount, loanTimeline, referralNote} = req.body;

    db.addReferral(
        firstName, lastName, contactNumber, emailAddress, loanAmount, specificAmount, loanTimeline, referralNote
    ).then(async response => {

        res.status(200).send({success: true, response});

    }).catch(err => {
        res.status(500).send({success: false});
    })
});


router.get('/', VerifyToken, function (req, res, next) {

    db.getReferral(req.query.email).then(response => {
        res.status(200).send({success: true, data: response});

    }).catch(err => {
        res.status(500).send({success: false});
    })
});

module.exports = router;
