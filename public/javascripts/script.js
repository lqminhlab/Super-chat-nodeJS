$(document).ready(function(){
    $(".login-wrapper").hide();
    setTimeout(()=>$(".loader-wrapper").fadeOut("slow"), 1000);
    setTimeout(()=>{
        $(".body-chat").fadeOut("slow", ()=>$(".login-wrapper").fadeIn("slow"));
    }, 3000);
});
