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

const slider = document.getElementById('slider');
const wrapper = slider.querySelector('.slider__wrapper');
const slides = Array.from(wrapper.children);
const dotsContainer = slider.querySelector('.slider__dots');

slides.forEach(() => {
    const dot = document.createElement('div');
    dot.classList.add('slider__dot');
    dotsContainer.appendChild(dot);
  });

  const dots = slider.querySelectorAll('.slider__dot');

let isDragging = false;
let startX, scrollStart, currentIndex = 0, swipeDirection = '';
const swipeThreshold = 0.3; 

function updateActiveSlide(newIndex) {
  currentIndex = Math.max(0, Math.min(newIndex, slides.length - 1));

  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentIndex);
    dots[index].classList.toggle('active', index === currentIndex);

    if (index < currentIndex) {
      slide.classList.remove('right');
      slide.classList.add('left');
    } else if (index > currentIndex) {
      slide.classList.remove('left');
      slide.classList.add('right');
    } else {
      slide.classList.remove('left', 'right');
    }
  });

  wrapper.scrollTo({
    left: currentIndex * slides[0].offsetWidth,
    behavior: 'smooth'
  });
}

function handleStart(e) {
  isDragging = true;
  startX = e.pageX || e.touches[0].pageX;
  scrollStart = wrapper.scrollLeft;
  slider.style.cursor = 'grabbing';
}

function handleMove(e) {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX || e.touches[0].pageX;
  const walk = (x - startX) * 1.5;
  wrapper.scrollLeft = scrollStart - walk;

  swipeDirection = walk > 0 ? 'left' : 'right';
}

function handleEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  slider.style.cursor = 'grab';

  const endX = e.pageX || e.changedTouches[0].pageX;
  const moveDistance = endX - startX;
  const cardWidth = slides[0].offsetWidth;

  if (Math.abs(moveDistance) >= cardWidth * swipeThreshold) {
    if (moveDistance < 0 && currentIndex < slides.length - 1) {
      updateActiveSlide(currentIndex + 1); 
    } else if (moveDistance > 0 && currentIndex > 0) {
      updateActiveSlide(currentIndex - 1); 
    }
  } else {
    updateActiveSlide(currentIndex);
  }
}

wrapper.addEventListener('mousedown', handleStart);
wrapper.addEventListener('mousemove', handleMove);
wrapper.addEventListener('mouseup', handleEnd);
wrapper.addEventListener('mouseleave', () => {
  isDragging = false;
  slider.style.cursor = 'grab';
});

wrapper.addEventListener('touchstart', handleStart);
wrapper.addEventListener('touchmove', handleMove);
wrapper.addEventListener('touchend', handleEnd);

updateActiveSlide(currentIndex);

//modal

const modal = document.getElementById('modal');
const openModalBtns = document.querySelectorAll('#openModal');
const closeModalBtn = document.querySelector('#modal__form-cross');

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

document.querySelector('.modal__form-tel').addEventListener('input', function (e) {
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
});
