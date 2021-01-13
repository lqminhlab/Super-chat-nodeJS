const AppUtils = require("../util/app_utils");
var Conversation = require("../model/conversation");

exports.getConversations = async (req, res, next)=>{
    const offset = req.body.offset ?? 0;
    const limit = req.body.limit ?? 10;
    const user = req.user;

    try {
        var conversations = await Conversation.find({
            people: user.id,
        }).populate('people').skip(offset).limit(limit);
        
        return res.json(AppUtils.reponseSuccess(conversations));
    } catch (e) {
        return res.json(AppUtils.reponseError(e));
    }
}