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

