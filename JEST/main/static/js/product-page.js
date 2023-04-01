let big_slider_images = document.querySelectorAll('#swiper-slide img');
let current = 0;
let slide = document.querySelectorAll('#focus-slide a img');
sizes_btns = [0];
previous_active = 0;

parts = `${window.location.href}`.split('/')
id = parts[parts.length - 2];

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

document.querySelector('#add-to-cart-btn').addEventListener('click', ()=>{
  previous_active = (previous_active>0)?previous_active:0;
  addToCart(id, sizes_btns[previous_active].innerHTML, 1);
})


async function setNotActiveSizeBtn(btn_idx){
  sizes_btns[btn_idx].className = "size";
  sizes_btns[btn_idx].setAttribute('onclick', `setActiveSizeBtn(${btn_idx})`);
  previous_active = -1;
}

async function setActiveSizeBtn(btn_idx){
  if(previous_active!=-1){
    sizes_btns[previous_active].className='size';
    sizes_btns[previous_active].setAttribute('onclick', `setActiveSizeBtn(${previous_active})`);

  }
  sizes_btns[btn_idx].className = "size-active";
  sizes_btns[btn_idx].setAttribute('onclick', `setNotActiveSizeBtn(${btn_idx})`);
  previous_active = btn_idx;
}

function sliderSetActive(will_be_active) {
  current = will_be_active;
  for (let i = 0; i < big_slider_images.length; i++) {
    big_slider_images[i].classList.add('opacity0');
    slide[i].classList.remove('border0');
  }
  big_slider_images[current].classList.remove('opacity0');
  slide[current].classList.add('border0');
}

document.querySelector('.arrow-btn-r').onclick = function() {
  if (current + 1 == big_slider_images.length) {
    current = 0;
  }
  else {
    current++;
  }
  sliderSetActive(current);
};

document.querySelector('.arrow-btn-l').onclick = function() {
  if (current - 1 < 0) {
    current = big_slider_images.length-1;
  }
  else {
    current--
  }
  sliderSetActive(current);
};


async function null_className(elem){
  elem.className = "";
}

async function fillProductInfo(){
  parts = `${window.location.href}`.split('/')
  id = parts[parts.length - 2];
  data = await createAsyncGETRequest(`/product_info?id=${id}`);
  
  title = document.getElementById('product-page-title');
  document.title = title.innerHTML = data['title'];
  title.className = "";
  title.style = "";
  description = document.getElementById('product-description');
  description.innerHTML = data['description'];
  description.className = "";
  description.style = "";

  charcs = document.getElementById('product-characteristics');
  materials = data['material'];
  for(izi = 0; izi<materials.length; izi++){
    material = JSON.parse(materials[izi]);
    material_type_container = document.createElement('div');
    material_type_container.className = "product-characteristics-row";

    material_type = document.createElement('span'); 
    material_type.className = "product-characteristics-row-name";
    material_type.innerHTML = "Материал";

    material_value = document.createElement('span'); 
    material_value.className = "product-characteristics-row-vals";
    material_value.innerHTML = material['title'];

    material_type_container.appendChild(material_type);
    material_type_container.appendChild(material_value);
    charcs.appendChild(material_type_container);

    material_probe_container = document.createElement('div');
    material_probe_container.className = "product-characteristics-row";

    material_probe_type = document.createElement('span'); 
    material_probe_type.className = "product-characteristics-row-name";
    material_probe_type.innerHTML = "Проба";

    material_probe_value = document.createElement('span'); 
    material_probe_value.className = "product-characteristics-row-vals";
    material_probe_value.innerHTML = material['probe'];

    material_probe_container.appendChild(material_probe_type);
    material_probe_container.appendChild(material_probe_value);
    charcs.appendChild(material_probe_container);
  }
  mass_container = document.createElement('div');
  mass_container.className = "product-characteristics-row";
  mass_type = document.createElement('span'); 
  mass_type.className = "product-characteristics-row-name";
  mass_type.innerHTML = "Вес";
  mass_value = document.createElement('span'); 
  mass_value.className = "product-characteristics-row-vals";
  mass_value.innerHTML = `${data['mass']} г.`;

  mass_container.appendChild(mass_type);
  mass_container.appendChild(mass_value);
  charcs.appendChild(mass_container);

  price = document.getElementById('product-price');
  price.innerHTML = data['price'].toLocaleString("ru-RU")+'₽';
  price.className = "";
  price.style = "";

  sizes = JSON.parse(data['size']);
  sizes_length = Object.keys(sizes).length;
  if(sizes_length !== 0){
    sizes_btns = [];
    sizes_html = document.getElementById('product-sizes');
    sizes_html.style="";
    sizes_container = document.getElementById('product-sizes-wrapper');
    for(ji = 0; ji<sizes_length; ji++){
      size = sizes[`size${ji+1}`];

      size_button = document.createElement('button');
      size_button.className="size";
      size_button.innerHTML = size;
      size_button.setAttribute('onclick', `setActiveSizeBtn(${ji})`);
      sizes_container.appendChild(size_button);
      sizes_btns.push(size_button);
    }
  }

  images = data['images'];
  swiper_slide = document.getElementById('swiper-slide');
  focus_slide = document.getElementById('focus-slide');
  for(zi = 1; zi<4; zi++){
    current_image = images[`image_${zi}`];
    /*changing img sources directly -- better fix this ofc, but no time sorry :<*/
    swiper_slide_img = swiper_slide.children[zi-1];
    focus_slide_img = focus_slide.children[zi-1].children[0];
    swiper_slide_img.setAttribute('src', current_image);
    swiper_slide_img.addEventListener("load", ()=>{null_className(this)});
    focus_slide_img.setAttribute('src', current_image);
    focus_slide_img.addEventListener("load", ()=>{null_className(this)});
  }
  sliderSetActive(0);
}


fillProductInfo();



