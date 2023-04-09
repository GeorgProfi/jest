window.addEventListener("dragover",function(e){
    e = e || event;
    e.preventDefault();
  },false);
  window.addEventListener("drop",function(e){
    e = e || event;
    e.preventDefault();
  },false);
previousFiles = new DataTransfer();
fileBuffer = new DataTransfer();
commentary = '';

  fileInput = document.getElementById('files');
fileInput.addEventListener('change', ()=>{
    checkSession();
    fileBuffer.items.clear()
    var delete_files = false;
    var current_size = 0
    max_size = 20971520
    for (var i = 0; i<fileInput.files.length; i++){
        file = fileInput.files[i];
        current_size += file.size;
        if(i<5){
            fileBuffer.items.add(file);
        }
        if (current_size>max_size){
            alert('Суммарный вес файлов больше 20 мб!')
            delete_files = true;
            break;
        }
    }
    if (delete_files){
        fileInput.files = previousFiles.files;
    } else {
        fileInput.files = fileBuffer.files;
    }
    refreshListOfFiles();
})

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

async function createAsyncPOSTRequest(url, csrftoken, bodyDict){
    return new Promise((resolve, reject) => {
        fetch(url, {method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken':csrftoken
        }, body:bodyDict}).then(response=>{
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

const isModifierKey = (event) => {
    const key = event.keyCode;
    return (event.shiftKey === true || key === 35 || key === 36) ||
        (key === 8 || key === 9 || key === 13 || key === 46) ||
        (key > 36 && key < 41) || 
        (
            (event.ctrlKey === true || event.metaKey === true) &&
            (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
        )
};

const enforceFormat = (event) => {
    if(!isNumericInput(event) && !isModifierKey(event)){
        event.preventDefault();
    }
};

const formatToPhone = (event) => {
    if(isModifierKey(event)) {return;}

    const input = event.target.value.replace(/\D/g,'').substring(0,12);
    const countryCode = input.substring(0, 1);
    const areaCode = input.substring(1, 4);
    const firstPart = input.substring(4, 7);
    const secondPart = input.substring(7, 9);
    const thirdPart = input.substring(9, 11);
    if(input.length >8){event.target.value = `${countryCode}(${areaCode})${firstPart}-${secondPart}-${thirdPart}`;}
    else if(input.length>6){event.target.value = `${countryCode}(${areaCode})${firstPart}-${secondPart}`;}
    else if(input.length>4){event.target.value = `${countryCode}(${areaCode})${firstPart}`;}
    else if(input.length>0){event.target.value = `${countryCode}(${areaCode}`;}
};


async function cancelChanges(){
    fileInput = document.getElementById('files');
    fileInput.files = previousFiles.files;
    refreshListOfFiles();
}

async function commitChanges(){
    checkSession();
    fileInput = document.getElementById('files');
    previousFiles.items.clear();
    for (var i = 0; i<fileInput.files.length; i++){
        previousFiles.items.add(fileInput.files[i]);
    }
    refreshListOfFiles();
}



async function refreshListOfFiles(){
    fileInput = document.getElementById('files');
    fileNames = document.getElementById('filenames');
    files_container_popup = document.getElementById('files-inner-container');
    files_container_popup.innerHTML = " ";
    fileNames.innerHTML = " ";
    for(var i = 0; i<fileInput.files.length; i++){
        file = fileInput.files[i];
        fileName = document.createElement('span');
        fileName.className = 'subheader-text';
        fileName.innerHTML = file['name'];
        fileNames.appendChild(fileName);
    }
    for(var i = 0; i<fileInput.files.length; i++){
        file = fileInput.files[i];
        fileName = document.createElement('span');
        fileName.className = 'subheader-text';
        fileName.innerHTML = file['name'];
        files_container_popup.appendChild(fileName);
    }
}

async function dropHandler(ev){
    checkSession();
    ev.preventDefault();
    const dT = new DataTransfer();
    if (ev.dataTransfer.items) {
        
        [...ev.dataTransfer.items].forEach((item, i) => {
          if (item.kind === "file") {
            const file = item.getAsFile();
            dT.items.add(file);
          }
        });
      } else {
        [...ev.dataTransfer.files].forEach((file, i) => {
            dT.items.add(file);
        });
    }
    fileInput = document.getElementById('files');
    fileInput.files = dT.files;
    evt = new Event('change');
    fileInput.dispatchEvent(evt);
}

async function dragOverHandler(ev){
    ev.preventDefault();
}

async function recalculateAndSetSumm(){
    products = product_html = document.getElementById('products').children;
    total_summ = 0;
    summ_skidka = 0;
    total_count = 0;
    for(zzzi = 0; zzzi<products.length; zzzi++){
        price = Number(products[zzzi].children[1].innerHTML.replace('₽', '').replaceAll('&nbsp;', ''));
        count = Number(products[zzzi].children[3].children[1].innerHTML);
        total_summ +=  price*count;
        total_count += count;
    }
    products_count = document.getElementById('count-of-prods');
    products_count.innerHTML = `Товары (${total_count})`
    products_summ = document.getElementById('sum-of-prods');
    products_summ.innerHTML = total_summ.toLocaleString('ru-RU')+'₽';
    sum_itself = document.getElementById('sum-itself');
    sum_itself.innerHTML = (total_summ - summ_skidka).toLocaleString('ru-RU')+'₽';
}

function is_visible(e) {return e.offsetWidth > 0 || e.offsetHeight > 0;}

async function createCartEmptyCard(){
    product_html = document.getElementById('products');
    text = document.createElement('h2');
    text.innerHTML = 'Корзина пуста!'
    product_html.appendChild(text);
    productCard = document.createElement('div');
    productCard.className = 'product-card flex-row';
    productCard.style.opacity = 0;
    product_html.appendChild(productCard);
    right_side = document.getElementById('right-side');
    right_side.remove();
}

async function checkIfEmpty(){
    products_html = document.getElementById('products');
    ind_order = document.getElementById('owns')
    if(products_html.children.length==0&& !is_visible(ind_order)){
        createCartEmptyCard();
    }
}

async function deleteCard(called_elem){
    if(called_elem!=null){
    while(called_elem.parentNode != null){
        if (called_elem.className == 'product-card flex-row'){
            called_elem.remove();
            break;
        }
        called_elem = called_elem.parentNode;
    }
}
}

async function setCount(id, size, elem){
    idsize = String(id)+ '$' +String(size);
    cart = JSON.parse(getCookie('cart'));
    if(cart[idsize]!=undefined){
        elem.innerHTML = cart[idsize]
    } else {
       deleteCard(elem);
       checkIfEmpty();
    }
    recalculateAndSetSumm();
}

async function hideIndProd(){
    own_order = document.getElementById('owns');
    own_order.innerHTML = '';
    owns_html = document.getElementById('own-order');
    owns_html.style="display:none;"
    checkIfEmpty();
}

async function showPopUpWindow(elem_id){
    window_html = document.getElementById(elem_id);
    window_html.style = 'opacity:0';
    document.body.style.overflow = 'hidden';
    setTimeout(()=>window_html.style.opacity = 1, 10);
}

function hidePopUpWindow(event, elem){
    event.preventDefault();
    if(event.target.id==elem.id){
        document.body.style = '';
        elem.style.opacity = 0;
        setTimeout(()=>elem.style.display='none', 300)
    };
}
function hideAddFilesWindowA(){
    window_html = document.getElementById('add-files-window');
    document.body.style = '';
    window_html.style.opacity = 0;
    setTimeout(()=>window_html.style.display='none', 300)
}

async function createCartInfo(){
    cart = JSON.parse(getCookie('cart'));
    cart = (cart==undefined)?{}:cart;
    keys = Object.keys(cart)
    if(keys.length>0){
        product_html = document.getElementById('products');
        productCard = document.createElement('div');
        productCard.className = 'product-card flex-row';
        productCard.style.opacity = 0;
        product_html.appendChild(productCard);
        var emptyData = [];
        var fakeKeys = [];
        for(var z = 1; z<keys.length+1; z++){
            emptyData.push({'id': `-${z}`, 'image': "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=", 'price': 15000, 'title': "Всевидящее око"});
            fakeKeys.push(`-${z}$${z}`);
        }
        createCartCards(emptyData,keys.length, fakeKeys, true);
        var data = await createAsyncGETRequest('/cart-product-info');
        count = data['count'];
        data = JSON.parse(data['data']);
        createCartCards(data, keys.length, keys, false);
        recalculateAndSetSumm();
    } else {
        createCartEmptyCard();
    }
}
async function createCartCards(data, count, cartKeys, isEmpty = 0){
    product_html = document.getElementById('products');
    product_html.innerHTML = "";
    for(jji = 0; jji<count; jji++){
        product = data[jji];
        regexp = new RegExp(`${product['id']}`);
        sizes = cartKeys.filter(key=>key.split('$')[0]==product['id']);
        if(product['id']!=0){
            for(zzi = 0; zzi<sizes.length; zzi++){
                size = sizes[zzi].split('$')[1];

                productCard = document.createElement('div');
                productCard.className = 'product-card flex-row';

                productLinkable = document.createElement('a');
                productLinkable.className = 'product-linkable flex-row';
                if(!isEmpty)productLinkable.setAttribute('href', `/product_page/${product['id']}`);

                productImage = document.createElement('img');
                productImage.className = 'prodcut-image';
                if(isEmpty)productImage.className += " animated-background";
                productImage.setAttribute('src', product['image']);
                productLinkable.appendChild(productImage);

                productTitleID = document.createElement('div');
                productTitleID.className = 'product-titleId flex-column';

                productTitle = document.createElement('span');
                productTitle.className = 'product-title';
                if(isEmpty)productTitle.className += " animated-background";
                productTitle.innerHTML = product['title'];
                productTitleID.appendChild(productTitle);

                productID = document.createElement('span');
                productID.className = 'product-id';
                if(isEmpty)productID.className += " animated-background";
                productID.innerHTML = product['id'];
                productTitleID.appendChild(productID);
                productLinkable.appendChild(productTitleID);
                productCard.appendChild(productLinkable);

                productPrice = document.createElement('span');
                productPrice.className = 'product-price';
                if(isEmpty)productPrice.className += " animated-background";
                productPrice.innerHTML = product['price'].toLocaleString('ru-RU')+'₽';
                productCard.appendChild(productPrice);

                productSize = document.createElement('span');
                productSize.className = 'product-size';
                if(isEmpty)productSize.className += " animated-background";
                productSize.innerHTML = (size>0)?size:'';
                productCard.appendChild(productSize);

                productQuantityControls = document.createElement('div');
                productQuantityControls.className = 'count-controls flex-row';

                productMinusBtn = document.createElement('buttton');
                productMinusBtn.className = 'product-control';
                productMinusBtn.innerHTML = '-';
                if(!isEmpty)productMinusBtn.setAttribute('onclick', `addToCart(${product['id']}, ${size}, -1);setCount(${product['id']}, ${size}, this.parentNode.children[1]), false`);
                productQuantityControls.appendChild(productMinusBtn);

                productQuantity = document.createElement('span');
                productQuantity.className = 'counter';
                if(isEmpty)productQuantity.className += " animated-background";
                productQuantity.innerHTML = cart[sizes[zzi]];
                productQuantityControls.appendChild(productQuantity);

                productPlusBtn = document.createElement('buttton');
                productPlusBtn.className = 'product-control';
                productPlusBtn.innerHTML = '+';
                if(!isEmpty)productPlusBtn.setAttribute('onclick', `addToCart(${product['id']}, ${size}, 1);setCount(${product['id']}, ${size}, this.parentNode.children[1])`);
                productQuantityControls.appendChild(productPlusBtn);
                productCard.appendChild(productQuantityControls);

                productDeleteBtn = document.createElement('buttton');
                productDeleteBtn.className = 'product-delete';
                if(!isEmpty)productDeleteBtn.setAttribute('onclick', `deleteFromCart(${product['id']}, ${size});setCount(${product['id']}, ${size}, this);`);
                productCard.appendChild(productDeleteBtn);

                product_html.appendChild(productCard);
            }
        } else {
            own_order = document.getElementById('own-order');
            own_order.style="";
        }
    }
}

async function createDeliveryTypesOptions(){
    data = await createAsyncGETRequest('/get-delivery-types');
    count = data['count'];
    data = JSON.parse(data['data']);
    types_container = document.getElementById('delivery-type');
    for(var i = 0; i<count; i++){
        option = data[i];
        var option_html = document.createElement('option');
        option_html.className = 'popup-personal-data';
        option_html.innerHTML = option['delivery_type'];
        option_html.setAttribute('value', option['id']);
        types_container.appendChild(option_html);
    }
}

async function createPaymentTypesOptions(){
    data = await createAsyncGETRequest('/get-payment-methods');
    count = data['count'];
    data = JSON.parse(data['data']);
    types_container = document.getElementById('payment-type');
    for(var i = 0; i<count; i++){
        option = data[i];

        var option_html = document.createElement('option');
        option_html.className = 'popup-personal-data';
        option_html.innerHTML = option['payment_method'];
        option_html.setAttribute('value', option['id']);
        types_container.appendChild(option_html);
    }
}

function checkInputs(){
    parentNode = document.getElementById('confirm-order-inner');
    inputs = parentNode.querySelectorAll('input');
    empty = false;
    for(var i = 0; i<inputs.length; i++){
        var input = inputs[i];
        if(input.value == ''){
            input.className = 'popup-personal-data error';
            empty = true;
        }
    }
    return empty
}

async function changeClassNameIfNotEmpty(e){
    elem = e.currentTarget;
    if(elem.value != ''){
        elem.className = 'popup-personal-data';
    }
}

async function confirmOrder(){
    checkSession();
    var us = getCookie('us');
    if(us != null && us != undefined){
        if(!checkInputs()){
        bodyDict = new FormData();
        bodyDict.append('sum', Number(document.getElementById('sum-itself').innerHTML.replace('₽', '').replaceAll('&nbsp;', '')));
        bodyDict.append('name', document.getElementById('name').value);
        bodyDict.append('surname', document.getElementById('surname').value);
        bodyDict.append('address', document.getElementById('address').value);
        bodyDict.append('phone_number', document.getElementById('phone-number').value);
        bodyDict.append('delivery_type_id', document.getElementById('delivery-type').value);
        bodyDict.append('payment_method_id',document.getElementById('payment-type').value);
        files = document.getElementById('files').files;
        for(var i = 0; i<files.length; i++){
            bodyDict.append('files', files[i]);
        }
        bodyDict.append('comment', commentary);
        req = new XMLHttpRequest();
        req.open("POST", '/confirm_order');
        req.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        waiter = document.getElementById('waiter');
        waiter.style = "";
        filesWaiter = document.getElementById('files-waiter');
        if(files.length>0){
            filesWaiter.style.display = 'flex';
        }
        req.onreadystatechange = () => {
            if (req.readyState === XMLHttpRequest.DONE) {
            const status = req.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                setCookie('cart', JSON.stringify({}), 14);
                window.location.reload();
            } else {
                hideAddFilesWindowA();
                addVisibleEvent(false, `Ошибка ${status}, попробуйте повторить позже!`)
            }
            }
        };

        req.send(bodyDict);}
    } else {
        showLoginWindow();
    }
    
}

function showConfirmOrLogin(){
    var us = getCookie('us');
    if(us != null && us != undefined){
        showPopUpWindow('confirm-order-window');
    } else {
        showLoginWindow();
    }
}


createCartInfo();
createDeliveryTypesOptions();
createPaymentTypesOptions();
phoneInput = document.getElementById('phone-number');
phoneInput.addEventListener('keydown',enforceFormat);
phoneInput.addEventListener('keyup',formatToPhone);
confirmOrderBtn = document.getElementById('confirm-order');
confirmOrderBtn.addEventListener('click', showConfirmOrLogin);
parentNode = document.getElementById('confirm-order-inner');
inputs = parentNode.querySelectorAll('input');
for(var i = 0; i<inputs.length; i++){
    var input = inputs[i];
    input.addEventListener('input', changeClassNameIfNotEmpty);
}