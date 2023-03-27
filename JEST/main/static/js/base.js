email_g = '';

async function createAsyncPOSTRequest(url, csrftoken, bodyDict){
    return new Promise((resolve, reject) => {
        fetch(url, {method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken':csrftoken
        }, body:JSON.stringify(bodyDict)}).then(response=>{
          if(response.status==200){
            data = response.json();
            return resolve(data);
          } else {
            return reject(response.status);
          }
        }
        )
        });
    }

async function createAsyncGETRequest(url){
    return new Promise((resolve, reject) => {
      fetch(url).then(response=>{
        if(response.status==200){
          data = response.json();
          return resolve(data);
        } else {
          return reject(response.status);
        }
      }
      )
      });
}

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

async function search(product){
    product = product.replace(/ /g, '+');
    console.log(product);
    window.location.href = `/catalog?title=${product}`

}

function isValid(email){
    email_pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return email.match(email_pattern);
}

function showPopupError(text, parentWindowId){
    parent = document.getElementById(parentWindowId);
    error_span = parent.querySelector('.popup-error');
    error_span.style="";
    error_span.innerHTML = text;
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
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    setTimeout(()=>window_html.style.opacity = 1, 10);
}

function hideLoginWindow(event, elem){
    event.preventDefault();
    if(event.target.id=="login-window"){
        document.body.style = '';
        elem.style.opacity = 0;
        setTimeout(()=>elem.style.display='none', 300)
    };
}

function changeToCodeEnter(){
    email = document.getElementById('mail-input').value;
    if(isValid(email)){
        email_g = email;
        createAsyncPOSTRequest('sendmail', getCookie('csrftoken'), {'email':email});
        mail_enter = document.getElementById('mail-enter');
        mail_enter.style.display = 'none';
        code_enter = document.getElementById('code-enter')
        code_enter.style = '';
    } else {
        showPopupError('Неверно введен email', 'mail-enter');
    }
}

async function activatCodeInput(elem){
    /* АКТИВИРУЙТЕ ПОЛЕТ! */
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

function try_enter(){
    email = email_g;
    codeinputs = document.getElementById('code-inputs');
    code = '';
    for(zi = 0; zi<codeinputs.children.length; zi++){
        code+=codeinputs.children[zi].value;
    }
    response = createAsyncPOSTRequest('login', getCookie('csrftoken'), {'email':email, 'code':code});
    
}