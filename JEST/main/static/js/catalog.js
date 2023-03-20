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

function showFilterContent(elem){
    box = elem.parentNode.parentNode;
    elem.className="arrow-btn-u"
    content = box.children[2];
    div_line = box.children[1];
    content.style="opacity:0;";
    div_line.style = "opacity:0"
    setTimeout(()=>{content.style="opacity:1;";}, 100);
    elem.setAttribute('onclick',"hideFilterContent(this);");
}

function hideFilterContent(elem){
    box = elem.parentNode.parentNode;
    content = box.children[2];
    div_line = box.children[1];
    content.style="opacity:0;";
    div_line.style = "opacity:1";
    setTimeout(()=>{
        content.style="display:none"
    }, 300);
    elem.className="arrow-btn-d"
    elem.setAttribute('onclick',"showFilterContent(this);");
}

async function setSliderPadding(min_value, max_value){
    slider = document.getElementById('slider-foreground');
    slider.style=`padding-left:${min_value}%; padding-right:${max_value}%`;
}

async function setInputsValue(min_value, max_value){
    min_price_i = document.getElementById('min-price-i');
    max_price_i = document.getElementById('max-price-i');
    min_price_i.value = min_value;
    max_price_i.value = max_value;
}
async function setRangeValue(min_value, max_value){
    min_price = document.getElementById('min-price-s');
    min_price.value = min_value;
    max_price = document.getElementById('max-price-s');
    max_price.value = max_value;
}

function priceRangeInput(evoker){
    range_min = 100;
    min_price = document.getElementById('min-price-s');
    min_price_range = min_price.value;
    max_price = document.getElementById('max-price-s');
    max_price_range = max_price.value;
    if (max_price_range - min_price_range < range_min) { 
        if (evoker.id == "min-price-s") {
            min_price.value = Number(max_price_range) - range_min;        
        } else {
            max_price.value = Number(min_price_range) + range_min;
        } 
    }
    setSliderPadding((min_price.value/min_price.max)*100, (1-max_price.value/max_price.max)*100);
    setInputsValue(min_price.value, max_price.value);
}

function priceInput(){
    min_price = document.getElementById('min-price-i');
    min_price_val = Number(min_price.value);
    max_price = document.getElementById('max-price-i');
    max_price_val = Number(max_price.value);
    if(min_price_val<Number(min_price.min)){
        min_price.value = min_price.min;
    } else {
        if(min_price_val>Number(max_price.max)){
            min_price.value = min_price.max;
        }
    }
    if(max_price_val<Number(max_price.min)){
        max_price.value = max_price.min;
    } else {
        if(max_price_val>Number(max_price.max)){
            max_price.value = max_price.max;
        }
    }
    setSliderPadding((min_price.value/min_price.max)*100, (1-max_price.value/max_price.max)*100);
    setRangeValue(min_price.value, max_price.value);
}

async function create_products(){
    data = await createAsyncGETRequest('/products?count=10&already_in_page=0');
    count = data['count'];
    products_data = JSON.parse(data['data']);
    html_grid = document.getElementById('products-grid');
    html_count = document.getElementById('products-count');
    for(i = 0; i<count; i++){
        product = products_data[i];
    
        card = document.createElement('a')
        card.className = 'product-card flex-column';
        card.setAttribute('onMouseOver',"this.children[1].style=''");
        card.setAttribute('onMouseOut',"this.children[1].style='display:none;'");

        visible_part = document.createElement('div');
        visible_part.className = 'card-visible-part flex-column';
        card.appendChild(visible_part);

        image = document.createElement('img');
        image.className = 'product-image centered';
        image.src = product['image'];
        visible_part.appendChild(image);

        product_visible_info = document.createElement('div');
        product_visible_info.className = 'product-info flex-column';
        
        title = document.createElement('span');
        title.className = 'product-big-text';
        title.innerHTML = product['title'];
        product_visible_info.appendChild(title);

        price = document.createElement('span');
        price.className = 'product-big-text';
        price.innerHTML = product['price'] + '₽';
        product_visible_info.appendChild(price);

        visible_part.appendChild(product_visible_info);
        card.append(visible_part);

        hover_part = document.createElement('div');
        hover_part.className = 'card-hover-part flex-column';
        hover_part.style='display:none;';

        cart_button = document.createElement('button');
        cart_button.className = 'focus-btn cart-btn';
        cart_button.innerHTML = 'В корзину';
        hover_part.appendChild(cart_button);

        add_info = document.createElement('div');
        add_info.className = 'product-add-info flex-row';

        materials_headers = document.createElement('div')
        materials_headers.className = 'product-add-info-col flex-column';
        headers_m = ['Металл', 'Проба'];

        materials_values = document.createElement('div')
        materials_values.className = 'product-add-info-col flex-column';
        values = ['title', 'probe'];

        materials = product['material'];
        
        for(j = 0; j<materials.length; j++){
            material = materials[j];
            for(z = 0; z<headers_m.length; z++){
                header = document.createElement('span');
                header.className = 'product-small-text';
                header.innerHTML = headers_m[z];
                materials_headers.appendChild(header);
                header_value = document.createElement('span');
                header_value.className = 'product-small-text fg-color';
                header_value.innerHTML = material[values[z]];
                materials_values.appendChild(header_value);
            }

        }
        add_info.appendChild(materials_headers);
        add_info.appendChild(materials_values);

        hover_part.appendChild(add_info);
        card.append(hover_part);
        html_grid.appendChild(card);
    }
    html_count.innerHTML = `Результат: ${html_grid.children.length}`;
}

create_products();