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

async function showAddInfo(elem){
  container = elem.parentNode.parentNode;
  container.children[1].style = '';
  elem.setAttribute('onclick', 'hideAddInfo(this)');
  elem.className = "arrow-btn-u centered-v"
}

async function accountExit(){
  waiter = document.getElementById('waiter');
  waiter.style = "";
  response = await createAsyncGETRequest('exit');
  if(response['code']==200){
    eraseCookie('us');
    window.location.href = '/';
  }
  else{
    waiter.style = "display:none;";
    addVisibleEvent(false, 'Извините, что-пошло не так! Попробуйте позже!');
  }
}

async function hideAddInfo(elem){
  container = elem.parentNode.parentNode;
  container.children[1].style = 'display:none;';
  elem.setAttribute('onclick', 'showAddInfo(this)');
  elem.className = "arrow-btn-d centered-v"
}

async function createOrdersList(){
    data = await createAsyncGETRequest('purchases');
    var code = data['code'];
    var serverError = false;
    if(code == 23){
      serverError = true;
    }
    count = data['count'];
    data = JSON.parse(data['data']);
    if(data.length>0){
      email = data[0]['email'];
      myData = document.getElementById('user-data');
      emailContainer = document.createElement('div');
      emailContainer.className = "data-block flex-column";
      emailType = document.createElement('span');
      emailType.className = "data-type";
      emailType.innerHTML = "Электронная почта";
      emailContainer.appendChild(emailType);
      emailValue = document.createElement('span');
      emailValue.className = "data-value";
      emailValue.innerHTML = email;
      emailContainer.appendChild(emailValue);
      myData.appendChild(emailContainer);

      orderColor = ['yellow', 'orange', 'green', 'green']
      myOrders = document.getElementById('orders');
      for(iz = 0; iz<data.length; iz++){
        order = data[iz];

        orderContainer = document.createElement('div');
        orderContainer.className = "order-block flex-column";

        orderMainInfoContainer = document.createElement('div');
        orderMainInfoContainer.className = 'order-main-info flex-row';

        orderIDDateStatus = document.createElement('div');
        orderIDDateStatus.className = 'order-data flex-column centered-v';

        orderIDDate = document.createElement('span');
        orderIDDate.className = "order-id";
        orderDate = new Date(order['datetime']);
        orderIDDate.innerHTML = `Заказ №${order['order_id']} от ${orderDate.toLocaleDateString('ru-RU')}`;
        orderIDDateStatus.appendChild(orderIDDate);

        orderStatus = document.createElement('span');
        orderStatus.innerHTML = order['order_status'];
        orderStatus.className = 'order-status '
        orderStatus.className += orderColor[Number(order['status_id'])-1];
        orderIDDateStatus.appendChild(orderStatus);
        orderMainInfoContainer.appendChild(orderIDDateStatus);

        orderPrice = document.createElement('span');
        orderPrice.className = 'order-total-sum centered-v';
        orderPrice.innerHTML = Number(order['total_sum']).toLocaleString('ru-RU')+'₽';
        orderMainInfoContainer.appendChild(orderPrice);

        orderCollapseBtn = document.createElement('button');
        orderCollapseBtn.className = 'arrow-btn-d centered-v';
        orderCollapseBtn.setAttribute('onclick', 'showAddInfo(this)');
        orderMainInfoContainer.appendChild(orderCollapseBtn);
        orderContainer.appendChild(orderMainInfoContainer);

        orderAddInfo = document.createElement('div');
        orderAddInfo.className = 'order-add-info flex-row';
        orderAddInfo.style.display = 'none';

        orderAddInfoText = document.createElement('div');
        orderAddInfoText.className = 'order-add-info-text flex-column';

        orderAddDate = document.createElement('span');
        orderAddDate.className = 'order-date';
        orderAddDate.innerHTML = 'Дата: '+orderDate.toLocaleDateString('ru-RU') + ' ' + orderDate.toLocaleTimeString('ru-RU');
        orderAddInfoText.appendChild(orderAddDate);

        orderAddAddress = document.createElement('span');
        orderAddAddress.className = 'order-add-text-info';
        orderAddAddress.innerHTML ='Адрес: '+ order['order_address'];
        orderAddInfoText.appendChild(orderAddAddress);

        orderDeliveryType = document.createElement('span');
        orderDeliveryType.className = 'order-add-text-info';
        orderDeliveryType.innerHTML ='Тип доставки: '+ order['delivery_type'];
        orderAddInfoText.appendChild(orderDeliveryType);

        orderPaymentType = document.createElement('span');
        orderPaymentType.className = 'order-add-text-info';
        orderPaymentType.innerHTML ='Оплата : '+ order['payment_method'];
        orderAddInfoText.appendChild(orderPaymentType);
        orderAddInfo.appendChild(orderAddInfoText);

        orderProductFiles = document.createElement('div');
        orderProductFiles.className = 'order-add-info-prodFiles flex-column';

        orderProductsContainer = document.createElement('div');
        orderProductsContainer.className = 'order-add-info-prods flex-column';

        products = order['products']
        for(zzi = 0; zzi<products.length; zzi++){
          product = JSON.parse(products[zzi]);

          productContainer = document.createElement('a');
          productContainer.className = 'product-block flex-row';
          productContainer.setAttribute('href', `/product_page/${product['id']}`);

          productImg = document.createElement('img');
          productImg.className = 'order-product-img';
          productImg.setAttribute('src', product['image']);
          productContainer.appendChild(productImg);

          productTitle = document.createElement('span');
          productTitle.className = 'order-product-title';
          productTitle.innerHTML = product['title'];
          productContainer.appendChild(productTitle);

          productCount = document.createElement('span');
          productCount.className = 'order-product-count';
          productCount.innerHTML = product['count'];
          productContainer.appendChild(productCount);
          
          productPrice = document.createElement('span');
          productPrice.className = 'order-product-price';
          productPrice.innerHTML = Number(product['price']).toLocaleString('ru-RU')+'₽';
          productContainer.appendChild(productPrice);

          orderProductsContainer.appendChild(productContainer);
        }
        orderProductFiles.appendChild(orderProductsContainer);

        files = order['files'];
        console.log(files);
        if(files){
          orderFiles = document.createElement('div');
          orderFiles.className = 'order-add-info-files flex-column';
          for(zzi = 0; zzi<files.length; zzi++){
            file = files[zzi];
            parts = file.split('\\');
            filename = parts[parts.length-1];
            fileHyperLink = document.createElement('a');
            fileHyperLink.className = 'order-file-link';
            fileHyperLink.setAttribute('href', file);
            fileHyperLink.innerHTML = filename;
            orderFiles.appendChild(fileHyperLink);
          }
          orderProductFiles.appendChild(orderFiles);
        }
        
        orderAddInfo.appendChild(orderProductFiles);
        orderContainer.appendChild(orderAddInfo);

        myOrders.appendChild(orderContainer);
      }
    } else {
        if(serverError)addVisibleEvent(false, 'Извините, что-пошло не так! Попробуйте позже!');
        body_container = document.getElementById('body-content');
        body_container.innerHTML = '';
        margin_container = document.createElement('div');
        margin_container.className = 'container flex-column';
        margin_container.style = "row-gap:10px";
        empty_tag = document.createElement('h2');
        empty_tag.innerHTML = "Пока что тут пусто! Сделайте заказ!"
        exitBtn = document.createElement('button');
        exitBtn.setAttribute('id', 'thereisnoexit');
        exitBtn.addEventListener('click', accountExit);
        exitBtn.innerHTML = 'Выйти из аккаунта';
        margin_container.appendChild(empty_tag);
        margin_container.appendChild(exitBtn);
        body_container.appendChild(margin_container);

    }
}

createOrdersList();