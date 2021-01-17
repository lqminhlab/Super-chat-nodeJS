
const loginHandler = async(accessToken, type)=>{
    console.log("accessToken", accessToken);
    let _url;
    switch (type) {
        case "google":
            _url = `${urlOrigin}/api/loginGoogle`;
            break;
        case "facebook":
            _url = `${urlOrigin}/api/loginFacebook`;
            break;
    }
    const remember = true;
    const params = {
        "accessToken": accessToken
    }
    $('.main').hide();
    $(".loader-wrapper").fadeIn("fast", ()=>{
        $.post(_url, params, (res, status)=>{
            console.log("DATA:", res);
            setTimeout(()=>{
                if(res.status){
                    if(remember) Cookies.set('accessToken', res.data.accessToken, { expires: 30 });
                    window.location.replace(`${urlOrigin}`);
                }else{
                    $(".loader-wrapper").fadeOut("fast", ()=>{
                        $('#msg-error').text(res.msg);
                        $('.main').fadeIn();
                    });
                }
            }, 500);
        }).catch((e)=>{
            $(".loader-wrapper").fadeOut("fast", ()=>{
                $('.main').fadeIn("false", ()=>{
                    alert(`Lỗi khi đăng nhập ${type}`);
                });
            });
        });
    })
}

//Google=======================
// <script src="https://apis.google.com/js/api:client.js"></script> <---Add to head page

var googleUser = {};
var startApp = function() {
  gapi.load('auth2', function(){
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
      client_id: '63042178852-gldl7j0hos9rdt023kdh62hs6u3jpkpp.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      // Request scopes in addition to 'profile' and 'email'
      scope: 'profile email'
    });
    attachSignin(document.getElementById('btn-signin-gg'));
  });
};

function attachSignin(element) {
  auth2.attachClickHandler(element, {},
        function(googleUser) {
            const accessToken = googleUser.Bc.access_token;
            loginHandler(accessToken, "google");
        }, function(error) {
            alert(JSON.stringify(error, undefined, 2));
        }
    );
}

startApp();

//Facebook=======================

window.fbAsyncInit = function() {
    FB.init({
    appId      : '1317813788585587',
    cookie     : true,
    xfbml      : true,
    version    : 'v9.0'
    });
    
    FB.AppEvents.logPageView();   
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function loginFacebook(){
    FB.getLoginStatus(function(r){
        if(r.status === 'connected'){
            console.log(r);
        }else{
            FB.login(function(response) {
                console.log(response);
                if(response.authResponse) {
                    const accessToken = response.authResponse.accessToken;
                    loginHandler(accessToken, "facebook");
                } else {
                    // user is not logged in
                }
            },{scope:'email'}); // which data to access from user profile
        }
    });
}   