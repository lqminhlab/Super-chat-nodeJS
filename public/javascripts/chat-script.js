
const urlOrigin = window.location.origin;  
const accessToken = Cookies.get('accessToken');

const conversationsIU = $('#conversations');
const friendsIU = $('#conversations');
const chatFrame = $('#chat-frame');
const inputSearch = $("#input-search");
const btnSearch = $("#btn-search");

//Global variable
let conversations;
let friends;
let currentFriend;
let socket;
let user;

$(document).ready(async function(){

    if(accessToken && accessToken.length != 0){
        getProfile().then((res)=>{
            console.log("Get profile:", res);
            if(res && res.status && res.data){
                user = res.data;
                userConnect();
            }
            else
                window.location.replace(`${urlOrigin}/login`);
        });
    }else{
        window.location.replace(`${urlOrigin}/login`);
    }
});

async function userConnect(){
    $("#user-name").text(user.fullName);
    $('#user-avatar').attr('src', user.avatar);

    //make connection
    socket = io.connect(urlOrigin, {query:`accessToken=${accessToken}`});

    //Listen on verified
    socket.on("new_message", async (data) => {
        console.log("new_message", data);
    });

    //Listen on verified
    socket.on("connect_verified", async (data) => {
        console.log("connect_verified", data);

        try {
            const res = await requestAjax(`${urlOrigin}/api/friends`, 'POST');
            console.log("friends:", res);
            friends = res.data ?? [];
        } catch (e) {
            console.log("Get friends error:", e);
            friends = res.data ?? [];
        }
        try {
            const res = await requestAjax(`${urlOrigin}/api/conversations`, 'POST');
            console.log("conversations:", res);
            conversations = res.data ?? [];
        } catch (e) {
            console.log("Get conversations error:", e);
            conversations = [];
        }

        if(conversations.length != 0){
            conversations.forEach((index)=>{
                conversationsIU.append(conversationHTML(index));
                const _friend = index?.people?.find((index)=>{
                    return index._id != user._id;
                });
                $(`#conversation-${index._id}`).click(()=>openChat(_friend));
            }); 
        }else{
            if(friends.length != 0){

            }else{
                chatFrame.html(emptyConversationHTML());
            }
        }

        $(".loader-wrapper").fadeOut("slow");   
        btnSearch.click(searchFriends);
        $(document).on('keypress',function(e) {
            if(e.which == 13 && inputSearch.is(':focus')) {
                searchFriends();
            }
        });   
    });
}

const sendMessage=  async()=>{
    const msg = $('#input-message').val();
    if(!msg || msg.trim().length == 0) return;
    console.log({
        'msg': msg,
        'type' : 'text',
        'to' : currentFriend._id,
        'isGroup' : false
    });
    socket.emit('new_message', {
        'msg': msg,
        'type' : 'text',
        'to' : currentFriend._id,
        'isGroup' : false
    });
    $('#input-message').val("");
}

const searchFriends = async ()=>{
    conversationsIU.html("");
    try {
        const res = await requestAjax(`${urlOrigin}/api/search-friend`, 'POST', {
            keyword: inputSearch.val()
        });
        console.log("user:", res);
        friends = res.data ?? [];
    } catch (e) {
        console.log("Get user error:", e);
    }
    friends.forEach((friend)=>{
        conversationsIU.append(friendHTML(friend));
        $(`#friend-${friend._id}`).click(()=>{
            $(`#action_menu-${friend._id}`).toggle();
        });
    }); 
}

const startChat = (id)=>{
    $(`#action_menu-${id}`).toggle();
    currentFriend = friends.find((index)=>{
        return index._id == `${id}`;
    });
    chatFrame.html(chatFrameHTML());
    
    $(document).on('keypress',function(e) {
        if(e.which == 13 && $('#input-message').is(':focus')) {
            sendMessage();
        }
    });
    $('#btn-send-message').click(sendMessage);
}

