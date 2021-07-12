const ExpensesSchema = require('../model/ExpensesSchema');
let jwt = require('jsonwebtoken');

// add new Expenses
const addExpenses = async (req, resp) => {
    console.log('add expenses called', req.headers.token);

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
        console.log('decode value in add expenses : ', value);
        let expensesSchema = new ExpensesSchema({
            expensesName: req.body.expensesName,
            userEmail: req.body.userEmail,
            expensesCategory: req.body.expensesCategory,
            time: {
                year: req.body.year,
                month: req.body.month
            },
            paymentMethod: req.body.paymentMethod,
            expensesStatus: req.body.expensesStatus,
            expensesAmount: req.body.expensesAmount,
            expensesDescription: req.body.expensesDescription
        });
        expensesSchema.save().then(result => {
                resp.status(201).json({
                    statusCode: 201,
                    message: 'expenses saved successful',
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

// update Expenses
const updateExpenses = async (req, resp) => {
    console.log('Expenses update method called')
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
        console.log('decode value in update Expenses', value);
        let updateExpense = ExpensesSchema.updateOne(
            {
                userEmail: tempEmail,
                expensesName: req.body.expensesName
            },
            {
                $set: {
                    "expensesName": req.body.expensesName,
                    "userEmail": req.body.userEmail,
                    "expensesCategory": req.body.expensesCategory,
                    "year": req.body.year,
                    "month": req.body.month,
                    "paymentMethod": req.body.paymentMethod,
                    "expensesStatus": req.body.expensesStatus,
                    "expensesAmount": req.body.expensesAmount,
                    "expensesDescription": req.body.expensesDescription
                }
            }
        );
        updateExpense.then(results => {
            console.log('updateExpense : ', updateExpense._update.$set);
            resp.status(200).json({
                statusCode: 201,
                message: 'Expense update successful',
                dataSet: updateExpense._update.$set
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

//delete Expenses for specific customer
const deleteExpenses = async (req, resp) => {
    const token = req.headers.token ? req.headers.token : 'empty';
    const expensesName = req.body.expensesName ? req.body.expensesName : 'empty';
    console.log('income delete method called', req.body.expensesName, ' | ', typeof token)
    let tempEmail = '';

    if ('empty' === token) {
        resp.status(401).json({statusCode: 401, message: 'Unauthorized Request Detected.'});
        return;
    }

    if ('empty' === expensesName) {
        resp.status(401).json({statusCode: 401, message: 'null Expenses name.'});
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
        ExpensesSchema.deleteOne({
            userEmail: tempEmail,
            expensesName: expensesName
        }).then(value => {
            console.log('value : ', value);
            resp.status(500).json({
                message: 'Expenses delete success.',
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

// get all Expenses for specific id customer
const getAllExpenses = async (req, resp) => {
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
        ExpensesSchema.find({userEmail: tempMail}).then(result => {
            resp.status(200).json({
                statusCode: 200,
                message: 'all expenses For this user',
                dataSet: result
            });
        })
    }).catch(reason => {
        console.log(reason);
        resp.status(401).json({statusCode: 400, message: 'Unauthorized Request Detected.'});
    });

}

module.exports = {
    addExpenses,
    getAllExpenses,
    updateExpenses,
    deleteExpenses
}
