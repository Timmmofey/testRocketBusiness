//videoplayer
const playButton = document.querySelector('.video__play-button');
const preview = document.querySelector('.video__preview')

playButton.addEventListener('click', function() {
    var iframe = document.querySelector('iframe');
    var iframeSrc = iframe.src;
    
    if (iframeSrc.indexOf('autoplay=1') === -1) {
        iframe.src += '&autoplay=1';
    }

    playButton.style.display = 'none';
    preview.style.display = 'none'
});

//slider

const sliderWrapper = document.querySelector('.slider__wrapper');
const cards = document.querySelectorAll('.small-card--slider');
const dotsContainer = document.querySelector('.slider__dots');

let isDragging = false;
let startX, scrollStart, currentIndex = 0, swipeDirection = '';
const swipeThreshold = 0.3;
const gap = 16;

cards.forEach(() => {
  const dot = document.createElement('div');
  dot.classList.add('slider__dot');
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.slider__dot');

function updateSlider() {
  const cardWidth = cards[0].offsetWidth;
    
  const offset = -(currentIndex * (cardWidth + gap) - (window.innerWidth - cardWidth) / 2);
  sliderWrapper.style.transform = `translateX(${offset}px)`;

  cards.forEach((card, index) => {
    card.classList.toggle('active', index === currentIndex);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

function handleStart(e) {
  isDragging = true;
  startX = e.pageX || e.touches[0].pageX;
  scrollStart = sliderWrapper.scrollLeft;
  sliderWrapper.style.cursor = 'grabbing';
}

function handleMove(e) {
  if (!isDragging) return;
  e.preventDefault();
  
  const x = e.pageX || e.touches[0].pageX;
  const walk = (x - startX) * 1.5;

  sliderWrapper.scrollLeft = scrollStart - walk;

  swipeDirection = walk > 0 ? 'left' : 'right';
}

function handleEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  sliderWrapper.style.cursor = 'grab';

  const endX = e.pageX || e.changedTouches[0].pageX;
  const moveDistance = endX - startX;
  const cardWidth = cards[0].offsetWidth;

  if (Math.abs(moveDistance) >= cardWidth * swipeThreshold) {
    if (moveDistance < 0 && currentIndex < cards.length - 1) {
      currentIndex++;
    } else if (moveDistance > 0 && currentIndex > 0) {
      currentIndex--;
    }
  }

  updateSlider();
}

sliderWrapper.addEventListener('mousedown', handleStart);
sliderWrapper.addEventListener('mousemove', handleMove);
sliderWrapper.addEventListener('mouseup', handleEnd);

sliderWrapper.addEventListener('touchstart', handleStart);
sliderWrapper.addEventListener('touchmove', handleMove);
sliderWrapper.addEventListener('touchend', handleEnd);

updateSlider();

window.addEventListener('resize', updateSlider);

//modal

const modal = document.getElementById('modal');
const openModalBtns = document.querySelectorAll('.openModal');
const closeModalBtn = document.querySelector('#modal__form-cross');
const form = document.querySelector('.modal__form');
const nameInput = document.querySelector('.modal__form-name');
const telInput = document.querySelector('.modal__form-tel');
const submitBtn = document.querySelector('.modal__form-submit');
const errorMessages = document.querySelectorAll('.error-message');

function openModal() {
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
}

openModalBtns.forEach(btn => {
  btn.addEventListener('click', openModal);
});

closeModalBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

telInput.addEventListener('input', function (e) {
  let input = e.target.value.replace(/\D/g, '');
  let formatted = '';

  if (input.length > 0) {
    formatted += '+7 (';
  }
  if (input.length > 1) {
    formatted += input.substring(1, 4);
  }
  if (input.length >= 5) {
    formatted += ') ' + input.substring(4, 7);
  }
  if (input.length >= 8) {
    formatted += '-' + input.substring(7, 9);
  }
  if (input.length >= 10) {
    formatted += '-' + input.substring(9, 11);
  }

  e.target.value = formatted;
  validateForm();
});

function validateForm() {
  let nameIsValid = false;
  let telIsValid = false;

  if (nameInput.value.trim() === '') {
    nameInput.classList.add('error');
    submitBtn.setAttribute("disabled")
    errorMessages[0].style.display = 'block';
    nameIsValid = false;
    submitBtn.setAttribute('disabled')
  } else {
    nameInput.classList.remove('error');
    errorMessages[0].style.display = 'none';
    nameIsValid = true;
  }

  if (telInput.value.trim() === '' || telInput.value.length < 18) { 
    telInput.classList.add('error');
    errorMessages[1].style.display = 'block';
    telIsValid = false;
    submitBtn.setAttribute('disabled')
  } else {
    telInput.classList.remove('error');
    errorMessages[1].style.display = 'none';
    telIsValid = true;
  }

  if (telIsValid && nameIsValid) {
    submitBtn.removeAttribute('disabled');
  }
}

nameInput.addEventListener('input', validateForm);
telInput.addEventListener('input', validateForm);

form.addEventListener('submit', function(e) {
  e.preventDefault();
  validateForm();
  
  if (!submitBtn.disabled) {
    form.reset();
    validateForm();
    closeModal();
  }
});
