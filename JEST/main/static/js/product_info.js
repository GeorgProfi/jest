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

async function getProductInfo(){
  parts = `${window.location.href}`.split('/')
  id = parts[parts.length - 2];
  data = await createAsyncGETRequest(`/product_info?id=${id}`);
  console.log(data);
}

getProductInfo();