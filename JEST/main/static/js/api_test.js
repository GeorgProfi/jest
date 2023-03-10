function create_why_reasons(data){
  count = data['count'];
  reasons_data = JSON.parse(data['data']);
  console.log(reasons_data);
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


var xhr = new XMLHttpRequest()
xhr.open(
    'GET',
    '/reviews?count=5',
    true,
)

xhr.onload = (e) => {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
        data = JSON.parse(xhr.responseText);
        create_why_reasons(data);
    } else {
      console.error(xhr.statusText);
    }
  }
};
xhr.onerror = (e) => {
  console.error(xhr.statusText);
};
xhr.send(null);