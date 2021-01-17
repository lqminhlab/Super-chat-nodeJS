var path = require('path');
var User = require('../model/user');
var Provider = require('../model/provider');
var AppUtils = require('../util/app_utils');
const bcrypt = require('bcrypt');
const axios = require('axios');

const { body,validationResult } = require('express-validator');
const { response } = require('express');

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

            const avatar = process.env.AVATAR_DEFAUT;

            var user = new User({
                email: req.body.email,
                fullName: req.body.name,
                avatar: avatar,
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

// Handler request get profile by token
exports.me_post = async function(req, res, next) {
    var user = req.user;
    if(user) return res.json(AppUtils.reponseSuccess(user));
    else return res.json(AppUtils.reponseError("Tài khoản không xác định!"));
};

// Handler login social google
// {
//     sub: '102221120825271417104',
//     name: 'Minh Minh',
//     given_name: 'Minh',
//     family_name: 'Minh',
//     picture: 'https://lh3.googleusercontent.com/a-/AOh14Gj_2qLK_uT3X28qmY6fxXVf3OlResXmznxNFth-Aw=s96-c',
//     email: 'minhminh9201@gmail.com',
//     email_verified: true,
//     locale: 'vi'
// } 
exports.login_google_post = [
    body('accessToken', 'AccessToken không thể để trống!').trim().isLength({min: 1}).escape(),

    async function(req, res, next) {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json(AppUtils.reponseErrorWithValid(errors));
        }
        else{
            axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  'Authorization': `Bearer ${req.body.accessToken}` 
                }
            })
            .then(async function (response) {
                console.log("Get google profile data:", response.data); 
                if(response.data.error){
                    return res.json(AppUtils.reponseError("Lỗi khi truy xuất thông tin người dùng!"));
                }
                const email = response.data.email
                const providerID = response.data.sub;
                const name = response.data.name;
                const avatar = response.data.picture;
                var user = (await Provider.findOne({provider_id : providerID, provider: "google"}).populate('user').exec())?.user;
;                if(!user){
                    try {
                        user = new User({
                            email: email ?? `${providerID}@google.com`,
                            fullName: name,
                            avatar: avatar ?? process.env.AVATAR_DEFAUT,
                            passwordHash: providerID,
                            active: true,
                            role: 'user'
                        });
                        await user.save();
                        const providerUser = new Provider({
                            provider: "google",
                            provider_id : providerID,
                            user: user.id
                        });
                        await providerUser.save();
                    } catch (e) {
                        console.log("ERR: ", e);
                        res.json(AppUtils.reponseError("Lỗi khi lưu dữ liệu!"));
                    }
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
            })
            .catch(function (error) {
                console.log("Request google profile: ", error);
                return res.json(AppUtils.reponseError("Lỗi khi truy xuất thông tin người dùng!"));
            });
        }
    }
];

// Handler login social facebook 
exports.login_facebook_post = [
    body('accessToken', 'AccessToken không thể để trống!').trim().isLength({min: 1}).escape(),

    async function(req, res, next) {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json(AppUtils.reponseErrorWithValid(errors));
        }
        else{
            axios.post('https://graph.facebook.com/me', {
                fields: "id,name,email,picture,birthday,gender",
                access_token: req.body.accessToken
            })
            .then(async function (response) {
                console.log("Get facebook profile data:", response.data); 
                if(response.data.error){
                    return res.json(AppUtils.reponseError("Lỗi khi truy xuất thông tin người dùng!"));
                }
                const email = response.data.email
                const providerID = response.data.id;
                const name = response.data.name;
                const avatar = response.data.picture?.data?.url;
                var user = (await Provider.findOne({provider_id : providerID, provider: "facebook"}).populate('user').exec())?.user;
                if(!user){
                    try {
                        user = new User({
                            email: email ?? `${providerID}@facebook.com`,
                            fullName: name,
                            avatar: avatar ?? process.env.AVATAR_DEFAUT,
                            passwordHash: providerID,
                            active: true,
                            role: 'user'
                        });
                        await user.save();
                        const providerUser = new Provider({
                            provider: "facebook",
                            provider_id : providerID,
                            user: user.id
                        });
                        await providerUser.save();
                    } catch (e) {
                        console.log("ERR: ", e);
                        res.json(AppUtils.reponseError("Lỗi khi lưu dữ liệu!"));
                    }
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
            })
            .catch(function (error) {
                console.log("Request facebook me: ", error.message);
                return res.json(AppUtils.reponseError("Lỗi khi truy xuất thông tin người dùng!"));
            });
        }
    }
];