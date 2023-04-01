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

async function createMasters(){
  data = await createAsyncGETRequest('/masters');
  count = data['count'];
  masters_data = JSON.parse(data['data']);
  masters_container_html = document.querySelector('.emploee-cards');
  masters_info_container_html = document.getElementById('card')
  masters_container_html.innerHTML = '';
  for(i = 0; i<count; i++){
    master = masters_data[i];

    card_container_html = document.createElement('div');
    card_container_html.className = "card flex-row";

    info_block_html = document.createElement('div');
    info_block_html.className = "emploee-info flex-column";

    image = document.createElement('img');
    image.src = master["image"];
    image.className = "profile-image centered";
    card_container_html.appendChild(image);

    emploee_name = document.createElement('h4');
    emploee_name.className = "name";
    emploee_name.innerHTML = master["name"];
    info_block_html.appendChild(emploee_name);

    emploee_surname = document.createElement('h4');
    emploee_surname.className = "name";
    emploee_surname.innerHTML = master["surname"];
    info_block_html.appendChild(emploee_surname);

    post = document.createElement('h4');
    post.innerHTML = master["post"];
    post.className = "post";
    info_block_html.appendChild(post);

    text = document.createElement('span');
    text.innerHTML = master["text"];
    text.className = "discription";
    info_block_html.appendChild(text);

    card_container_html.appendChild(info_block_html);
    masters_container_html.appendChild(card_container_html);
  }
}
createMasters();