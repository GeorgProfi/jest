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

async function cancelChanges(){
    fileInput = document.getElementById('files');
    fileInput.files = previousFiles.files;
    refreshListOfFiles();
}

async function commitChanges(){
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
    if(products_html.children.length==0&&ind_order.children.length==0){
        createCartEmptyCard();
    }
}

async function deleteCard(called_elem){
    while(called_elem.parentNode != null){
        if (called_elem.className == 'product-card flex-row'){
            called_elem.remove();
        }
        called_elem = called_elem.parentNode;
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

async function showAddFilesWindow(){
    window_html = document.getElementById('add-files-window');
    window_html.style = 'opacity:0';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    setTimeout(()=>window_html.style.opacity = 1, 10);
}

function hideAddFilesWindow(event, elem){
    event.preventDefault();
    if(event.target.id=="add-files-window"){
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
    if(Object.keys(cart).length>0){
        
        product_html = document.getElementById('products');
        productCard = document.createElement('div');
        productCard.className = 'product-card flex-row';
        productCard.style.opacity = 0;
        product_html.appendChild(productCard);
        data = await createAsyncGETRequest('/cart-product-info');
        count = data['count'];
        data = JSON.parse(data['data']);
        product_html.innerHTML = "";
        for(jji = 0; jji<count; jji++){
            product = data[jji];
            regexp = new RegExp(`${product['id']}`)
            sizes = Object.keys(cart).filter(key=>key.match(regexp));
            if(product['id']!=0){
                for(zzi = 0; zzi<sizes.length; zzi++){
                    size = sizes[zzi].split('$')[1];

                    productCard = document.createElement('div');
                    productCard.className = 'product-card flex-row';

                    productLinkable = document.createElement('a');
                    productLinkable.className = 'product-linkable flex-row';
                    productLinkable.setAttribute('href', `/product_page/${product['id']}`);

                    productImage = document.createElement('img');
                    productImage.className = 'prodcut-image';
                    productImage.setAttribute('src', product['image']);
                    productLinkable.appendChild(productImage);

                    productTitleID = document.createElement('div');
                    productTitleID.className = 'product-titleId flex-column';

                    productTitle = document.createElement('span');
                    productTitle.className = 'product-title';
                    productTitle.innerHTML = product['title'];
                    productTitleID.appendChild(productTitle);

                    productID = document.createElement('span');
                    productID.className = 'product-id';
                    productID.innerHTML = product['id'];
                    productTitleID.appendChild(productID);
                    productLinkable.appendChild(productTitleID);
                    productCard.appendChild(productLinkable);

                    productPrice = document.createElement('span');
                    productPrice.className = 'product-price';
                    productPrice.innerHTML = product['price'].toLocaleString('ru-RU')+'₽';
                    productCard.appendChild(productPrice);

                    productSize = document.createElement('span');
                    productSize.className = 'product-size';
                    productSize.innerHTML = (size>0)?size:' ';
                    productCard.appendChild(productSize);

                    productQuantityControls = document.createElement('div');
                    productQuantityControls.className = 'count-controls flex-row';

                    productMinusBtn = document.createElement('buttton');
                    productMinusBtn.className = 'product-control';
                    productMinusBtn.innerHTML = '-';
                    productMinusBtn.setAttribute('onclick', `addToCart(${product['id']}, ${size}, -1);setCount(${product['id']}, ${size}, this.parentNode.children[1])`);
                    productQuantityControls.appendChild(productMinusBtn);

                    productQuantity = document.createElement('span');
                    productQuantity.className = 'counter';
                    productQuantity.innerHTML = cart[sizes[zzi]];
                    productQuantityControls.appendChild(productQuantity);

                    productPlusBtn = document.createElement('buttton');
                    productPlusBtn.className = 'product-control';
                    productPlusBtn.innerHTML = '+';
                    productPlusBtn.setAttribute('onclick', `addToCart(${product['id']}, ${size}, 1);setCount(${product['id']}, ${size}, this.parentNode.children[1])`);
                    productQuantityControls.appendChild(productPlusBtn);
                    productCard.appendChild(productQuantityControls);

                    productDeleteBtn = document.createElement('buttton');
                    productDeleteBtn.className = 'product-delete';
                    productDeleteBtn.setAttribute('onclick', `deleteFromCart(${product['id']}, ${size});setCount(${product['id']}, ${size}, this);`);
                    productCard.appendChild(productDeleteBtn);

                    product_html.appendChild(productCard);
                }
            } else {
                own_order = document.getElementById('own-order');
                own_order.style="";
            }
        }
        recalculateAndSetSumm();
    } else {
        createCartEmptyCard();
    }
}

createCartInfo();