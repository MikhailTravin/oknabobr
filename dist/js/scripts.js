const modules_flsModules = {};

let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    setTimeout((() => {
      lockPaddingElements.forEach((lockPaddingElement => {
        lockPaddingElement.style.paddingRight = "";
      }));
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("lock");
    }), delay);
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    }));
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
function functions_FLS(message) {
  setTimeout((() => {
    if (window.FLS) console.log(message);
  }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
  if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function (item) {
    return item.dataset[dataSetValue];
  });

  if (media.length) {
    const breakpointsArray = media.map(item => {
      const params = item.dataset[dataSetValue];
      const paramsArray = params.split(",");
      return {
        value: paramsArray[0],
        type: paramsArray[1] ? paramsArray[1].trim() : "max",
        item: item
      };
    });

    const mdQueries = uniqArray(
      breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
    );

    const mdQueriesArray = mdQueries.map(breakpoint => {
      const [query, value, type] = breakpoint.split(",");
      const matchMedia = window.matchMedia(query);
      const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
      return { itemsArray, matchMedia };
    });

    return mdQueriesArray;
  }
}

function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

//========================================================================================================================================================

// Проверка input на заполненность
let inputs = document.querySelectorAll('input');
if (inputs) {
  inputs.forEach(input => {
    input.addEventListener('input', function () {
      const parent = this.parentElement;
      if (this.value.trim() !== '') {
        parent.classList.add('filled');
      } else {
        parent.classList.remove('filled');
      }
    });
  });
}

//========================================================================================================================================================

//Маска телефона
const telephone = document.querySelectorAll('.telephone');
if (telephone) {
  Inputmask({ "mask": "+7 (999) 999 - 99 - 99" }).mask(telephone);
}

//========================================================================================================================================================

//Меню
const iconMenu = document.querySelector('.icon-menu');
const headerTop = document.querySelector('.top-header__body');
if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    e.stopPropagation();
    document.documentElement.classList.toggle("menu-open");
    document.documentElement.classList.remove("catalog-open");
  });
  document.addEventListener('click', function (e) {
    const isClickInsideHeaderTop = headerTop && headerTop.contains(e.target);
    const isClickOnMenuIcon = e.target === iconMenu || iconMenu.contains(e.target);

    if (!isClickInsideHeaderTop && !isClickOnMenuIcon) {
      document.documentElement.classList.remove("menu-open");
    }
  });
}

const catalogMenu = document.querySelector('.bottom-header__catalog');
const catalogBody = document.querySelector('.bottom-header__body');
if (catalogMenu) {
  catalogMenu.addEventListener("click", function (e) {
    e.stopPropagation();
    document.documentElement.classList.toggle("catalog-open");
    document.documentElement.classList.remove("menu-open");
  });
  document.addEventListener('click', function (e) {
    const isClickInsideHeaderBody = catalogBody && catalogBody.contains(e.target);
    const isClickOnMenuIcon = e.target === catalogMenu || catalogMenu.contains(e.target);

    if (!isClickInsideHeaderBody && !isClickOnMenuIcon) {
      document.documentElement.classList.remove("catalog-open");
    }
  });
}

let searchButton = document.querySelector('.search__button');
if (searchButton) {
  searchButton.addEventListener("click", function (e) {
    this.closest('.search').classList.toggle('_active');
  });
}

//Каталог
const headerTitles = document.querySelector('.catalog-bottom-header__titles');

if (headerTitles) {
  // Функция открытия каталога
  function openCatalog() {
    document.documentElement.classList.add('catalog-open');
  }

  // Функция закрытия каталога
  function closeCatalog() {
    document.documentElement.classList.remove('catalog-open');
  }

  // Обработчик клика на заголовок
  headerTitles.addEventListener('click', function (e) {
    e.stopPropagation(); // Предотвращаем всплытие, чтобы не сработал document
    if (document.documentElement.classList.contains('catalog-open')) {
      closeCatalog();
    } else {
      openCatalog();
    }
  });

  // Обработчик клика по документу (закрытие при клике вне)
  document.addEventListener('click', function (e) {
    if (document.documentElement.classList.contains('catalog-open') && !headerTitles.contains(e.target)) {
      closeCatalog();
    }
  });
}

