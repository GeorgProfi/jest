function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function showMobileMenu(elem){
    elem.setAttribute('onclick', 'hideMobileMenu(this)');
    elem.className = "nav-mob-icon is-clicked";
    mob_menu = document.getElementById('nav-mob-links');
    mob_menu.style = "opacity:0";
    setTimeout(()=>{mob_menu.style = "opacity:1";}, 10);

}

function hideMobileMenu(elem){
    elem.className = "nav-mob-icon";
    elem.setAttribute('onclick', 'showMobileMenu(this)');
    mob_menu = document.getElementById('nav-mob-links');
    mob_menu.style = "opacity:0";
    setTimeout(()=>{mob_menu.style = "display:none";}, 300);
}

function showLoginWindow(){
    window_html = document.getElementById('login-window');
    window_html.style = 'opacity:0';
    setTimeout(()=>window_html.style.opacity = 1, 10);
}

function hideLoginWindow(event, elem){
    event.preventDefault();
    if(event.target.id=="login-window"){;
        elem.style.opacity = 0;
        setTimeout(()=>elem.style.display='none', 300)
    };
}

function changeToCodeEnter(){
    mail_enter = document.getElementById('mail-enter');
    mail_enter.style.display = 'none';
    code_enter = document.getElementById('code-enter')
    code_enter.style = '';
}

async function activatCodeInput(elem){
    /* АКТИВИРУЙТЕ ПОЛЕТ! */
    console.log(elem.value);
    if(elem.value.length==1){
        elem.className = 'active';
    } else {
        elem.className = '';
    }
}

function accoutEventHandler(){
    uuid = getCookie('UUID');
    if (uuid != null){
        /*TODO: Редирект в личный кабинет */
    } else {
        showLoginWindow();
    }
}