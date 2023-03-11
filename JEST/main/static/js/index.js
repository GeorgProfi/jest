

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


async function create_reviews(){
  data = await createAsyncGETRequest('reviews?count=5')
  count = data['count'];
  reviews_data = JSON.parse(data['data']);
  reviews_container_html = document.getElementById('#reviews-block');
  for(i = 0; i<count; i++){
    review = reviews_data[i];

    review_container = document.createElement('div');
    review_container.className = "review-container";

    client_name = document.createElement('span');
    client_name.innerHTML = review['name'];
    client_name.className = "review-name";
    review_container.appendChild(client_name);
    
    client_text = document.createElement('span');
    client_text.innerHTML = review['review_text'];
    client_text.className = "review-text";
    review_container.appendChild(client_text);

    date = document.createElement('span');
    date.innerHTML = review['date'];
    date.className = "review-date";
    review_container.appendChild(date);

    reviews_container_html.appendChild(review_container);
    }
}


async function create_why_reasons(){
  data = await createAsyncGETRequest('why-us/')
  count = data['count'];
  reasons_data = JSON.parse(data['data']);
  reasons_container_html = document.getElementById('#why-block');
  for(i = 0; i<count; i++){
    reason = reasons_data[i];

    reason_block_html = document.createElement('div');
    reason_block_html.className = "why-reason";

    image = document.createElement('img');
    image.src = reason["image"];
    image.className = "why-image";
    reason_block_html.appendChild(image);

    title = document.createElement('h4');
    title.innerHTML = reason["title"];
    reason_block_html.appendChild(title);

    text = document.createElement('span');
    text.innerHTML = reason["text"];
    text.className = "why-text";
    reason_block_html.appendChild(text);

    reasons_container_html.appendChild(reason_block_html);
  };
}

create_why_reasons();
create_reviews();

