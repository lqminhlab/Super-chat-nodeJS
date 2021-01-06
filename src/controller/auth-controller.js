var path = require('path');
var User = require('../model/user');
var AppUtils = require('../util/app_utils');
const bcrypt = require('bcrypt');

const { body,validationResult } = require('express-validator');
const e = require('express');

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

// Render login form.
exports.login_get = function(req, res, next) {
    res.sendFile(path.join(__dirname, '../../public', 'login.html'));
};

// Handler login form submit
exports.login_post = [
    body('email', 'Địa chỉ email là bắt buộc!').trim().isEmail().normalizeEmail(),
    body('password', 'Mật khẩu chưa chính xác!').trim().isLength({min: 6}).escape(),

    async function(req, res, next) {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Error valid:", errors);
            return res.json(AppUtils.reponseErrorWithValid(errors));
        }
        else{

            var user = await User.findOne({ email: req.body.email }).exec();
            if(!user){
                return res.json(AppUtils.reponseError("Vui lòng đăng ký tài khoản trước khi sử dụng!"));
            }
            const match = await bcrypt.compare(req.body.password, user.passwordHash);
            if(!match){
                return res.json(AppUtils.reponseError("Mật khẩu chưa chín xác!"));
            }

            AppUtils.generateToken(
                {
                    email: user.email
                },
                accessTokenSecret,
                accessTokenLife,
                (error, token)=>{
                    if(error) return res.json(AppUtils.reponseError("Lỗi khi tạo accessToken!"));
                    return res.json(AppUtils.reponseSuccess({user: user, accessToken: token}));
                }
            )
        }
    }
];

// Render register form.
exports.register_get = function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../public', 'register.html'));
};

// Handler register form submit
exports.register_post = [
    body('email', 'Địa chỉ email là bắt buộc!').trim().isEmail().normalizeEmail(),
    body('name', "Tên không thể để trống!").trim().isLength({ min: 1 }).escape(),
    body('pass', 'Mật khẩu chưa chính xác!').trim().isLength({min: 6}).escape(),
    body('re_pass', 'Vui lòng xác nhận lại mật khẩu!').trim().isLength({min: 6}).escape(),

    async function(req, res, next) {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Error valid:", errors);
            res.json(AppUtils.reponseErrorWithValid(errors));
        }
        else{

            var exitUser = await User.findOne({ email: req.body.email }).exec();
            if(exitUser){
                return res.json(AppUtils.reponseError("Địa chỉ email này đã tồn tại!"));
            }
            if(req.body.pass != req.body.re_pass){
                return res.json(AppUtils.reponseError("Vui lòng xác nhận đúng mật khẩu!"));
            }

            var user = new User({
                email: req.body.email,
                fullName: req.body.name,
                active: true,
                role: 'user'
            });
            user.password = req.body.pass;
            user.save(function (err) {
                if (err) { 
                    console.log("Error save user:", err);
                    return res.json(AppUtils.reponseError("Lỗi khi đăng ký tài khoản!"));
                }
                // Successful - redirect to new user record.
                return res.json(AppUtils.reponseSuccess());
            });
        }
    }
];