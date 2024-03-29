
window.onscroll = loadProductsOnScroll;
already_sent = false;
previous_is_zero = false;


function loadProductsOnScroll(){
    if ((document.body.scrollTop/document.body.scrollHeight)>0.1 && !previous_is_zero){
        already_on_page = document.getElementById('products-count').getAttribute('value');
        showFiltredProducts(Number(already_on_page)+10, already_on_page, 'scroll');
        deactivateShowProductsBtn();
        window.onscroll = '';
}}



filter_headers_value = {'Коллекция':'collections', 'Металл':'probes_and_metals', 'Проба металла':'probes', 'Тип изделия':'sizes_and_categories', 'Размер':'sizes', 'Камни':'gems'};
hidden_headers = ["probes", "sizes"];
active_filters = [];
current_filter = {};
there_is_empty_cards = true;
for(var i in filter_headers_value){
    current_filter[filter_headers_value[i]] = [];
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
function is_visible(e) {return e.offsetWidth > 0 || e.offsetHeight > 0;}

async function uncheck_filters(){
    window.history.replaceState(null, document.title, "/catalog")
    filters_container_html = document.getElementById('filters');
    all_inputs = [];
    for(i=1; i<filters_container_html.children.length; i++){
        filter_content = filters_container_html.children[i].children[2];
        inputs = filter_content.getElementsByTagName('input');
        
        for (z=0; z<inputs.length; z++){
            input = inputs[z];
            input.checked = false;
            all_inputs.push(input);
        }
    }
    for(iji = 0; iji<all_inputs.length; iji++){
        showOnCheck.call(this, all_inputs[iji])
    }
    price_slider = document.getElementById('price-box').children[2].children[0]
    max_price = price_slider.children[2]
    min_price = price_slider.children[3]
    max_price.value = max_price.max;
    min_price.value = 0;
    evt = new Event('change');
    max_price.dispatchEvent(evt);
    min_price.dispatchEvent(evt);
    priceInput();
    activateShowProductsBtn();
    
}

function listOfFuncs(){
    delete_products();create_products('', true);writeFiltersToCurrent();showFiltredProducts(10, 0, 'button');deactivateShowProductsBtn();
}

async function deactivateShowProductsBtn(){
    btn = document.getElementById('show-filters-btn');
    btn.innerHTML = "Подождите";
    btn.removeEventListener('click', listOfFuncs);
}

async function activateShowProductsBtn(){
    btn = document.getElementById('show-filters-btn');
    btn.innerHTML = "Показать";
    btn.addEventListener('click', listOfFuncs);
}


function showOnCheck(elem){
    checked = elem.checked;
    checkbox_title = elem.parentNode.nextSibling.innerHTML;
    if(checked){
        active_filters.push(checkbox_title);
        for (iiii = 0; iiii<hidden_headers.length; iiii++){
            hidden_title = hidden_headers[iiii];
            hidden_container = document.getElementById(hidden_title);
            hidden_content = hidden_container.children[2];
            for (jjjj = 0; jjjj<hidden_content.children.length; jjjj++){
                check_box = hidden_content.children[jjjj];
                if(check_box.getAttribute('showOn').split(',').includes(checkbox_title)&&check_box.id != "null"){
                    check_box.style = "";
                    hidden_container.style='';
                }
            }
        }
    } else {
        var index = active_filters.indexOf(checkbox_title);
        if (index != -1){active_filters.splice(index, 1)};
        for (i = 0; i<hidden_headers.length; i++){
            hidden_title = hidden_headers[i];
            hidden_container = document.getElementById(hidden_title);
            hidden_content = hidden_container.children[2];
            for (j = 0; j<hidden_content.children.length; j++){
                check_box = hidden_content.children[j];
                showOn_arr = check_box.getAttribute('showOn').split(',');
                is_active = false;
                for (z = 0; z<showOn_arr.length; z++){
                    if(active_filters.indexOf(showOn_arr[z])!=-1){
                        is_active = true;
                        break;
                    }
                }
                if(!is_active){
                    check_box.style="display:none;";
                    check_box.children[0].children[0].checked = false;
                }

            }
            is_active = false;
            for(j = 0; j<hidden_content.children.length; j++){
                check_box = hidden_content.children[j];
                if (is_visible(check_box)){
                    is_active = true;
                    break;
                }
            }
            if(!is_active){
                hidden_container.style='display:none;'
            }
            
        }
    }

}

function writeFiltersToCurrent(){
    filters_container_html = document.getElementById('filters');
    for(var i in filter_headers_value){
        current_filter[filter_headers_value[i]] = [];
    }
    for(i=1; i<filters_container_html.children.length; i++){
        filter_content = filters_container_html.children[i].children[2];
        filter_title = filters_container_html.children[i].children[0].children[0].innerHTML;
        check_boxes = filter_content.getElementsByClassName('check-container');
        for (z = 0; z<check_boxes.length; z++){
            mark_box = check_boxes[z].children[0];
            input = mark_box.children[0];
            title = check_boxes[z].children[1].innerHTML;
            if(input.checked){
                current_filter[filter_headers_value[filter_title]].push(title);
            }
        }
    }
    price_slider = document.getElementById('price-box').children[2].children[0]
    max_price = price_slider.children[2].value;
    min_price = price_slider.children[3].value;
    current_filter['max_price'] = max_price;
    current_filter['min_price'] = min_price;
}

async function showFiltredProducts(count, already_on_page, sender){
    if(!already_sent){
    already_sent = true;
    max_price = current_filter['max_price'];
    min_price = current_filter['min_price'];
    url = `/products?count=${count}&already_in_page=${already_on_page}&max_price=${max_price}&min_price=${min_price}`;
    const params = new URLSearchParams(window.location.search);
    title = params.get("title");
    possibly_titles = await createAsyncGETRequest(`search?title=${title}`);
        count = Number(possibly_titles['count']);
        data = JSON.parse(possibly_titles['data']);
        if(count>0){
            url+=`&title=${data['title1']}`;
            for(ziiz = 2; ziiz<=count; ziiz++){
                url_base+=`+${data[`title${ziiz}`]}`;
            }
        }
    for(var i in filter_headers_value){
        if(current_filter[filter_headers_value[i]].length>0){
            url+=`&${filter_headers_value[i]}=${current_filter[filter_headers_value[i]][0].replace(/ /g, "$")}`;
        for(z=1; z<current_filter[filter_headers_value[i]].length; z++){
            url+=`+${current_filter[filter_headers_value[i]][z].replace(/ /g, "$")}`;
            }   
        }
    }
    fixGrid();
    create_products(url);
    }
}

function fixGrid(){
    grid = document.getElementById('products-grid');
    grid.className = "fixed";
}

function showFilterContent(e){
    elem = e.currentTarget;
    elem.removeEventListener('click', showFilterContent, false);
    box = elem.parentNode;
    elem.children[1].className="arrow-btn-u"
    content = box.children[2];
    div_line = box.children[1];
    content.style="opacity:0;";
    div_line.style = "opacity:0"
    setTimeout(()=>{content.style="opacity:1;";}, 100);
    elem.addEventListener('click', hideFilterContent);
}

function hideFilterContent(e){
    elem = e.currentTarget;
    elem.removeEventListener('click', hideFilterContent, false);
    box = elem.parentNode;
    content = box.children[2];
    div_line = box.children[1];
    content.style="opacity:0;";
    div_line.style = "opacity:1";
    setTimeout(()=>{
        content.style="display:none"
    }, 100);
    elem.children[1].className="arrow-btn-d"
    elem.addEventListener('click', showFilterContent);
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

async function create_and_fill_filters(){
    data = await createAsyncGETRequest('/filters');
    count = data['count'];
    data = data['data'];
    special_ones = {'sizes_and_categories':'sizes', 'probes_and_metals':'probes'}
    filters_container_html = document.getElementById('filters');
    max_price = data['max_price'];
    price_slider = document.getElementById('price-box').children[2].children[0]
    max_price_slider = price_slider.children[2];
    min_price_slider = price_slider.children[3];
    max_price_slider.setAttribute('max', Number(max_price));
    max_price_slider.setAttribute('value', Number(max_price));
    min_price_slider.setAttribute('max', Number(max_price));
    max_price_input = document.getElementById('max-price-i');
    min_price_input = document.getElementById('max-price-i');
    max_price_input.setAttribute('max', Number(max_price));
    max_price_input.setAttribute('value', Number(max_price));
    min_price_input.setAttribute('max', Number(max_price));
    current_filter['max_price'] = Number(max_price);
    current_filter['min_price'] = 0;
    priceRangeInput(max_price_input);
    evt = new Event('change');
    max_price_slider.dispatchEvent(evt);
    min_price_slider.dispatchEvent(evt);
    price_anchor = document.getElementById('price-box').children[0];
    price_anchor.addEventListener('click', showFilterContent)
    for(var i in filter_headers_value){
        header = i;
        values = data[filter_headers_value[header]];
        is_special = false;
        hide_checkboxes = false;

        filter_box = document.createElement('div');
        filter_box.className = "filter-inner flex-column";
        if(hidden_headers.includes(filter_headers_value[header])){
            filter_box.style='display:none';
            filter_box.id = filter_headers_value[header];
            hide_checkboxes = true;
        }
        if(Object.keys(special_ones).includes(filter_headers_value[header])){
            is_special = true;
        }

        var title_n_arrow = document.createElement('a');
        title_n_arrow.className = 'title-n-arrow flex-row';
        title_n_arrow.addEventListener('click', showFilterContent)

        title = document.createElement('h2');
        title.innerHTML = header;
        title_n_arrow.appendChild(title);

        arrow = document.createElement('button');
        arrow.className = 'arrow-btn-d';
        title_n_arrow.appendChild(arrow);

        filter_box.appendChild(title_n_arrow);

        div_line = document.createElement('div');
        div_line.className = 'div-line';
        filter_box.appendChild(div_line);

        filter_content = document.createElement('div');
        filter_content.className = 'filter-content flex-column';
        filter_content.style = 'display:none;';

        for(var j in values){
            checkbox_value = JSON.parse(values[j]);

            check_box = document.createElement('div');
            check_box.className = 'check-container flex-row';

            mark_box = document.createElement('div');
            mark_box.className = 'mark-box';

            input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            input.addEventListener('change', activateShowProductsBtn);
            if(is_special){
                input.setAttribute('onchange', input.getAttribute('onchange')+';showOnCheck(this)')
            }
            mark_box.appendChild(input);

            span = document.createElement('span');
            span.className = 'check-mark centered-v';
            mark_box.appendChild(span);

            check_box.appendChild(mark_box);

            check_text = document.createElement('span');
            check_text.className = 'check-text centered-v';
            check_text.innerHTML = checkbox_value['title'];
            check_box.appendChild(check_text);
            filter_content.appendChild(check_box)
        }
        filter_box.appendChild(filter_content);
        filters_container_html.appendChild(filter_box);
    }
    for(var i in special_ones){
        header = i;
        values = data[i];
        
        filter_content_html = document.getElementById(special_ones[i]).children[2];
        already_in = [];
        for(j = 0; j<values.length; j++){
            check_boxes = JSON.parse(values[j]);
            check_show_on_title = check_boxes['title'];
            for(var z in check_boxes[special_ones[i]]){
                special_filter_text = check_boxes[special_ones[i]][z];
                if(!(already_in.includes(special_filter_text))){
                    already_in.push(special_filter_text);

                    check_box = document.createElement('div');
                    check_box.className = 'check-container flex-row';
                    check_box.id = special_filter_text;
                    check_box.setAttribute('showOn', check_show_on_title);
                    check_box.style='display:none';

                    mark_box = document.createElement('div');
                    mark_box.className = 'mark-box';

                    input = document.createElement('input');
                    input.setAttribute('type', 'checkbox');
                    mark_box.appendChild(input);

                    span = document.createElement('span');
                    span.className = 'check-mark centered-v';
                    mark_box.appendChild(span);

                    check_box.appendChild(mark_box);

                    check_text = document.createElement('span');
                    check_text.className = 'check-text centered-v';
                    check_text.innerHTML = special_filter_text;
                    check_box.appendChild(check_text);
                    filter_content_html.appendChild(check_box)
            } else {
                check_box = document.getElementById(special_filter_text);
                check_box.setAttribute('showOn', check_box.getAttribute('showOn')+','+check_show_on_title);
            }
            }
        }

    }

}

async function delete_products(){
    html_grid = document.getElementById('products-grid');
    html_count = document.getElementById('products-count');
    html_grid.innerHTML = '';
    html_count.innerHTML = `Результат: ${html_grid.children.length}`;
    html_count.setAttribute('value', html_grid.children.length);
}

async function showCardHoverPart(e){
    elem = e.currentTarget;
    elem.children[1].style='';
    sideMargin = parseFloat(getComputedStyle(elem).getPropertyValue('border-left'));
    topMargin = parseFloat(getComputedStyle(elem).getPropertyValue('border-top'));
    rowGap = parseFloat(getComputedStyle(elem.parentNode).getPropertyValue('row-gap'));
    columnGap = parseFloat(getComputedStyle(elem.parentNode).getPropertyValue('column-gap'));
    elem.style=`margin: -${topMargin}px -${sideMargin+columnGap}px -${Number(elem.offsetHeight) - topMargin}px -${sideMargin}px`;
}
async function hideCardHoverPart(e){
    elem = e.currentTarget;
    elem.style=``;
    elem.children[1].style='display:none';
}


async function create_products(url, empty=false){
    count = 0;
    if(!empty){
        data = await createAsyncGETRequest(url);
        count = data['count'];
        if(count<1){
            previous_is_zero = true;
        } else{
            previous_is_zero = false;
        }
        products_data = JSON.parse(data['data']);
        if(there_is_empty_cards){
            delete_products();
        }
        there_is_empty_cards = false;
    } else {
        count = 10;
        data = {'count':10, 'data':[{'id':'-1', 'title':'Всевидящее око', 'image':'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', 'price':'20000', 'gems':'', 'material':''}, 
        {'id':'-1', 'title':'Всевидящее око','image':'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',  'price':'20000', 'gems':'', 'material':''}, 
        {'id':'-1', 'title':'Всевидящее око','image':'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',  'price':'20000', 'gems':'', 'material':''}, 
        {'id':'-1', 'title':'Всевидящее око','image':'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',  'price':'20000', 'gems':'', 'material':''}, 
        {'id':'-1', 'title':'Всевидящее око','image':'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',  'price':'20000', 'gems':'', 'material':''}, 
        {'id':'-1', 'title':'Всевидящее око','image':'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',  'price':'20000', 'gems':'', 'material':''}, 
        {'id':'-1', 'title':'Всевидящее око','image':'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',  'price':'20000', 'gems':'', 'material':''}, 
        {'id':'-1', 'title':'Всевидящее око','image':'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', 'price':'20000', 'gems':'', 'material':''},
        {'id':'-1', 'title':'Всевидящее око','image':'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',  'price':'20000', 'gems':'', 'material':''},
        {'id':'-1','image':'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',  'title':'Всевидящее око', 'price':'20000', 'gems':'', 'material':''}]}
        products_data = data['data'];
        there_is_empty_cards = true
        html_count.setAttribute('value', 15);
    }
    html_grid = document.getElementById('products-grid');
    html_count = document.getElementById('products-count');
    setTimeout(()=>{window.onscroll = loadProductsOnScroll}, 300);
    for(i = 0; i<count; i++){
        
        product = products_data[i];

        card = document.createElement('div');
        card.className = 'product-card flex-column';
        card.addEventListener('mouseover', showCardHoverPart);
        card.addEventListener('mouseout', hideCardHoverPart);

        visible_part = document.createElement('a');
        visible_part.href=`/product_page/${product['id']}`;
        visible_part.className = 'card-visible-part flex-column';
        card.appendChild(visible_part);

        image = document.createElement('img');
        image.className = 'product-image centered';
        if(empty)image.className+=" animated-background";
        image.src = product['image'];
        visible_part.appendChild(image);

        product_visible_info = document.createElement('div');
        product_visible_info.className = 'product-info flex-column';
        
        title = document.createElement('span');
        title.className = 'product-big-text';
        if(empty)title.className+=" animated-background";
        title.innerHTML = product['title'];
        product_visible_info.appendChild(title);

        price = document.createElement('span');
        price.className = 'product-big-text';
        if(empty)price.className+=" animated-background";
        price.innerHTML = Number(product['price']).toLocaleString("ru-RU") + '₽';
        product_visible_info.appendChild(price);

        visible_part.appendChild(product_visible_info);
        card.append(visible_part);

        hover_part = document.createElement('div');
        hover_part.className = 'card-hover-part flex-column';
        hover_part.style='display:none;';

        cart_button = document.createElement('button');
        cart_button.className = 'focus-btn cart-btn';
        cart_button.prodId = product['id']
        cart_button.innerHTML = 'В корзину';
        cart_button.addEventListener('click', (e)=>addToCart(e.currentTarget.prodId, 0, 1))
        hover_part.appendChild(cart_button);

        add_info = document.createElement('div');
        add_info.className = 'product-add-info flex-row';

        materials_headers = document.createElement('div')
        materials_headers.className = 'product-add-info-col flex-column';
        headers_m = ['Металл', 'Проба'];

        materials_values = document.createElement('div')
        materials_values.className = 'product-add-info-col flex-column';
        values = ['title', 'probe'];
        try{
            materials = product['material'];
            for(j = 0; j<materials.length; j++){
                material = JSON.parse(materials[j]);
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

        } catch (e){
            console.log('no material')
        } finally {
            hover_part.appendChild(add_info);
            card.append(hover_part);
            html_grid.appendChild(card);
            html_count.innerHTML = `Результат: ${html_grid.children.length}`;
            if(empty)html_count.innerHTML = `Результат: `;
            html_count.setAttribute('value', html_grid.children.length);
        }
    }
    if(count==0){
        fixGrid();
    }
    activateShowProductsBtn();
    already_sent = false;
    window.onscroll = loadProductsOnScroll;
}

async function try_to_search(){
    const params = new URLSearchParams(window.location.search);
    title = params.get("title");
    if(title != null){
        url_base = `/products?count=15&already_in_page=0`;
        possibly_titles = await createAsyncGETRequest(`search?title=${title}`);
        count = Number(possibly_titles['count']);
        data = JSON.parse(possibly_titles['data']);
        if(count>0){
            url_base+=`&title=${data['title1']}`;
            for(ziiz = 2; ziiz<=count; ziiz++){
                url_base+=`+${data[`title${ziiz}`]}`;
            }
            create_products(url_base);
            fixGrid();
    } else{
        delete_products();
        fixGrid();
    }
    }else{
        setTimeout(()=>{
        price_slider = document.getElementById('price-box').children[2].children[0]
        max_price = price_slider.children[2].value;
        min_price = price_slider.children[3].value;
        current_filter['max_price'] = 30000;
        current_filter['min_price'] = min_price;
        showFiltredProducts(15, 0, 'no products')}, 300);
    }
}

create_and_fill_filters();
try_to_search();
activateShowProductsBtn();