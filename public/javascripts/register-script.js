
$(document).ready(function(){
    const url = window.location.href; 
    const urlOrigin = window.location.origin;   
    //Loading form
    $('.main').hide();
    setTimeout(()=>$(".loader-wrapper").fadeOut("slow", ()=>{
        $('.main').show();
    }), 500);

    //Register action
    $("#signup").click(()=>{
        var validator = $("#register-form").validate();
        if(validator.element("#name") && validator.element( "#email" ) 
            && validator.element( "#pass" ) && validator.element( "#re_pass" ) 
            && $('#agree-term').is(":checked"))
        {
            const params = {
                "email" : $("#email").val(),
                "name" : $("#name").val(),
                "pass" : $("#pass").val(),
                "re_pass" : $("#re_pass").val() 
            }
            $('.main').hide();
            $(".loader-wrapper").fadeIn("fast", ()=>{
                $.post(`${urlOrigin}/api/register`, params, (data, status)=>{
                    console.log("DATA:", data);
                    setTimeout(()=>{
                        if(data.status){
                            window.location.replace(`${urlOrigin}/login`);
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
        else alert("You need agree all statements in Terms of service!");
    });
});