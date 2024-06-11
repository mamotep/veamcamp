const body = document.querySelector('body');
const header = document.querySelector('.header');
const pcMenu = document.querySelector('.pcMenu');
const headerLogo = document.querySelector('.header-logo');
const headerLogoLink = document.querySelector('.header-logo a');
const gnbLinks = pcMenu.querySelectorAll('.gnb-link');
const authMenuLinks = document.querySelectorAll('.authMenu-link');
const siteControls = document.querySelector('.siteControls');
const storeLink = document.querySelector('.storeLink');
const searchBox = document.querySelector('.search-box');
const searchOpenButton = document.querySelector('.search-open');
const searchCloseButton = document.querySelector('.search-close');
const searchInput = document.querySelector('.search-input');
const main = document.querySelector('main');
const mainMenuOpenButton = document.querySelector('.mainMenu-open');
const mainMenuCloseButton = document.querySelector('.mainMenu-close');
const mobileMenu = document.querySelector('.mobileMenu');
const footer = document.querySelector('.footer');


/* 접근성 관련 inert 토글 함수 */
function toggleInert(elements, add) {
  elements.forEach(el => el && el.toggleAttribute('inert', add));
}


/* 헤더 스크롤 */
let lastScrollTop = 0;

function toggleHeaderOnScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // 스크롤 다운 -> 헤더 숨기기
    gsap.to(header, { top: -header.offsetHeight, duration: 0.3 });
    gsap.to(main, { top: -header.offsetHeight, duration: 0.3 });
  } else {
    // 스크롤 업 -> 헤더 보이기
    gsap.to(header, { top: 0, duration: 0.3 });
    gsap.to(main, { top: 0, duration: 0.3 });
  }

  lastScrollTop = scrollTop;
}

// 스크롤 이벤트 리스너
window.addEventListener('scroll', toggleHeaderOnScroll);


/* 헤더 포커스 감지 */
const headerFocusElements = [header, headerLogo, headerLogoLink, searchOpenButton, mainMenuOpenButton];

function checkFocus() {
  const activeElement = document.activeElement;
  const isFocused = headerFocusElements.find(el => el.contains(activeElement) || el === activeElement);

  if (isFocused) toggleHeaderOnScroll();
}

headerFocusElements.forEach(element => {
  element.addEventListener('focus', checkFocus, true); // true 옵션으로 캡처링 단계에서 이벤트를 처리
  element.addEventListener('blur', checkFocus, true); // true 옵션으로 캡처링 단계에서 이벤트를 처리
});


/* 헤더 서치박스 토글 */
function toggleSearchBox(open) {
  const elementsToToggle = [headerLogo, pcMenu, storeLink, searchOpenButton, main, footer];
  
  toggleInert(elementsToToggle, open);
  body.classList.toggle('dimmed', open);

  if (open) {
    gsap.set(searchBox, { display: 'block' });
    gsap.to(searchBox, {
      duration: 0.4,
      y: "0",
      onComplete: function() {
        searchInput.focus();
      }
    });
  } else {
    gsap.to(searchBox, {
      duration: 0.2,
      y: "-100%",
      onComplete: function() {
        gsap.set(searchBox, { display: 'none' });
      }
    });
  }
}

// 서치박스 열기
searchOpenButton.addEventListener('click', () => toggleSearchBox(true));

// 서치박스 닫기
searchCloseButton.addEventListener('click', () => toggleSearchBox(false));

// 서치박스 뒷배경 딤드 처리
body.addEventListener('click', e => {
  if (body.classList.contains('dimmed') && e.target === body) {
    toggleSearchBox(false);
  }
});


/* 모바일 헤더 메뉴버튼 */
// 모바일 메뉴 토글 함수
function toggleMobileMenu(open) {
  const elementsToToggleWhenOpen = [siteControls, main, footer];
  const elementsToToggleWhenClose = [mobileMenu];

  toggleInert(elementsToToggleWhenOpen, open);
  toggleInert(elementsToToggleWhenClose, !open);
  body.classList.toggle('hidden', open);

  if (open) {
    gsap.set(mobileMenu, { display: 'flex' });

    const slideMenu = gsap.timeline({
      defaults: {
        ease: "power3",
      }
    });
    
    slideMenu
      .to(mobileMenu, { x: 0 })
      .from(mainMenuCloseButton, { opacity: 0 }, '+=0.2');
  } else {
    gsap.to(mobileMenu, { 
      duration: 0.4,
      x: "-100%",
      onComplete: function() {
        gsap.set(mobileMenu, { display: 'none' });
      }
    });
  }
}

// 모바일 메뉴 열기
mainMenuOpenButton.addEventListener('click', () => toggleMobileMenu(true));

// 모바일 메뉴 닫기
mainMenuCloseButton.addEventListener('click', () => toggleMobileMenu(false));
