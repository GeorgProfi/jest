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

async function createOrdersList(){
    data = await createAsyncGETRequest('purchases');
    count = data['count'];
    data = JSON.parse(data['data']);

    console.log(data);
    email = data[0]['email'];
    myData = document.getElementById('my-data');
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

    myOrders = document.getElementById('my-orders');
    for(iz = 0; iz<data.length; iz++){
        order = data[iz];

        orderContainer = document.createElement('div');
        orderContainer.className = "order-block flex-column";

        orderId = document.createElement('span');
        orderId.className = "order-id";
        orderId.innerHTML = order['order_id'];
        orderContainer.appendChild(orderId);

        myOrders.appendChild(orderContainer);
    }
}

createOrdersList();