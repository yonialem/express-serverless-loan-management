const IS_OFFLINE = process.env.IS_OFFLINE;
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');

let dynamoDb;

if (IS_OFFLINE === 'true') {
    dynamoDb = new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    })
} else {
    dynamoDb = new AWS.DynamoDB.DocumentClient();
}

// DynamoDB Table Names

const Users = 'Users';
const Loans = 'Loans';
const ExchangeReferral = 'Referral';

//auth
const addUser = (
    bankEmail, state, firstName, lastName, phoneNumber, personalEmail, category, password
) => {
    return new Promise((resolve, reject) => {
        if (!(bankEmail && state && firstName && lastName && phoneNumber && personalEmail && category && password)) {
            resolve({code: 400, message: 'Missing Attributes'});
            return 1;
        }
        let hashedPassword = bcrypt.hashSync(password, 8);

        const params = {
            TableName: Users,
            Item: {
                id: personalEmail,
                bankEmail,
                state,
                firstName,
                lastName,
                phoneNumber,
                personalEmail,
                category,
                password: hashedPassword,
                created_date: new Date() + "",
                notification_token: " ",
                verified: false
            },
        };

        dynamoDb.put(params, (error) => {
            if (error) {
                console.log(error);
                resolve({code: 400, message: 'Unable to Add User'});
            } else {
                resolve({code: 200, data: params.Item});
            }
        });
    });
};

const getUser = (email) => {
    return new Promise((resolve, reject) => {
        if (!email) {
            reject({code: 400, message: 'Missing Attributes'});
            return 1;
        }
        const params = {
            TableName: Users,
            Key: {
                id: email
            },
        };
        dynamoDb.get(params, (error, result) => {
            if (error) {
                console.log(error);
                reject({code: 400, message: 'Could not get the user'});
            } else {
                if (result.Item) {
                    resolve({code: 200, data: result.Item});
                } else {
                    resolve({
                        code: 201, message: "User not Found.", data: []
                    });
                }
            }
        });
    });
}

//loan
const addLoan = (
    opportunityName, category, city, state, description, contactInfo, financialDetail, loanDocuments,userId, loanType=""
) => {
    return new Promise((resolve, reject) => {
        if (!(
            opportunityName && category && city && state && description && contactInfo && financialDetail &&
            loanDocuments
        )) {
            resolve({
                code: 400,
                message: 'Missing Loan Information'
            })
            return 1
        }

        const params = {
            TableName: Loans,
            Item: {
                id: new Date().getTime() + "",
                userId,
                loanType,
                opportunityName,
                category,
                city,
                state,
                description,
                contactInfo,
                financialDetail,
                loanDocuments,
                created_date: new Date() + "",
            },
        };

        dynamoDb.put(params, (error) => {
            if (error) {
                resolve({code: 400, message: 'Unable to Add Loan'});
            } else {
                resolve({code: 200, data: params.Item});
            }
        });
    })
}

const getLoan = (userId) => {
    return new Promise( (resolve,reject) => {

        var params = {
            TableName: Loans,
            IndexName: 'user-index',
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        dynamoDb.query(params, (error, result) => {

            if (error) {
                console.log(error);
                reject({code: 400, message: 'Could not Retrive Loan'});
            } else {
                if (result.Items.length > 0) {
                    console.log("--")
                    resolve(result.Items);
                } else {
                    resolve({code: 200, message: "No Loan"});
                }
            }

        });

    })
}

//referral

module.exports = {
    addUser: addUser,
    getUser: getUser,
    addLoan: addLoan,
    getLoan: getLoan,
}
