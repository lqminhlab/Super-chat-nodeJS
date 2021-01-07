require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoDB = require('./src/database/mongo_db');
var http = require('http');
var AppUtils = require('./src/util/app_utils');
var User = require('./src/model/user');

var webRouter = require('./src/routes/index');
var apiRouter = require('./src/routes/api');

var app = express();
var server = http.createServer(app);

const io = require('socket.io')(server);
io.on('connection', client => { 
    verifyTokenSocket(client);
    client.on("disconnect", () => {
        console.log(`On Disconnect: ${client.userInfo.fullName}`);
    })
});
server.listen(process.env.PORT || '3000');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', webRouter);
app.use('/api', apiRouter);

async function verifyTokenSocket(socket) {
    let accessToken = socket.handshake.query.accessToken;
    if (accessToken) {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const verified = await AppUtils.verifyToken(accessToken, accessTokenSecret);
        if (!verified) {
            socket.disconnect();
        }
        const user = await User.findOne({email: verified.payload.email});
        console.log(`On Connect: ${user.fullName}`);
        //Khởi tạo function tìm socket bằng user id
        socket.getSocketByUserID = (id) => {
            let allSockets = io.sockets.sockets
            let otherSocket = null
            if (allSockets) {
                otherSocket = Object.values(allSockets).find((s) => {
                    if (s && s.userInfo && s.userInfo.id && s.userInfo.id == id) {
                        return s
                    }
                })
            }
            return otherSocket
        }

        //Kiểm tra nếu có login ở thiết bị khác thì disconnect
        let otherSocket = socket.getSocketByUserID(user.id)
        if (otherSocket) {
            otherSocket.disconnect();
        }

        //-----------------------------------------------------
        //Login thành công khởi tạo các control
        socket.userInfo = user;
        socket.emit('connect_verified', user);
        // socket.tokenInfo = normalToken.decodeToken(accessToken)
        // initSocketControl(socket)
        // initChallengeFindTheSame(socket)
        // //initChallengeGuessWord(socket)
        // initCombineSocketControl(socket)
        // socket.emit('ConnectManager', resultData)

    } else {
        socket.disconnect();
    }
}

module.exports = app;
