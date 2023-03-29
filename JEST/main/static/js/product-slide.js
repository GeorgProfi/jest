let images = document.querySelectorAll('.swiper-slide img');
let current = 0;
let slide = document.querySelectorAll('.focus-slide a img');

function slider() {
  for (let i = 0; i < images.length; i++) {
    images[i].classList.add('opacity0');
    slide[i].classList.add('border0');
  }
  images[current].classList.remove('opacity0');
  slide[current].classList.remove('border0');
  console.log(current);
}

document.querySelector('.arrow-btn-l').onclick = function() {
  if (current - 1 == -1) {
    current = images.length - 1;
  }
  else {
    current--;
  }
  slider();
};
document.querySelector('.arrow-btn-r').onclick = function() {
  if (current + 1 == images.length) {
    current = 0;
  }
  else {
    current++;
  }
  slider();
};

function OnClickSlide(event, current) {
  event.preventDefault();
  if (current = 0) {
    slider();
  }
  else {
    if (current = 1) {
      slider();
    }
    else {
      slider();
    }
  }
}


