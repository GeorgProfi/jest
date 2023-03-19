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