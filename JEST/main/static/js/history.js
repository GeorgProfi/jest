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


async function createHistory(){
  data = await createAsyncGETRequest('/get_history');
  count = data['count'];
  data = JSON.parse(data['data']);
  classes = ['about-block', 'back-odd-about-block'];
  history_container = document.getElementById('about-brand');
  for(i = 0; i<data.length; i++){
    history_data = data[i];

    history_block = document.createElement('div');
    history_block.className = 'about-block';

    info = document.createElement('span');
    info.className = 'description-block centered-v';
    info.innerHTML = history_data['text'];
    history_block.appendChild(info);

    if(i==data.length-1){
      wrapper = document.createElement('div');
      figure = document.createElement('figure');
      wrapper.setAttribute('id', 'carousel');
      images = history_data['image'];
      for(j = 1 ; j<=Object.keys(images).length; j++){
        img = document.createElement('img');
        img.className = 'img-block';
        img.setAttribute('src', images[`img${j}`]);
        figure.appendChild(img);
      }
      wrapper.appendChild(figure);
      history_block.appendChild(wrapper);
    } else {
      img = document.createElement('img');
      img.className = 'img-block';
      img.setAttribute('src', history_data['image']['img1']);
      history_block.appendChild(img);
    }
    if(i%2==1){
      background_wrapper = document.createElement('div');
      background_wrapper.appendChild(history_block);
      background_wrapper.className = classes[1];
      history_container.appendChild(background_wrapper);
    } else{
    history_container.appendChild(history_block);
    }
  }
}

createHistory();