const Message = require('../model/message');
const Conversation = require("../model/conversation");
const conversation = require('../model/conversation');

class RoomManager {
    constructor(io) {
        this.io = io;
        this.allRooms = [];
    }
    async sendMessage(socket, data) {
        console.log("SendMessage:", data);
        if(data.to){
            try {
                let conversation;
                let message;
    
                if(data.isGroup){
                    conversation = await Conversation.findById(data.to).exec();
                }else{
                    conversation = await Conversation.findOne({
                        type : 'normal',
                        people : [socket.userInfo.id, data.to]
                    }).exec();
                }
    
                if(!conversation){
                    conversation = new Conversation({
                        name: "Normal chat",
                        type: 'normal',
                        people: [socket.userInfo.id, data.to],
                        creator: socket.userInfo.id,
                    });
                    await conversation.save();
                }
    
                if(data.type == 'text'){
                    message = new Message({
                        msg: data.msg,
                        date: new Date(),
                        sender: socket.userInfo.id,
                        sent: conversation.id
                    });
                    await message.save();
                }
                socket.emit("new_message", message);
                conversation.updateOne({last : message.id});

            } catch (e) {
                console.log("Error send message:", e);
            }
        }
    }
}
module.exports = RoomManager;