const openChat =(_friend)=>{
    currentFriend = _friend;
    chatFrame.html(chatFrameHTML());
    $(document).on('keypress',function(e) {
        if(e.which == 13 && $('#input-message').is(':focus')) {
            sendMessage();
        }
    });
    $('#btn-send-message').click(sendMessage);
}

const chatFrameHTML = ()=>{
    return `<div class="card-header msg_head">
                <div class="d-flex bd-highlight">
                    <div class="img_cont">
                        <img src="${currentFriend.avatar}" class="rounded-circle user_img">
                        <span class="online_icon"></span>
                    </div>
                    <div class="user_info">
                        <span>${currentFriend.fullName}</span>
                        <p>online</p>
                    </div>
                </div>
            </div>
            <div class="card-body msg_card_body">
            </div>
            <div class="card-footer">
                <div class="input-group">
                    <div class="input-group-append">
                        <span class="input-group-text attach_btn"><i class="fas fa-paperclip"></i></span>
                    </div>
                    <input id="input-message" name="" class="form-control type_msg" placeholder="Type your message..."></input>
                    <div id="btn-send-message" class="input-group-append">
                        <span class="input-group-text send_btn"><i class="fas fa-location-arrow"></i></span>
                    </div>
                </div>
            </div>`;
}

const messageSent = ()=>{
    return `<div class="d-flex justify-content-end mb-4">
                <div class="msg_cotainer_send">
                    Hi Khalid i am good tnx how about you?
                    <span class="msg_time_send">8:55 AM, Today</span>
                </div>
                <div class="img_cont_msg">
                    <div class="dot-spin"></div>
                </div>
            </div>`;
}

const messageRecive = ()=>{
    return `<div class="d-flex justify-content-start mb-4">
                <div class="img_cont_msg">
                    <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
                </div>
                <div class="msg_cotainer">
                    Hi, how are you samim?
                    <span class="msg_time">8:40 AM, Today</span>
                </div>
            </div>`;
}

const friendHTML = (friend)=>{
    return `<li>
                <div id="friend-${friend._id}" class="d-flex bd-highlight">
                    <div class="img_cont">
                        <img src="${friend.avatar}" class="rounded-circle user_img">
                        <span class="online_icon"></span>
                    </div>
                    <div class="user_info">
                        <span>${friend.fullName}</span>
                        <p>online</p>
                    </div>
                </div>
                <div id="action_menu-${friend._id}" class="action_menu">
                    <ul>
                        <li onClick="startChat('${friend._id}')"><i class="fas fa-comment-dots"></i> Start chat</li>
                        <li><i class="fas fa-user-circle"></i> View profile</li>
                        <li><i class="fas fa-users"></i> Add friend</li>
                        <li><i class="fas fa-ban"></i> Block</li>
                    </ul>
                </div>
            </li>`;
}

const conversationHTML = (conversation)=>{
    if(!conversation) return '';
    if(conversation.type == 'normal'){
        const _friend = conversation?.people?.find((index)=>{
            return index._id != user._id;
        });
        const _lastMessage = conversation.last?.msg ?? `${_friend?.fullName} is Online`;
        if(!_friend) return '';
        return `<li>
                    <div id="conversation-${conversation._id}" class="d-flex bd-highlight">
                        <div class="img_cont">
                            <img src="${_friend.avatar}" class="rounded-circle user_img">
                            <span class="online_icon"></span>
                        </div>
                        <div class="user_info">
                            <span>${_friend.fullName}</span>
                            <p>${_lastMessage}</p>
                        </div>
                    </div>
                </li>`;
    }else{

    }
}

const emptyConversationHTML = ()=>{
    return `<div class="p-5">
                <div class="user_info">
                    <span>Find friends and start chatting!</span>
                    <p>1767 Online</p>
                </div>
                <div>
                    <img src="../images/bored.png" style="width: 150px;">
                </div>
            </div>`
};
