
$(document).ready(function(){
    const url = window.location.href; 
    const urlOrigin = window.location.origin;  

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
                $.post(`${url}`, params, (data, status)=>{
                    console.log("DATA:", data);
                    setTimeout(()=>{
                        if(data.status){
                            $(".loader-wrapper").fadeOut("fast", ()=>{
                                $('#msg-error').text(data.msg);
                                $('.main').fadeIn();
                            });
                        }else{
                            $(".loader-wrapper").fadeOut("fast", ()=>{
                                $('#msg-error').text(data.msg);
                                $('.main').fadeIn();
                            });
                        }
                    }, 500);
                });
            })
        }
    });
});