
const urlOrigin = window.location.origin;  
const accessToken = Cookies.get('accessToken');

$(document).ready(async function(){

    if(accessToken && accessToken.length != 0){
        getProfile().then((res)=>{
            console.log("Get profile:", res);
            if(res && res.status && res.data){
                userConnect(res.data);
                $(".loader-wrapper").fadeOut("slow");
            }
            else
                window.location.replace(`${urlOrigin}/login`);
        });
    }else{
        window.location.replace(`${urlOrigin}/login`);
    }
});

function userConnect(user){
    $("#user-name").text(user.fullName);
    $('#user-avatar').attr('src', user.avatar);

    //make connection
    let socket = io.connect(urlOrigin, {query:`accessToken=${accessToken}`});
}
