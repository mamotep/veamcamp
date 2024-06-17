const util = {
  /* 포커스 관련 inert 토글 함수 */
  toggleInert: (elements, add) => {
    elements.forEach(el => el && el.toggleAttribute('inert', add));
  },
};

(() => {
  const $menu = {
    pcMenu : document.querySelector('.pcMenu'),
    headerLogo : document.querySelector('.header-logo'),
    headerLogoLink : document.querySelector('.header-logo a'),
    authMenuLinks : document.querySelectorAll('.authMenu-link'),
    siteControls : document.querySelector('.siteControls'),
    storeLink : document.querySelector('.storeLink'),
    searchBox : document.querySelector('.search-box'),
    searchOpenButton : document.querySelector('.search-open'),
    searchCloseButton : document.querySelector('.search-close'),
    searchInput : document.querySelector('.search-input'),
    mainMenuOpenButton : document.querySelector('.mainMenu-open'),
    mainMenuCloseButton : document.querySelector('.mainMenu-close'),
    mobileMenu : document.querySelector('.mobileMenu'),
    mobileMenuGnbLinks : document.querySelectorAll('.mobileMenu .gnb-link'),
    mobileMenuAuthMenuLinks : document.querySelectorAll('.mobileMenu .authMenu-link'),
  }

  const $global = {
    header : document.querySelector('.header'),
    footer : document.querySelector('.footer'),
  }
  
  const $body = document.querySelector('body');
  const $wrapper = document.querySelector('.wrapper');
  const $main = document.querySelector('.main');

  /* 헤더 스크롤 */
  let lastScrollTop = 0;

  function toggleHeaderOnScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      // 스크롤 다운 -> 헤더 숨기기
      $global.header.classList.add('is_active');
      $main.classList.add('is_active');
    } else {
      // 스크롤 업 -> 헤더 보이기
      $global.header.classList.remove('is_active');
      $main.classList.remove('is_active');
    }

    lastScrollTop = scrollTop;
  }

  // 스크롤 이벤트 리스너
  window.addEventListener('scroll', _.throttle(toggleHeaderOnScroll, 100));


  /* 헤더 포커스 감지 */
  const headerFocusElements = $global.header; // 혹은 단일 요소

  function checkFocus(elements) {
    const activeElement = document.activeElement;
    let isFocused = false;

    if (Array.isArray(headerFocusElements)) {
      isFocused = headerFocusElements.some(el => el.contains(activeElement) || el === activeElement);
    } else {
      isFocused = headerFocusElements.contains(activeElement) || headerFocusElements === activeElement;
    }

    if (isFocused) toggleHeaderOnScroll();
  }

  function addFocusListeners(elements) {
    if (Array.isArray(elements)) {
      elements.forEach(element => {
        element.addEventListener('focus', checkFocus, true);
        element.addEventListener('blur', checkFocus, true);
      });
    } else {
      elements.addEventListener('focus', checkFocus, true);
      elements.addEventListener('blur', checkFocus, true);
    }
  }

  // 이벤트 리스너 추가
  addFocusListeners(headerFocusElements);


  let focusSearchBox = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      $menu.searchOpenButton.focus();
    }
  };

  let focusCurrentElement = (CurrentElement) => (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      CurrentElement.focus();
    }
  };

  /* 헤더 서치박스 토글 */
  function toggleSearchBox(isOpen) {
    // const elementsToInertWhenSearchBoxOpen = [$menu.headerLogoLink, $menu.pcMenu, $menu.storeLink, $menu.searchOpenButton, $menu.mainMenuOpenButton, $main, $global.footer];
    const elementsToInertWhenSearchBoxOpen = [$wrapper, $menu.mobileMenu];
    const elementsToInertWhenSearchBoxClose = [$menu.searchBox];
  
    util.toggleInert(elementsToInertWhenSearchBoxOpen, isOpen);
    util.toggleInert(elementsToInertWhenSearchBoxClose, !isOpen);
    $body.classList.toggle('dimmed', isOpen);
  
    if (isOpen) {
      $menu.searchBox.classList.add('is_active');
      gsap.to($menu.searchBox, {
        duration: 0.4,
        y: '0',
        onComplete: function() {
          $menu.searchInput.focus();
          document.removeEventListener('keydown', focusCurrentElement($menu.searchOpenButton));
        }
      });
    } else {
      gsap.to($menu.searchBox, {
        duration: 0.2,
        y: '-100%',
        onComplete: function() {
          $menu.searchBox.classList.remove('is_active');
          document.addEventListener('keydown', focusCurrentElement($menu.searchOpenButton), { once: true });
        }
      });
    }
  }

  // 서치박스 클릭 열기
  $menu.searchOpenButton.addEventListener('click', () => toggleSearchBox(true));

  // 서치박스 클릭 닫기
  $menu.searchCloseButton.addEventListener('click', () => toggleSearchBox(false));

  // ESC 키로 서치 박스 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $menu.searchBox.classList.contains('is_active')) {
      toggleSearchBox(false);
    }
  });

  // 서치박스 뒷배경 딤드 클릭 처리
  $body.addEventListener('click', e => {
    if ($body.classList.contains('dimmed') && e.target === $body) {
      toggleSearchBox(false);
    }
  });


  /* 모바일 헤더 메뉴버튼 */
  // 모바일 메뉴 토글 함수
  function toggleMobileMenu(isOpen) {
    // const elementsToInertWhenMenuOpen = [$menu.headerLogoLink, $menu.pcMenu, $menu.siteControls, $main, $global.footer];
    const elementsToInertWhenMenuOpen = [$wrapper, $menu.searchBox];
    const elementsToInertWhenMenuClose = [$menu.mobileMenu];

    util.toggleInert(elementsToInertWhenMenuOpen, isOpen);
    util.toggleInert(elementsToInertWhenMenuClose, !isOpen);
    $body.classList.toggle('hidden', isOpen);

    if (isOpen) {
      $menu.mobileMenu.classList.add('is_active');
      const slideMenu = gsap.timeline({
        defaults: {
          ease: 'power3',
        }
      });
      
      slideMenu
      .to($menu.mobileMenu, { x: 0 })
      .from($menu.mainMenuCloseButton, { opacity: 0 }, '+=0.2');

      document.removeEventListener('keydown', focusNextElement($menu.mainMenuOpenButton));
    } else {
      gsap.to($menu.mobileMenu, { 
        duration: 0.4,
        x: '-100%',
        onComplete: function() {
          $menu.mobileMenu.classList.remove('is_active');
        }
      });
      document.addEventListener('keydown', focusCurrentElement($menu.mainMenuOpenButton), { once: true }); 
    }
  }

  // 모바일 메뉴 클릭 열기
  $menu.mainMenuOpenButton.addEventListener('click', () => toggleMobileMenu(true));

  // 모바일 메뉴 클릭 닫기
  $menu.mainMenuCloseButton.addEventListener('click', () => toggleMobileMenu(false));

  // ESC 키로 모바일 메뉴 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $menu.mobileMenu.classList.contains('is_active')) {
      toggleMobileMenu(false);
    }
  });

  // 모바일메뉴 밑줄
  function addUnderlineHoverEffect(elements) {
    // NodeList나 HTMLCollection을 배열로 변환
    if (elements instanceof NodeList || elements instanceof HTMLCollection) {
      elements = Array.from(elements);
    } else if (!Array.isArray(elements)) {
      // 단일 요소를 배열로 변환
      elements = [elements];
    }

    elements.forEach(el => {
      el.addEventListener('mouseover', e => {
        gsap.to(el, {
          duration: 0.2,
          '--border-bottom': 'scale(1)',
        });
      });

      el.addEventListener('mouseleave', e => {
        gsap.to(el, {
          duration: 0.2,
          '--border-bottom': 'scale(0)',
        });
      });
    });
  }

  addUnderlineHoverEffect($menu.mobileMenuGnbLinks);
  addUnderlineHoverEffect($menu.mobileMenuAuthMenuLinks);
})();