
const urlOrigin = window.location.origin;  
const accessToken = Cookies.get('accessToken');

$(document).ready(async function(){

    if(accessToken && accessToken.length != 0){
        getProfile().then((res)=>{
            console.log("Get profile:", res);
            if(res && res.status && res.data){
                userConnect(res.data);
            }
            else
                window.location.replace(`${urlOrigin}/login`);
        });
    }else{
        window.location.replace(`${urlOrigin}/login`);
    }
});

async function userConnect(user){
    $("#user-name").text(user.fullName);
    $('#user-avatar').attr('src', user.avatar);

    //make connection
    let socket = io.connect(urlOrigin, {query:`accessToken=${accessToken}`});

    //Listen on new_message
    socket.on("connect_verified", (data) => {
        console.log("connect_verified", data);
        $(".loader-wrapper").fadeOut("slow");
    });

    try {
        const res = await requestAjax(`${urlOrigin}/api/friends`, 'POST');
        console.log("friends:", res);
         return res;
    } catch (e) {
        console.log("Get friends error:", e);
        return null;
    }
}
