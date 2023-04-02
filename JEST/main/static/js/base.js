email_g = '';
numerics = [1, 2, 3, 4, 5, 6, 7, 8, 9 ,0];
there_is_error = false;
 
addEventListener('resize', ()=>hideSearchInput());

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

async function closeVisibleEvent(elem){
    elem.style="opacity:0";
    setTimeout(()=>{elem.remove()}, 300);
}

async function addVisibleEvent(successful, text){
    event_pool = document.getElementById('event-pool');
    var eventItSelf = document.createElement('div');
    eventItSelf.style="opacity:0";
    eventItSelf.className = 'visible-event flex-row ';
    eventItSelf.className += (successful==true)?'successful':'unsuccessful';
    eventText = document.createElement('span');
    eventText.innerHTML = text;
    eventText.className = 'visible-event-text';
    eventItSelf.appendChild(eventText);
    closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.addEventListener('click', ()=>{closeVisibleEvent(eventItSelf)});
    eventItSelf.appendChild(closeButton);

    event_pool.appendChild(eventItSelf);
    eventItSelf.style="opacity:1";
    setTimeout(()=>{closeVisibleEvent(eventItSelf)}, 5000);
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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


async function showSearchInput(){
    searchInput = document.getElementById('search-input');
    searchBox = document.getElementById('searchbox');
    lupaIcon = document.getElementById('lupa-icon');
    if(window.innerWidth<=1390){
        links_width = document.getElementById('nav-links').offsetWidth;
        if(links_width){
            gap = parseInt(window.getComputedStyle(document.getElementById('nav-right-side'), null).getPropertyValue('column-gap'));
        } else {
            gap = parseInt(window.getComputedStyle(document.getElementById('header-content'), null).getPropertyValue('column-gap')) - 10;
        }
        searchInput.style = "display:block; width:0px; padding:0px";
        lupaIcon.setAttribute('onclick', '');
        setTimeout(()=>{searchInput.style = `display:block;width:${links_width+gap}px; `; searchBox.style=`margin-left:-${links_width+gap}px`; lupaIcon.setAttribute('onclick', 'hideSearchInput();')}, 10);
        
    } else {
        searchBox.style="";
        setTimeout(()=>searchInput.style = "opacity:1; display:block;", 10);
        searchBox.style="";
    }
}

async function hideSearchInput(){
    searchInput = document.getElementById('search-input');
    lupaIcon = document.getElementById('lupa-icon');
    searchBox = document.getElementById('searchbox');
    if(window.innerWidth<=1390){
        lupaIcon.setAttribute('onclick', '')
        searchInput.style = "display:block; width:0px; padding:0px";
        searchBox.style="";
        setTimeout(()=>{searchInput.style = '';lupaIcon.setAttribute('onclick', 'showSearchInput();')}, 300);
    } else {
        searchInput.style = "opacity:1";
        searchBox.style="";
        lupaIcon.setAttribute('onclick', 'showSearchInput();')
    }
};

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
    if(numerics.includes(Number(elem.value))&&elem.value.length>0){
        elem.className = 'active';
    } else {
        if(elem.value.length<=0){
            elem.className = '';
        } else{
        elem.className = 'error';
        showPopupError('Ошибка в поле для ввода','code-enter');
    }
    }
}

function accountEventHandler(){
    us = getCookie('us');
    if (us != null){
        window.location='/account';
    } else {
        showLoginWindow();
    }
}

function autotab(original,destination){
    if (original.getAttribute&&original.value.length==original.getAttribute("maxlength"))
    destination.focus()
}

function autopaste(event, elem){
    evt = new Event('change');
    siblings_count = 1;
    pasteValue = (event.clipboardData || window.clipboardData).getData("text");
    elem.value = pasteValue[0];
    current_elem = elem.nextElementSibling;
    elem.dispatchEvent(evt);
    while(current_elem){
        current_elem.value = pasteValue[siblings_count];
        siblings_count+=1;
        current_elem.dispatchEvent(evt);
        current_elem = current_elem.nextElementSibling;
    }
}

async function try_enter(){
    email = email_g;
    codeinputs = document.getElementById('code-inputs');
    code = '';
    for(zi = 0; zi<codeinputs.children.length; zi++){
        code+=codeinputs.children[zi].value;
    }
    response = await createAsyncPOSTRequest('login', getCookie('csrftoken'), {'email':email, 'code':code});
    if(response['code']==200){
        setCookie('us', response['us'], 1490);
        window.location='/account';
    } else {
        showPopupError('Неверно введён код', 'code-enter')
    }
    
}