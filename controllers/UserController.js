const UserSchema = require('../model/UserSchema');
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const registerUser = async (req, resp) => {
    console.log("user post method");
    console.log(req.body);
    console.log(req.body.email);
    UserSchema.findOne({email: req.body.email}, (error, result) => {
        if (error) {
            resp.status(500).json({message: error});
        } else {
            if (result !== null) {
                let data = {
                    message: 'email address is exists !',
                    state: false
                }
                resp.status(400).json({data});
            } else {
                //------------------------------------------------------


                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (error, hash) {
                        const user = new UserSchema({
                            nicNumber: req.body.nicNumber,
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                            regDate: req.body.regDate,
                            regTime: req.body.regTime,
                            userState: req.body.userState,
                        });
                        user.save().then(savedResponse => {
                            console.log('saved Response : ', savedResponse);

                            const token = jwt.sign({
                                email: req.body.email,
                                password: req.body.password
                            }, process.env.JWT_AUTH, {expiresIn: '24h'});


                            let transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 587,
                                secure: false,
                                requireTLS: true,
                                auth: {
                                    user: process.env.EMAIL,
                                    pass: process.env.PASSWORD
                                }
                            });

                            let mailOption = {
                                /* from:'"Robotikka 👻"<noreply.prosess.env.EMAIL>'*/
                                from: '"MyWallet"<no-reply@mywallet.com>',
                                to: req.body.email,
                                subject: 'Thank you for joining with MyWallet',
                                html: `
                                <html>
                                    <body>
                                        <p>
                                        Hey ${req.body.username},<br><br>

                                        I’m lucifer, the founder of MyWallet and I’d like to personally thank you for signing up to our service. <br><br>
                                        
                                        We established MyWallet in order to make your economy uprising. <br><br>
                                        
                                        I’d love to hear what you think of MyWallet and if there is anything we can improve. 
                                        If you have any questions, please reply to this email. I’m always happy to help! <br><br>
                                        
                                        ${req.body.username}
                                        
                                        </p>
                                    </body>
                                </html>
                                `
                            }

                            transporter.sendMail(mailOption, (emailError, emailInfo) => {
                                if (emailError) {
                                    resp.status(500).json({
                                        message: 'internal Server Error.',
                                        state: false,
                                        error: emailError
                                    });
                                    return;
                                }

                                let dataObj = {
                                    statusCode: 200,
                                    message: 'Success.',
                                    token: token,
                                    user: req.body.email,
                                    state: true
                                }

                                resp.status(200).json({dataObj});

                            })

                            // let dataObj = {
                            //     statusCode: 200,
                            //     message: 'Success.',
                            //     token: token,
                            //     user: req.body.email,
                            //     state: true
                            // }
                            // resp.status(200).json({dataObj});

                        }).catch(savedResponseError => {
                            resp.status(500).json({
                                statusCode: 500,
                                message: 'internal Server Error.',
                                state: false,
                                error: savedResponseError
                            })
                        })

                    })
                })
                //------------------------------------------------------
            }
        }
    })
};

const login = async (req, resp) => {
    const email = req.headers.email ? req.headers.email : null;
    const password = req.headers.password ? req.headers.password : null;
    console.log('email : ' + email)
    console.log('password : ' + password)
    try {
        if (email !== null && password !== null) {
            console.log('not null')
            UserSchema.findOne({email: email, userState: true}, (error, result) => {
                if (result !== null) {
                    console.log('result ', result)
                    bcrypt.compare(password, result.password, function (err, finalOutPut) {
                        if (err) {
                            resp.status(500).json(err);
                        }
                        if (finalOutPut) {
                            const token = jwt.sign({
                                email: email,
                                password: password
                            }, process.env.JWT_AUTH, {expiresIn: '24h'});
                            resp.status(200).json({
                                statusCode: 200,
                                message: 'success',
                                token: token,
                                user: req.headers.email,
                                state: true
                            });
                        } else {
                            console.log('password wrong')
                            resp.status(400).json({statusCode: 400, message: 'wrong password..'});
                        }
                    })
                } else {
                    console.log('no results')
                    resp.status(400).json({statusCode: 400, message: 'please register..'});
                }
            })
        } else {
            resp.status(400).json({statusCode: 400, message: 'Please provide valid user name and password'});
        }

    } catch (e) {
        resp.status(500).json({statusCode: 500, message: 'internal Server Error..', error: e});
    }
};

module.exports = {
    registerUser,
    login
}
