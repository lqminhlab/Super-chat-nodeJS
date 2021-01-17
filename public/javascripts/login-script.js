
const url = window.location.href; 
const urlOrigin = window.location.origin;  

$(document).ready(function(){
    //Loading form
    $('.main').hide();
    setTimeout(()=>$(".loader-wrapper").fadeOut("slow", ()=>{
        $('.main').show();
    }), 500);

    //Register action
    $("#signin").click(()=>{
        var validator = $("#login-form").validate();
        if(validator.element("#email") && validator.element( "#password" ))
        {
            const remember = $('#remember-me').is(':checked')
            const params = {
                "email" : $("#email").val(),
                "password" : $("#password").val()
            }
            $('.main').hide();
            $(".loader-wrapper").fadeIn("fast", ()=>{
                $.post(`${urlOrigin}/api/login`, params, (res, status)=>{
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
                });
            })
        }
    });
});