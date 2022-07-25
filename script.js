'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const navLink = document.querySelector('.nav__link');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// /// Button Scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  //   // const s1coords = section1.getBoundingClientRect();
  //   // console.log(s1coords);
  //   // console.log(e.target.getBoundingClientRect());
  //   // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  //   // Scrolling
  //   // window.scrollTo(
  //   //   s1coords.left + window.pageXOffset,
  //   //   s1coords.top + window.pageYOffset
  //   // );
  //   // window.scrollTo({
  //   //   left: s1coords.left + window.pageXOffset,
  //   //   top: s1coords.top + window.pageYOffset,
  //   //   behavior: 'smooth',
  //   // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

/// Cookie message
const header = document.querySelector('.header');
const message = document.createElement('div');
// console.log(message);
message.style.width = '100%';
message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analytics';
message.innerHTML =
  'We use cookies for improved functionality and analytics <button class="btn btn--close--cookie"> Got it! </button>';
header.append(message); // inserting message in HTML up on the first element
// // header.append(message); // inserting message in HTML down on the last element
// // // but message can exist only in one plece, because te DOM elements are uniqe
// // // but we cam make a copy
// // header.append(message.cloneNode(true));

// // // also there are
// header.before(message);
// // header.after(message);

// // /// Delete element
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function (e) {
    e.preventDefault();
    message.remove();
  });

/// Page Navigation
// document.querySelectorAll('.nav__link').forEach(link =>
//   link.addEventListener('click', function (e) {
//     e.preventDefault();
//     // console.log('link');
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );

/// Event Delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/// Tabbed component

// console.log(tabs);
// console.log(tabContainer);
// console.log(tabsContent);

tabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  //  Guard clause
  if (!clicked) return;

  //  Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //  Activate content area
  tabsContent.forEach(tC => tC.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active'); // .tab is word that go after data (in html data-tab='2 or another')
  // console.log(clicked.dataset.tab);
});

/// Menu fade animation
const handleHover = function (e, opacity) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    // console.log(siblings);
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

// /// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// // console.log(initialCoords.top);

// window.addEventListener('scroll', function (e) {
//   // console.log(this.window.scrollY);

//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });

/// Sticky navigation: Intersection Observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const stickyNav = function (enries) {
  const [entry] = enries;
  // console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${-navHeight}px`,
});
headerObserver.observe(header);

/// Revealing Section
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: [0.2],
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

/// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImage = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

/// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (slide, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(d => d.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  const initData = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };
  initData();

  // Next slide
  const nextSlide = function () {
    if (currentSlide == maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (currentSlide == 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key == 'ArrowRight') {
      nextSlide();
    }
    if (e.key == 'ArrowLeft') {
      prevSlide();
    }
  });

  // Event Delegation for Dots
  dotContainer.addEventListener('click', function (e) {
    e.preventDefault();
    // console.log(e.target);

    if (e.target.classList.contains('dots__dot')) {
      console.log('dot');
      const { slide } = e.target.dataset;
      // console.log(slide);
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
////////////////////////////////////////////////////////////////////////////////////

// /// Selecting, Creating and Deleting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// console.log(document.getElementById('section--1'));
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// /// Creating and inserting elements
//  .insertAdjacentHTML

// /// Styles, Attributes and Classes
// //  Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// message.style.opacity = '100%';
// console.log(getComputedStyle(message).color);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
// console.log(message.style.height);

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo);
// console.log(logo.src);

// logo.alt = 'Beautiful minimalist logo';
// logo.setAttribute('company', 'Bankist');

// // Non-standart, not work
// console.log(logo.designer);

// //work:
// console.log(logo.getAttribute('designer'));

// //  Data attributes
// console.log(logo.dataset.versionNumber);

// //  Classes
// logo.classList.add('class1', 'class2');

// /// Types of Events and Event Handlers

// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading)');
// };
// h1.addEventListener('mouseenter', alertH1);

// // h1.onmousemove = function (e) {
// //   alert('onmousemove: good');
// // };

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 5000);

// /// Event Propagation
// // rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor);

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Link', e.target, e.currentTarget);
//   // stop propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Links', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Nav', e.target, e.currentTarget);
// });

// /// DOM Traversing
// //  Going downwards: child
// const h1 = document.querySelector('h1');
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// //  Going upwards: parents
// console.log(h1.parentElement);
// console.log(h1.parentNode);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// //  Going sideways: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!');
});
