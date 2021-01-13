var Friend = require('../model/friend');
var User = require('../model/user');
var AppUtils = require('../util/app_utils');

const { body,validationResult } = require('express-validator');

// Get friends of user
exports.getFriends = async function(req, res, next) {
    const offset = req.body.offset ?? 0;
    const limit = req.body.limit ?? 10;
    const user = req.user;

    try {
        var friends = await Friend.find({
            people: user.id,
        }).skip(offset).limit(limit);
        
        return res.json(AppUtils.reponseSuccess(friends));
    } catch (e) {
        return res.json(AppUtils.reponseError(e));
    }
};

// Search user in friend list or global
exports.searchFriends = async function (req, res, next) {
    const searchGlobal = req.body.searchGlobal ?? true;
    const keyword = req.body.keyword;
    const offset = req.body.offset ?? 0;
    const limit = req.body.limit ?? 10;
    const user = req.user;

    try {
        if(!searchGlobal || !keyword || keyword.trim().length == 0){
            var friends = await Friend.find({ people: user.id }).toArray();
            var users = await User.find({
                _id: {"$in" : friends}, fullName: { $regex: '.*' + keyword + '.*', $options: 'i' }
            }).skip(offset).limit(limit);
            
            return res.json(AppUtils.reponseSuccess(users)); 
        }else{
            var users = await User.find({fullName: { $regex: '.*' + keyword + '.*', $options: 'i' }
            }).skip(offset).limit(limit);
            
            return res.json(AppUtils.reponseSuccess(users)); 
        }
    } catch (e) {
        return res.json(AppUtils.reponseError(e));
    }
};