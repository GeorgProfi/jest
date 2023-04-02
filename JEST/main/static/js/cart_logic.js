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

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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

async function addToCart(id, size, count){
    cart = JSON.parse(getCookie('cart'));
    idsize = String(id)+ '$' +String(size);
    if(cart!=null){
      if(cart[idsize]!=undefined){
        sum = Number(cart[idsize]) + Number(count);
        if(sum>0){
          cart[idsize] = Number(cart[idsize]) + Number(count);
        } else {
          deleteFromCart(id, size);
        }
      } else {
        cart[idsize] = count;
      }
    } else {
      cart = {};
      cart[idsize] = count;
    }
  setCookie('cart', JSON.stringify(cart), 4);
  addVisibleEvent(true, 'Товар успешно добавлен в коризну!');
}

async function deleteFromCart(id, size){
  cart = JSON.parse(getCookie('cart'));
  idsize = String(id)+ '$' +String(size);
  if(cart!=null){
    delete cart[idsize];
  }else{
    console.log('ok')
  }
  setCookie('cart', JSON.stringify(cart), 4);
}