// Добавление к шапке при скролле
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
      header.classList.add('_header-scroll');
    } else {
      header.classList.remove('_header-scroll');
    }
  });
}

//========================================================================================================================================================

Fancybox.bind("[data-fancybox]", {
  // опции
});

//========================================================================================================================================================

document.addEventListener('DOMContentLoaded', () => {
  const revealClasses = ['title1', 'title2'];
  const visibleClass = 'is-visible';
  const isMobile = window.innerWidth < 768;

  const style = document.createElement('style');
  style.textContent = revealClasses.map(cls => `
    .${cls} {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
      transition-delay: 0.12s;
      will-change: opacity, transform;
    }
    .${cls}.${visibleClass} {
      opacity: 1;
      transform: translateY(0);
    }
  `).join('\n');
  document.head.appendChild(style);

  const excludedSelectors = ['.no-reveal', '.disable-reveal'];

  function isExcluded(el) {
    return excludedSelectors.some(sel =>
      el.matches(sel) || el.closest(sel)
    );
  }

  const revealElements = revealClasses.flatMap(cls =>
    Array.from(document.querySelectorAll(`.${cls}`))
  );

  revealElements.forEach(el => {
    if (isMobile && isExcluded(el)) {
      revealClasses.forEach(cls => el.classList.remove(cls));
      // Сброс inline-стилей
      el.style.opacity = '';
      el.style.transform = '';
      el.style.transition = '';
      el.style.willChange = '';
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
        } else {
          entry.target.classList.remove(visibleClass);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      if (!(isMobile && isExcluded(el))) {
        observer.observe(el);
      }
    });
  } else {
    console.warn('IntersectionObserver не поддерживается в этом браузере.');
  }
});

//========================================================================================================================================================

if (document.querySelector('.block-intro__slider')) {
  const swiperIntro = new Swiper('.block-intro__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 600,
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    autoplay: {
      delay: 3000,
    },
    navigation: {
      prevEl: '.block-intro__arrow-prev',
      nextEl: '.block-intro__arrow-next',
    },
    pagination: {
      el: '.block-intro__pagination',
      clickable: true,
    },
  });
}

if (document.querySelector('.block-before-after__slider')) {
  const swiperBeforeAfter = new Swiper('.block-before-after__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1.1,
    spaceBetween: 10,
    speed: 400,
    navigation: {
      prevEl: '.block-before-after__arrow-prev',
      nextEl: '.block-before-after__arrow-next',
    },
    breakpoints: {
      600: {
        slidesPerView: 1.5,
        spaceBetween: 15,
      },
      992: {
        slidesPerView: 1.7,
        spaceBetween: 30,
      },
      1100: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    },
  });
}

if (document.querySelector('.slider1')) {
  const swiperSlider1 = new Swiper('.slider1', {
    observer: true,
    observeParents: true,
    slidesPerView: 'auto',
    speed: 400,
    navigation: {
      prevEl: '.slider1-arrow-prev',
      nextEl: '.slider1-arrow-next',
    },
  });
}

if (document.querySelector('.block-banners__slider')) {
  const swiperBanners = new Swiper('.block-banners__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1.1,
    spaceBetween: 10,
    speed: 400,
    navigation: {
      prevEl: '.block-banners__arrow-prev',
      nextEl: '.block-banners__arrow-next',
    },
    breakpoints: {
      600: {
        slidesPerView: 1.5,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 1.7,
        spaceBetween: 15,
      },
      1400: {
        slidesPerView: 2.2,
        spaceBetween: 30,
      },
      1770: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    },
  });
}

//========================================================================================================================================================

//Фильтр
const filterButtons = document.querySelectorAll('.filter-nav__button');
const filterCards = document.querySelectorAll('.card-product');

if (filterButtons) {
  function filterCardsHandler(filterValue) {
    filterButtons.forEach(button => {
      if (button.getAttribute('data-filter') === filterValue) {
        button.classList.add('_active');
      } else {
        button.classList.remove('_active');
      }
    });

    filterCards.forEach(card => {
      const cardFilter = card.getAttribute('data-filter');

      if (filterValue === 'all' || cardFilter === filterValue) {
        card.classList.remove('_hide');
      } else {
        card.classList.add('_hide');
      }
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      const filterValue = this.getAttribute('data-filter');
      filterCardsHandler(filterValue);
    });
  });

  filterCardsHandler('all');
}

