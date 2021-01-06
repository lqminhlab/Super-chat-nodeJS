
async function logged() {
    try {
        const res = await getProfile();
        if(res && res.status && res.data){
            return true;
        }
        else
            return false;
    } catch (e) {
        return false;
    }
}

async function getProfile(){
    try {
        const res = await requestAjax(`${urlOrigin}/api/me`, 'POST');
         return res;
    } catch (e) {
        console.log("Get profile error:", e);
        return null;
    }
}

async function requestAjax(url, type){
    const accessToken = Cookies.get('accessToken');
    return $.ajax({
        url: url,
        headers: { 'x_authorization': accessToken },
        data: {
           format: 'json'
        }, 
        async: true,
        type: type
     })
}