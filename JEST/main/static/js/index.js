window.onresize = ()=>{
  reviewsContainerOnResize();
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


async function create_reviews(data){
  data = await createAsyncGETRequest('/reviews?count=5');
  count = data['count'];
  reviews_data = JSON.parse(data['data']);
  reviews_container_html = document.getElementById('reviews-block');
  column_count = getComputedStyle(reviews_container_html).getPropertyValue("grid-template-columns").split(" ").length;
  reviews_container_html.innerHTML = '';
  for(i = 0; i<column_count; i++){
    review = reviews_data[i];

    review_container = document.createElement('div');
    review_container.className = "review-container";
    review_container.style="";

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
    for(i = column_count; i<count; i++){
      review = reviews_data[i];
  
      review_container = document.createElement('div');
      review_container.className = "review-container";
      review_container.style="display:none";
  
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

function reviewsContainerOnResize(){
  reviews_container_html = document.getElementById('reviews-block');
  column_count = getComputedStyle(reviews_container_html).getPropertyValue("grid-template-columns").split(" ").length;
  array = Array.from(reviews_container_html.children).filter(review => getComputedStyle(review).getPropertyValue('display') !== "none")
  if(array.length < column_count){
    for(i = array.length; i<column_count; i++){
      reviews_container_html.children[i].style = ""
    }
  } else{
    for(i = column_count; i<array.length; i++){
      reviews_container_html.children[i].style = "display:none;"
    }
  }
}


async function create_why_reasons(){
  data = await createAsyncGETRequest('why-us/')
  count = data['count'];
  reasons_data = JSON.parse(data['data']);
  reasons_container_html = document.getElementById('why-block');
  reasons_container_html.innerHTML = '';
  for(i = 0; i<count; i++){
    reason = reasons_data[i];

    reason_block_html = document.createElement('div');
    reason_block_html.className = "why-reason flex-column";

    image = document.createElement('img');
    image.src = reason["image"];
    image.className = "why-image centered";
    reason_block_html.appendChild(image);

    title = document.createElement('h4');
    title.className = "centered"
    title.innerHTML = reason["title"];
    reason_block_html.appendChild(title);

    text = document.createElement('span');
    text.innerHTML = reason["text"];
    text.className = "why-text centered";
    reason_block_html.appendChild(text);

    reasons_container_html.appendChild(reason_block_html);
  };
}

async function create_faq(){
  data = await createAsyncGETRequest('faq/')
  count = data['count'];
  faqs_data = JSON.parse(data['data']);
  faqs_block_html = document.getElementById('faq-block');
  for(i = 0; i<count; i++){
    faq = faqs_data[i];

    faq_container = document.createElement('a');
    faq_container.className = "faq-container";
    faq_container.setAttribute('onclick',"open_faq(this)");

    question = document.createElement('span');
    question.className = "faq-question";
    question.innerHTML = faq['question'];
    faq_container.appendChild(question);

    div_line = document.createElement('div');
    div_line.className = "faq-line";
    faq_container.appendChild(div_line);

    answer = document.createElement('span');
    answer.className = "faq-answer";
    answer.innerHTML = faq['answer'];
    faq_container.appendChild(answer);

    faqs_block_html.appendChild(faq_container);
  };
}

async function create_mpp(){
  data = await createAsyncGETRequest('most-popular-products?count=5');
  count = data['count']
  mpps_data = JSON.parse(data['data']);
  mpps_block_html = document.getElementById('popprod');
  mpps_block_html.innerHTML = '';
  for(i = 0; i<count; i++){
    mpp = mpps_data[i];

    console.log(mpp)

    mpp_container = document.createElement('a');
    mpp_container.className = "product-card";
    mpp_container.href=`/product_page/${mpp['product-id']}`;

    image = document.createElement('img');
    image.className = 'product-image';
    image.src = mpp['product-image'];
    mpp_container.appendChild(image);

    price = document.createElement('span')
    price.className = 'product-price';
    price.innerHTML = Number(mpp['product-price']).toLocaleString('ru-RU')+"₽";
    mpp_container.appendChild(price);

    mpps_block_html.appendChild(mpp_container);
  }
}

async function open_faq(elem){
  elem.setAttribute('onclick',"close_faq(this)");
  for(let i = 1; i<elem.children.length; i++){
   elem.children[i].style='display:inline';
  }
}

async function close_faq(elem){
  elem.setAttribute('onclick',"open_faq(this)");
  for(let i = 1; i<elem.children.length; i++){
   elem.children[i].style='display:none';
  }
}
function add_review_to(side){
  column_count = getComputedStyle(reviews_container_html).getPropertyValue("grid-template-columns").split(" ").length;
  reviews_block = document.getElementById("reviews-block");
  reviews_count = reviews_block.children.length;
  active_element = reviews_block.children[0];
  if(side==="left"){
    reviews_block.children[reviews_count-1].style = "";
    reviews_block.insertBefore(reviews_block.children[reviews_count-1], active_element);
    reviews_block.children[column_count].style = "display:none";
  } else {
    active_element.style="display:none";
    reviews_block.insertBefore(active_element, reviews_block.children[reviews_count-1].nextSibling);
    reviews_block.children[column_count-1].style = "";
  }
}
create_why_reasons(),
create_reviews(),
create_faq(),
create_mpp()