//========================================================================================================================================================

//Звездный рейтинг
function formRating() {
  const ratings = document.querySelectorAll('[data-rating]');
  if (ratings) {
    ratings.forEach(rating => {
      const ratingValue = +rating.dataset.ratingValue;
      const ratingSize = +rating.dataset.ratingSize ? +rating.dataset.ratingSize : 5;
      formRatingInit(rating, ratingSize);
      ratingValue ? formRatingSet(rating, ratingValue) : null;
      document.addEventListener('click', formRatingAction);
    });
  }

  function formRatingAction(e) {
    const targetElement = e.target;
    if (targetElement.closest('.rating__input')) {
      const currentElement = targetElement.closest('.rating__input');
      const ratingValue = +currentElement.value;
      const rating = currentElement.closest('.rating');
      const ratingSet = rating.dataset.rating === 'set';
      ratingSet ? formRatingGet(rating, ratingValue) : null;
    }
  }

  function formRatingInit(rating, ratingSize) {
    let ratingItems = ``;
    for (let index = 0; index < ratingSize; index++) {
      index === 0 ? ratingItems += `<div class="rating__items">` : null;
      ratingItems += `
                <label class="rating__item">
                    <input class="rating__input" type="radio" name="rating" value="${index + 1}">
                </label>`;
      index === ratingSize ? ratingItems += `</div">` : null;
    }
    rating.insertAdjacentHTML("beforeend", ratingItems);
  }

  function formRatingGet(rating, ratingValue) {
    const resultRating = ratingValue;
    formRatingSet(rating, resultRating);
  }

  function formRatingSet(rating, value) {
    const ratingItems = rating.querySelectorAll('.rating__item');
    const resultFullItems = parseInt(value);
    const resultPartItem = value - resultFullItems;

    rating.hasAttribute('data-rating-title') ? rating.title = value : null;

    ratingItems.forEach((ratingItem, index) => {
      ratingItem.classList.remove('rating__item--active');
      ratingItem.querySelector('span') ? ratingItems[index].querySelector('span').remove() : null;

      if (index <= (resultFullItems - 1)) {
        ratingItem.classList.add('rating__item--active');
      }
      if (index === resultFullItems && resultPartItem) {
        ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`);
      }
    });
  }

  function formRatingSend() {
  }
}
formRating();

//========================================================================================================================================================

//До-после
class BeforeAfter {
  constructor(props) {
    let defaultConfig = {
      init: true,
      logging: true,
      swiper: null
    };
    this.config = Object.assign(defaultConfig, props);

    if (this.config.init) {
      const beforeAfterItems = document.querySelectorAll('[data-ba]');
      if (beforeAfterItems.length > 0) {
        this.beforeAfterInit(beforeAfterItems);
      }
    }
  }

  beforeAfterInit(beforeAfterItems) {
    beforeAfterItems.forEach(beforeAfter => {
      if (beforeAfter) {
        this.beforeAfterClasses(beforeAfter);
        this.beforeAfterItemInit(beforeAfter);
      }
    });
  }

  beforeAfterClasses(beforeAfter) {
    beforeAfter.addEventListener('mouseover', function (e) {
      const targetElement = e.target;
      if (!targetElement.closest('[data-ba-arrow]')) {
        if (targetElement.closest('[data-ba-before]')) {
          beforeAfter.classList.remove('_right');
          beforeAfter.classList.add('_left');
        } else {
          beforeAfter.classList.add('_right');
          beforeAfter.classList.remove('_left');
        }
      }
    });

    beforeAfter.addEventListener('mouseleave', function () {
      beforeAfter.classList.remove('_left');
      beforeAfter.classList.remove('_right');
    });
  }

  beforeAfterItemInit(beforeAfter) {
    const beforeAfterArrow = beforeAfter.querySelector('[data-ba-arrow]');
    const afterItem = beforeAfter.querySelector('[data-ba-after]');

    if (!beforeAfterArrow || !afterItem) return;

    const beforeAfterArrowWidth = parseFloat(
      window.getComputedStyle(beforeAfterArrow).getPropertyValue('width')
    );

    const handler = isMobile.any() ? 'touchstart' : 'mousedown';
    beforeAfterArrow.addEventListener(handler, (e) => {
      this.handleDragStart(e, beforeAfter, afterItem, beforeAfterArrowWidth);
    });
  }

  handleDragStart(e, beforeAfter, afterItem, arrowWidth) {
    e.preventDefault();
    e.stopPropagation();

    const swiperInstance = this.config.swiper;

    if (swiperInstance && typeof swiperInstance === 'object') {
      swiperInstance.allowTouchMove = false;
    }

    const sizes = {
      width: beforeAfter.offsetWidth,
      left: beforeAfter.getBoundingClientRect().left - scrollX
    };

    const moveHandler = (eMove) => {
      this.handleMouseMove(eMove, beforeAfter, afterItem, arrowWidth, sizes);
    };

    const endHandler = () => {
      document.removeEventListener(isMobile.any() ? 'touchmove' : 'mousemove', moveHandler);
      if (swiperInstance && typeof swiperInstance === 'object') {
        swiperInstance.allowTouchMove = true;
      }
    };

    if (isMobile.any()) {
      document.addEventListener('touchmove', moveHandler);
      document.addEventListener('touchend', endHandler, { once: true });
    } else {
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', endHandler, { once: true });
    }

    document.addEventListener('dragstart', (eDrag) => {
      eDrag.preventDefault();
    }, { once: true });
  }

  handleMouseMove(e, beforeAfter, afterItem, arrowWidth, sizes) {
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const posLeft = clientX - sizes.left;

    if (posLeft >= 0 && posLeft <= sizes.width) {
      const way = (posLeft / sizes.width) * 100;
      const arrowLeft = `calc(${way}% - ${arrowWidth}px)`;

      beforeAfter.querySelector('[data-ba-arrow]').style.cssText =
        `left:${arrowLeft}; transform: translate(50%, -50%);`;
      afterItem.style.cssText = `width: ${100 - way}%`;
    } else if (posLeft < 0) {
      beforeAfter.querySelector('[data-ba-arrow]').style.cssText = `left: 0%`;
      afterItem.style.cssText = `width: 100%`;
    } else if (posLeft > sizes.width) {
      beforeAfter.querySelector('[data-ba-arrow]').style.cssText =
        `left: calc(100% - ${arrowWidth}px)`;
      afterItem.style.cssText = `width: 0%`;
    }
  }
}
modules_flsModules.ba = new BeforeAfter({});

//========================================================================================================================================================

//Спойлер
function spollers() {
  const spollersArray = document.querySelectorAll("[data-spollers]");
  if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter((function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    }));
    if (spollersRegular.length) initSpollers(spollersRegular);

    spollersArray.forEach(spollersBlock => {
      const mediaQuery = spollersBlock.dataset.spollers;
      if (mediaQuery) {
        const [maxWidth, type] = mediaQuery.split(",");
        const width = parseInt(maxWidth);

        if (type === "max" && window.innerWidth <= width) {
          if (!spollersBlock.classList.contains("_spoller-init")) {
            initSpollers([spollersBlock]);
          }
        } else if (type === "max" && window.innerWidth > width) {
          if (spollersBlock.classList.contains("_spoller-init")) {
            spollersBlock.classList.remove("_spoller-init");
            initSpollerBody(spollersBlock, false);
            spollersBlock.removeEventListener("click", setSpollerAction);
          }
        }
      }
    });

    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach((spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("_spoller-init");
          initSpollerBody(spollersBlock);
          spollersBlock.addEventListener("click", setSpollerAction);
        } else {
          spollersBlock.classList.remove("_spoller-init");
          initSpollerBody(spollersBlock, false);
          spollersBlock.removeEventListener("click", setSpollerAction);
        }
      }));
    }

    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
      if (spollerTitles.length) {
        spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
        spollerTitles.forEach((spollerTitle => {
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerTitle.classList.contains("_spoller-active")) {
              spollerTitle.nextElementSibling.hidden = true;
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            spollerTitle.nextElementSibling.hidden = false;
          }
        }));
      }
    }

    function setSpollerAction(e) {
      const el = e.target;
      if (el.closest("[data-spoller]")) {
        const spollerTitle = el.closest("[data-spoller]");

        const spollerItem = spollerTitle.closest(".spollers__item, .menu__item");
        const spollersBlock = spollerTitle.closest("[data-spollers]");

        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

        if (!spollersBlock.querySelectorAll("._slide").length) {
          if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) {
            hideSpollersBody(spollersBlock);
          }

          spollerTitle.classList.toggle("_spoller-active");
          if (spollerItem) spollerItem.classList.toggle("_spoller-active");

          const contentBlock = spollerTitle.nextElementSibling;
          _slideToggle(contentBlock, spollerSpeed);

          e.preventDefault();
        }
      }
    }

    function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
      if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
        const spollerItem = spollerActiveTitle.closest(".spollers__item, .menu__item");

        spollerActiveTitle.classList.remove("_spoller-active");
        if (spollerItem) spollerItem.classList.remove("_spoller-active");
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
      }
    }

    const spollersClose = document.querySelectorAll("[data-spoller-close]");
    if (spollersClose.length) {
      document.addEventListener("click", (function (e) {
        const el = e.target;
        if (!el.closest("[data-spollers]")) {
          spollersClose.forEach((spollerClose => {
            const spollersBlock = spollerClose.closest("[data-spollers]");
            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
            spollerClose.classList.remove("_spoller-active");

            const spollerItem = spollerClose.closest(".spollers__item, .menu__item");
            if (spollerItem) spollerItem.classList.remove("_spoller-active");

            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
          }));
        }
      }));
    }
  }
}
spollers();
window.addEventListener('resize', function () {
  spollers();
});

//========================================================================================================================================================

//Калькулятор
function initCalculatorSwitcher() {
  // Объект для хранения значений слайдеров для каждого окна
  const sliderValues = {
    '1': { vert: 1200, horiz: 860 },
    '2': { vert: 1500, horiz: 1000 },
    '3': { vert: 1800, horiz: 1200 },
    '4': { vert: 2000, horiz: 800 }
  };

  let ratingVert, ratingHoriz;
  let currentWindow = '1';
  let isProgrammaticChange = false;
  let isInitialized = false;

  function initSliders(windowNumber) {
    const values = sliderValues[windowNumber];

    if (ratingVert) {
      ratingVert.destroy();
      ratingVert = null;
    }
    if (ratingHoriz) {
      ratingHoriz.destroy();
      ratingHoriz = null;
    }

    const vertSlider = document.querySelector('.range-vert');
    if (vertSlider) {
      try {
        ratingVert = noUiSlider.create(vertSlider, {
          start: [values.vert],
          connect: true,
          orientation: 'vertical',
          range: {
            'min': 500,
            'max': 3000
          },
          format: wNumb({
            decimals: 0,
            suffix: ' мм'
          }),
          tooltips: true
        });
      } catch (error) {
      }
    } 

    const horizSlider = document.querySelector('.range-horiz');
    if (horizSlider) {
      try {
        ratingHoriz = noUiSlider.create(horizSlider, {
          start: [values.horiz],
          connect: true,
          range: {
            'min': 500,
            'max': 3000
          },
          format: wNumb({
            decimals: 0,
            suffix: ' мм'
          }),
          tooltips: true
        });
      } catch (error) {
      }
    }
  }

  function saveSliderValues(windowNumber) {
    if (ratingVert && ratingHoriz) {
      sliderValues[windowNumber] = {
        vert: parseInt(ratingVert.get()),
        horiz: parseInt(ratingHoriz.get())
      };
    }
  }

  function switchWindow(windowNumber, isFromSelect = false) {
    if (currentWindow === windowNumber && isInitialized) return;

    if (currentWindow && isInitialized) {
      saveSliderValues(currentWindow);
    }

    document.querySelectorAll('.top-calculator-descr__image').forEach(img => {
      img.classList.remove('_active');
    });

    const targetImage = document.querySelector(`.top-calculator-descr__image[data-window="${windowNumber}"]`);
    if (targetImage) {
      targetImage.classList.add('_active');
    }

    const calculatorLeft = document.querySelector('.top-calculator__left');
    if (calculatorLeft) {
      calculatorLeft.setAttribute('data-window', windowNumber);
    }

    if (!isFromSelect) {
      const select = document.querySelector('select[name="form[]"]');
      if (select && select.value !== windowNumber) {
        isProgrammaticChange = true;
        select.value = windowNumber;
      }
    }

    const calculatorSelect = document.querySelector('.top-calculator__left .select');
    if (calculatorSelect) {
      const customSelectOptions = calculatorSelect.querySelectorAll('.select__option');
      const customSelectContent = calculatorSelect.querySelector('.select__content');

      customSelectOptions.forEach(option => {
        option.classList.remove('_selected');
        if (option.getAttribute('data-value') === windowNumber) {
          option.classList.add('_selected');
          if (customSelectContent) {
            customSelectContent.textContent = option.textContent.trim();
          }
        }
      });

      const selectValue = calculatorSelect.querySelector('.select__title .select__value');
      if (selectValue) {
        const selectedOption = calculatorSelect.querySelector('.select__option._selected');
        if (selectedOption) {
          const contentElement = selectValue.querySelector('.select__content');
          if (contentElement) {
            contentElement.textContent = selectedOption.textContent.trim();
          }

          const optionImage = selectedOption.querySelector('.select__image');
          const currentImage = selectValue.querySelector('.select__image');

          if (optionImage) {
            const imageSrc = optionImage.getAttribute('src');
            if (currentImage) {
              currentImage.src = imageSrc;
            } else {
              const newImage = document.createElement('img');
              newImage.src = imageSrc;
              newImage.alt = '';
              newImage.className = 'select__image';
              selectValue.insertBefore(newImage, contentElement);
            }
          } else if (currentImage) {
            currentImage.remove();
          }
        }
      }
    }

    document.querySelectorAll('.options__input').forEach(radio => {
      radio.checked = radio.getAttribute('data-window') === windowNumber;
    });

    initSliders(windowNumber);

    currentWindow = windowNumber;
    isInitialized = true; 
  }

  function handleResize() {
    if (window.innerWidth <= 650) {
      switchWindow('1');
    } else {
      const activeRadio = document.querySelector('.options__input:checked');
      if (activeRadio) {
        switchWindow(activeRadio.getAttribute('data-window'));
      } else {
        switchWindow(currentWindow);
      }
    }
  }

  function init() {

    if (window.innerWidth <= 650) {
      currentWindow = '1';
    } else {
      const initiallyChecked = document.querySelector('.options__input:checked');
      if (initiallyChecked) {
        currentWindow = initiallyChecked.getAttribute('data-window');
      }
    }

    switchWindow(currentWindow);

    document.querySelectorAll('.options__input').forEach(radio => {
      radio.addEventListener('change', function () {
        if (this.checked) {
          const windowNumber = this.getAttribute('data-window');
          if (window.innerWidth > 650) {
            switchWindow(windowNumber);
          }
        }
      });
    });

    document.querySelector('select[name="form[]"]')?.addEventListener('change', function () {
      if (!isProgrammaticChange) {
        switchWindow(this.value, true);
      }
      isProgrammaticChange = false;
    });

    document.querySelectorAll('.top-calculator__left .select__option').forEach(option => {
      option.addEventListener('click', function () {
        const windowNumber = this.getAttribute('data-value');
        switchWindow(windowNumber);

        const selectOptions = document.querySelector('.top-calculator__left .select__options');
        if (selectOptions) {
          selectOptions.hidden = true;
        }
      });
    });

    document.querySelector('.top-calculator__left .select__title')?.addEventListener('click', function () {
      const selectOptions = document.querySelector('.top-calculator__left .select__options');
      if (selectOptions) {
        selectOptions.hidden = !selectOptions.hidden;
      }
    });

    let resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    });
  }

  function waitForDependencies() {
    if (typeof noUiSlider === 'undefined') {
      setTimeout(waitForDependencies, 100);
      return;
    }

    if (typeof wNumb === 'undefined') {
      setTimeout(waitForDependencies, 100);
      return;
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      setTimeout(init, 100);
    }
  }

  waitForDependencies();
}
initCalculatorSwitcher();

//========================================================================================================================================================

// Яндекс карта
const map1 = document.getElementById('map1');
if (map1) {
  ymaps.ready(init);

  function init() {
    var myMap1 = new ymaps.Map('map1', {
      center: [55.585881, 37.634748],
      zoom: 15,
      controls: ['zoomControl'],
      behaviors: ['drag']
    });
    var myPlacemark1 = new ymaps.Placemark(myMap1.getCenter(), {
      latitude: 55.585881,
      longitude: 37.634748,
    }, {
      iconLayout: 'default#image',
      iconImageHref: 'img/map.svg',
      iconColor: '#ec6608',
      iconImageSize: [110, 110],
      iconImageOffset: [-55, -55],
    });

    myMap1.geoObjects.add(myPlacemark1);
  };
}

//========================================================================================================================================================

//Инфо
const infoButtons = document.querySelectorAll('.info__button');
if (infoButtons) {
  infoButtons.forEach(button => {
    button.addEventListener('click', function () {
      const infoBlock = this.closest('.info');
      const isActive = infoBlock.classList.contains('_active');

      document.querySelectorAll('.info._active').forEach(activeBlock => {
        activeBlock.classList.remove('_active');
      });

      if (!isActive) {
        infoBlock.classList.add('_active');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.info')) {
      document.querySelectorAll('.info._active').forEach(activeBlock => {
        activeBlock.classList.remove('_active');
      });
    }
  });
}

//========================================================================================================================================================

//Наблюдатель
class ScrollWatcher {
  constructor(props) {
    let defaultConfig = {
      logging: true,
    }
    this.config = Object.assign(defaultConfig, props);
    this.observer;
    !document.documentElement.classList.contains('watcher') ? this.scrollWatcherRun() : null;
  }
  scrollWatcherUpdate() {
    this.scrollWatcherRun();
  }
  scrollWatcherRun() {
    document.documentElement.classList.add('watcher');
    this.scrollWatcherConstructor(document.querySelectorAll('[data-watch]'));
  }
  scrollWatcherConstructor(items) {
    if (items.length) {
      let uniqParams = uniqArray(Array.from(items).map(function (item) {
        if (item.dataset.watch === 'navigator' && !item.dataset.watchThreshold) {
          let valueOfThreshold;
          if (item.clientHeight > 2) {
            valueOfThreshold =
              window.innerHeight / 2 / (item.clientHeight - 1);
            if (valueOfThreshold > 1) {
              valueOfThreshold = 1;
            }
          } else {
            valueOfThreshold = 1;
          }
          item.setAttribute(
            'data-watch-threshold',
            valueOfThreshold.toFixed(2)
          );
        }
        return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : '0px'}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
      }));
      uniqParams.forEach(uniqParam => {
        let uniqParamArray = uniqParam.split('|');
        let paramsWatch = {
          root: uniqParamArray[0],
          margin: uniqParamArray[1],
          threshold: uniqParamArray[2]
        }
        let groupItems = Array.from(items).filter(function (item) {
          let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
          let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : '0px';
          let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
          if (
            String(watchRoot) === paramsWatch.root &&
            String(watchMargin) === paramsWatch.margin &&
            String(watchThreshold) === paramsWatch.threshold
          ) {
            return item;
          }
        });

        let configWatcher = this.getScrollWatcherConfig(paramsWatch);

        this.scrollWatcherInit(groupItems, configWatcher);
      });
    }
  }
  getScrollWatcherConfig(paramsWatch) {
    let configWatcher = {}
    if (document.querySelector(paramsWatch.root)) {
      configWatcher.root = document.querySelector(paramsWatch.root);
    }
    configWatcher.rootMargin = paramsWatch.margin;
    if (paramsWatch.margin.indexOf('px') < 0 && paramsWatch.margin.indexOf('%') < 0) {
      return
    }
    if (paramsWatch.threshold === 'prx') {
      paramsWatch.threshold = [];
      for (let i = 0; i <= 1.0; i += 0.005) {
        paramsWatch.threshold.push(i);
      }
    } else {
      paramsWatch.threshold = paramsWatch.threshold.split(',');
    }
    configWatcher.threshold = paramsWatch.threshold;

    return configWatcher;
  }
  scrollWatcherCreate(configWatcher) {
    console.log(configWatcher);
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        this.scrollWatcherCallback(entry, observer);
      });
    }, configWatcher);
  }
  scrollWatcherInit(items, configWatcher) {
    this.scrollWatcherCreate(configWatcher);
    items.forEach(item => this.observer.observe(item));
  }
  scrollWatcherIntersecting(entry, targetElement) {
    if (entry.isIntersecting) {
      !targetElement.classList.contains('_watcher-view') ? targetElement.classList.add('_watcher-view') : null;
    } else {
      targetElement.classList.contains('_watcher-view') ? targetElement.classList.remove('_watcher-view') : null;
    }
  }
  scrollWatcherOff(targetElement, observer) {
    observer.unobserve(targetElement);
  }
  scrollWatcherCallback(entry, observer) {
    const targetElement = entry.target;
    this.scrollWatcherIntersecting(entry, targetElement);
    targetElement.hasAttribute('data-watch-once') && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
    document.dispatchEvent(new CustomEvent("watcherCallback", {
      detail: {
        entry: entry
      }
    }));
  }
}
modules_flsModules.watcher = new ScrollWatcher({});

//========================================================================================================================================================

//Прокрутка к блоку
let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
  const targetBlockElement = document.querySelector(targetBlock);
  if (targetBlockElement) {
    let headerItem = '';
    let headerItemHeight = 0;
    if (noHeader) {
      headerItem = 'header.header';
      const headerElement = document.querySelector(headerItem);
      if (!headerElement.classList.contains('_header-scroll')) {
        headerElement.style.cssText = `transition-duration: 0s;`;
        headerElement.classList.add('_header-scroll');
        headerItemHeight = headerElement.offsetHeight;
        headerElement.classList.remove('_header-scroll');
        setTimeout(() => {
          headerElement.style.cssText = ``;
        }, 0);
      } else {
        headerItemHeight = headerElement.offsetHeight;
      }
    }
    let options = {
      speedAsDuration: true,
      speed: speed,
      header: headerItem,
      offset: offsetTop,
      easing: 'easeOutQuad',
    };
    document.documentElement.classList.contains("menu-open") ? menuClose() : null;

    if (typeof SmoothScroll !== 'undefined') {
      new SmoothScroll().animateScroll(targetBlockElement, '', options);
    } else {
      let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
      targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
      targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
      window.scrollTo({
        top: targetBlockElementPosition,
        behavior: "smooth"
      });
    }
  }
};
function pageNavigation() {
  document.addEventListener("click", pageNavigationAction);
  document.addEventListener("watcherCallback", pageNavigationAction);
  function pageNavigationAction(e) {
    if (e.type === "click") {
      const targetElement = e.target;
      if (targetElement.closest('[data-goto]')) {
        const gotoLink = targetElement.closest('[data-goto]');
        const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : '';
        const noHeader = gotoLink.hasAttribute('data-goto-header') ? true : false;
        const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
        const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
        if (modules_flsModules.fullpage) {
          const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest('[data-fp-section]');
          const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
          if (fullpageSectionId !== null) {
            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
          }
        } else {
          gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
        }
        e.preventDefault();
      }
    } else if (e.type === "watcherCallback" && e.detail) {
      const entry = e.detail.entry;
      const targetElement = entry.target;
      if (targetElement.dataset.watch === 'navigator') {
        const navigatorActiveItem = document.querySelector(`[data-goto]._navigator-active`);
        let navigatorCurrentItem;
        if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) {
          navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`);
        } else if (targetElement.classList.length) {
          for (let index = 0; index < targetElement.classList.length; index++) {
            const element = targetElement.classList[index];
            if (document.querySelector(`[data-goto=".${element}"]`)) {
              navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
              break;
            }
          }
        }
        if (entry.isIntersecting) {
          navigatorCurrentItem ? navigatorCurrentItem.classList.add('_navigator-active') : null;
        } else {
          navigatorCurrentItem ? navigatorCurrentItem.classList.remove('_navigator-active') : null;
        }
      }
    }
  }
}
pageNavigation()