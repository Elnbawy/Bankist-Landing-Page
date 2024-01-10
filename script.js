'use strict';

///////////////////////////////////////
// Modal window
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const navBar = document.querySelector('.nav__links');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const sections = document.querySelectorAll('.section');
const images = document.querySelectorAll('img[data-src]');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const operationsContainer = document.querySelector(
  '.operations__tab-container'
);
const operationsTab = document.querySelectorAll('.operations__tab');
const operationsContent = document.querySelectorAll('.operations__content');
const s1Coordinates = section1.getBoundingClientRect();
const navHeight = nav.getBoundingClientRect().height;
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
let currSlide = 0;
const maxSlide = slides.length - 1;
const dots = document.querySelector('.dots');
let slide;
///////////////////////////////////
//Functions

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//create menu animation function to use in both mouseover and mouseout events
const menuAnimation = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    siblings.forEach(l => {
      if (l !== link) l.style.opacity = this;
    });
  }
};

//sticky navbar function
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//sections animation function

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});

sections.forEach(s => {
  sectionsObserver.observe(s);
  s.classList.add('section--hidden');
});

//lazy loading images

const lazyLoad = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};

const imagesObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '100px',
});

images.forEach(img => imagesObserver.observe(img));

//slider functions

const goToSlide = function (currSlide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - currSlide)}%)`)
  );
};
goToSlide(0);

const nextSlide = function () {
  if (currSlide === maxSlide) {
    currSlide = 0;
  } else currSlide++;
  goToSlide(currSlide);
  activateDots(currSlide);
};

const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide;
  } else currSlide--;
  goToSlide(currSlide);
  activateDots(currSlide);
};

//slider dots
const createDots = function () {
  slides.forEach((_, i) =>
    dots.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    )
  );
};
createDots();

const activateDots = function (slide) {
  document
    .querySelectorAll(`.dots__dot`)
    .forEach(d => d.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activateDots(0);

////////////////////////////
//Event handlers

btnScrollTo.addEventListener('click', function () {
  window.scrollTo({
    left: s1Coordinates.left + window.scrollX,
    top: s1Coordinates.top + window.scrollY,
    behavior: 'smooth',
  });
});

//smooth scroll for navbar links
navBar.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

//tabbed components change
operationsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  //tab change
  operationsTab.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //content change
  operationsContent.forEach(o =>
    o.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//modals open and close animation
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Navigation bar animation
navBar.addEventListener('mouseover', menuAnimation.bind(0.5));
navBar.addEventListener('mouseout', menuAnimation.bind(1));

//slider
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    nextSlide();
  }
  if (e.key === 'ArrowLeft') {
    prevSlide();
  }
});

dots.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDots(slide);
  }
});

//sticky navbar
// window.addEventListener('scroll', function () {
//   if (
//     this.document.querySelector('.header__title').getBoundingClientRect().top <
//     window.scrollY
//   ) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });
