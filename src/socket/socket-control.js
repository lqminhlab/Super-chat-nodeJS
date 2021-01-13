const state = {
    normal: 0,
    watting: 1
}

class SocketControl {
    constructor(socket){
        this.socket = socket;
        this.onNewMessage();
    }
    onNewMessage(){
        let self  =this;
        self.socket.on('new_message', (data)=>{
            self.socket.io.roomManager.sendMessage(self.socket, data);
        })
    }
}
module.exports = SocketControl;