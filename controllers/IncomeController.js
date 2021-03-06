const IncomeSchema = require('../model/IncomeSchema');
let jwt = require('jsonwebtoken');

// add new income
const addIncome = async (req, resp) => {
    console.log('add income called', req.headers.token);

    const token = req.headers.token ? req.headers.token : 'empty';
    let tempEmail = '';
    if ('empty' === token) {
        resp.status(401).json({statusCode: 401, message: 'Unauthorized Request Detected.'});
    }

    //auth validation
    let isValid = new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_AUTH, function (error, decode) {
            if (error) {
                console.log(error);
                reject(false);
            }
            if (decode) {
                console.log('decode : ', decode);
                tempEmail = decode.email;
                resolve(true);
            }
        })
        //if valid req
    });

    isValid.then(value => {
        console.log('decode value in add income', value);
        let incomeSchema = new IncomeSchema({
            incomeName: req.body.incomeName,
            userEmail: req.body.userEmail,
            incomeCategory: req.body.incomeCategory,
            incomeType: req.body.incomeType,
            time: {
                year: req.body.year,
                month: req.body.month
            },
            incomeStatus: req.body.incomeStatus,
            incomeAmount: req.body.incomeAmount,
            incomeDescription: req.body.incomeDescription
        });
        incomeSchema.save().then(result => {
                resp.status(201).json({
                    statusCode: 201,
                    message: 'income saved successful',
                    dataSet: result
                });
            }
        ).catch(reason => {
            resp.status(500).json({
                message: 'internal Server Error.',
                state: false,
                error: reason
            });
        })
    }).catch(reason => {
        resp.status(401).json({statusCode: 401, message: 'Unauthorized Request Detected.'});
    });

}

// update income
const updateIncome = async (req, resp) => {
    console.log('income update method called')
    const token = req.headers.token ? req.headers.token : 'empty';
    let tempEmail = '';
    if ('empty' === token) {
        resp.status(401).json({statusCode: 401, message: 'Unauthorized Request Detected.'});
    }

    new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_AUTH, function (error, decoded) {
            if (error) {
                console.log('error : ', error);
                reject(false);
            }
            if (decoded) {
                console.log('decoded : ', decoded);
                tempEmail = decoded.email;
                resolve(true);
            }
        })
    }).then(value => {
        console.log('decode value in update income', value);
        let updateIncome = IncomeSchema.updateOne(
            {
                userEmail: tempEmail,
                incomeName: req.body.incomeName
            },
            {
                $set: {
                    "incomeName": req.body.incomeName,
                    "userEmail": req.body.userEmail,
                    "incomeCategory": req.body.incomeCategory,
                    "incomeType": req.body.incomeType,
                    "time.year": req.body.year,
                    "time.month": req.body.month,
                    "incomeStatus": req.body.incomeStatus,
                    "incomeAmount": req.body.incomeAmount,
                    "incomeDescription": req.body.incomeDescription
                }
            }
        );
        updateIncome.then(results => {
            console.log('updateIncome : ', updateIncome._update.$set);
            resp.status(200).json({
                statusCode: 201,
                message: 'income update successful',
                dataSet: updateIncome._update.$set
            });
        }).catch(reason => {
            console.log('reason : ', reason);
            resp.status(500).json({
                message: 'internal Server Error.',
                state: false,
                error: reason
            });
        })
    }).catch(reason => {
        resp.status(401).json({statusCode: 401, message: 'Unauthorized Request Detected.'});
    });
}

//delete income for specific customer
const deleteIncome = async (req, resp) => {
    const token = req.headers.token ? req.headers.token : 'empty';
    const incomeName = req.body.incomeName ? req.body.incomeName : 'empty';
    console.log('income delete method called', req.body.incomeName, ' | ', typeof token)
    let tempEmail = '';

    if ('empty' === token) {
        resp.status(401).json({statusCode: 401, message: 'Unauthorized Request Detected.'});
        return;
    }

    if ('empty' === incomeName) {
        resp.status(401).json({statusCode: 401, message: 'null income name.'});
        return;
    }

    new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_AUTH, function (error, decoded) {
            if (error) {
                console.log('error : ', error);
                reject(false);
            }
            if (decoded) {
                console.log('decoded : ', decoded);
                tempEmail = decoded.email;
                resolve(true);
            }
        })
    }).then(value => {
        console.log('decode value in update income', value);
        IncomeSchema.deleteOne({
            userEmail: tempEmail,
            incomeName: incomeName
        }).then(value => {
            console.log('value : ', value);
            resp.status(500).json({
                message: 'income delete success.',
                state: 201,
                dataSet: value
            });
        }).catch(reason => {
            resp.status(500).json({
                message: 'internal Server Error.',
                state: false,
                error: reason
            });
        })
    }).catch(reason => {
        resp.status(401).json({statusCode: 401, message: 'Unauthorized Request Detected.'});
    });
}

// get all income for specific id customer
const getAllIncome = async (req, resp) => {
    console.log('get all token : ', req.headers.token);
    const token = req.headers.token ? req.headers.token : 'empty';
    let tempMail;
    let tempPassword;

    if ('empty' === token) {
        resp.status(401).json({statusCode: 401, message: 'Unauthorized Request Detected.'});
        return;
    }

    const isValid = new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_AUTH, function (error, decoded) {
                if (error) {
                    console.log(error);
                    reject(false);
                }
                if (decoded) {
                    console.log(decoded);
                    tempMail = decoded.email;
                    tempPassword = decoded.password;
                    resolve(true);
                }
            })
        }
    );

    isValid.then(value => {
        console.log('is valid value : ', value);
        IncomeSchema.find({userEmail: tempMail}).then(result => {
            resp.status(200).json({
                statusCode: 200,
                message: 'allIncome For this user',
                dataSet: result
            });
        })
    }).catch(reason => {
        console.log(reason);
        resp.status(401).json({statusCode: 400, message: 'Unauthorized Request Detected.'});
    });

}

module.exports = {
    addIncome,
    getAllIncome,
    updateIncome,
    deleteIncome
}
