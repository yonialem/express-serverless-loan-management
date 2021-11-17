const serverless = require('serverless-http');
const bodyParser = require('body-parser')
const express = require('express');
let cors = require('cors');

const authHandler = require("./authHandler")
const loanHandler = require("./loanHandler")
const referralHandler = require("./referralHandler")

const app = express();

app.use(cors())

app.use(bodyParser.json({strict: false}));

app.use('/auth', authHandler);
app.use('/loan', loanHandler);
// app.use('/referral', referralHandler);

module.exports.handler = serverless(app);
