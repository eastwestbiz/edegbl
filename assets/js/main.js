 /*
  File: assets/js/main.js
  Description: Main JavaScript file for EDE GLOBAL website
  Contains: Template logic (Navbar, Sidebar, Scroll), Optimization/Security, and Google Translate
*/

(function() {
  "use strict";

  // ==========================================
  // 1. Core Template Functionality
  // ==========================================

  // --- Update Copyright Year ---
  const yearSpan = document.getElementById('ede-current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Sticky Navbar & Back to Top ---
  window.onscroll = function() {
    const header_navbar = document.querySelector(".navbar-area");
    const sticky = header_navbar ? header_navbar.offsetTop : 0;
    const backToTop = document.querySelector(".scroll-top");

    if (header_navbar) {
      if (window.pageYOffset > sticky) {
        header_navbar.classList.add("sticky");
      } else {
        header_navbar.classList.remove("sticky");
      }
    }

    // Show/Hide Back to Top Button
    if (backToTop) {
      if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        backToTop.style.display = "flex";
      } else {
        backToTop.style.display = "none";
      }
    }
  };

  // --- Mobile Menu Toggle ---
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener("click", function() {
      navbarToggler.classList.toggle("active");
      navbarCollapse.classList.toggle("show");
    });
  }

  // --- Sidebar Toggle ---
  const sidebarLeft = document.querySelector('.sidebar-left');
  const overlayLeft = document.querySelector('.overlay-left');
  const sidebarClose = document.querySelector('.sidebar-close .close');

  if (sidebarClose && sidebarLeft && overlayLeft) {
    const closeSidebar = () => {
      sidebarLeft.classList.remove('open');
      overlayLeft.classList.remove('open');
    };
    sidebarClose.addEventListener('click', closeSidebar);
    overlayLeft.addEventListener('click', closeSidebar);
  }

  // --- Smooth Scroll for Page Links ---
  const pageLinks = document.querySelectorAll(".page-scroll");
  pageLinks.forEach((elem) => {
    elem.addEventListener("click", (e) => {
      e.preventDefault();
      const href = elem.getAttribute("href");
      
      // Close mobile menu if open
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        navbarToggler.classList.remove("active");
        navbarCollapse.classList.remove("show");
      }

      // Scroll to section
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // --- Active Menu Link on Scroll (ScrollSpy) ---
  function onScroll(event) {
    const sections = document.querySelectorAll(".page-scroll");
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

    sections.forEach((currLink) => {
      const val = currLink.getAttribute("href");
      if (!val || !val.startsWith("#")) return;
      
      const refElement = document.querySelector(val);
      if (refElement) {
        const scrollTopMinus = scrollPos + 73;
        if (
          refElement.offsetTop <= scrollTopMinus &&
          refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
        ) {
          document.querySelector(".page-scroll.active")?.classList.remove("active");
          currLink.classList.add("active");
        }
      }
    });
  }
  window.document.addEventListener("scroll", onScroll);


  // ==========================================
  // 2. Optimization & Security
  // ==========================================

  // --- Security: Disable Right Click & Copy ---
  const disallowKeys = ['a', 'c', 'x', 's', 'u', 'p'];
  
  // Disable context menu
  document.addEventListener('contextmenu', e => e.preventDefault());
  
  // Disable copy/paste/drag
  ['copy', 'cut', 'dragstart', 'selectstart'].forEach(evt => {
    document.addEventListener(evt, e => e.preventDefault());
  });

  // Disable specific key combinations
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && disallowKeys.includes(k)) {
      e.preventDefault();
    }
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i','j','c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });

  // --- Lazy Load Background Images ---
  if ('IntersectionObserver' in window) {
    const bgLazy = document.querySelectorAll('[data-bg]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          el.style.backgroundImage = `url(${el.getAttribute('data-bg')})`;
          io.unobserve(el);
        }
      });
    }, { rootMargin: '300px 0px' });
    bgLazy.forEach(el => io.observe(el));
  }

  // --- Font Display Swap Fix ---
  document.fonts && document.fonts.ready.then(() => {
    Array.from(document.styleSheets).forEach(ss => {
      try {
        Array.from(ss.cssRules || []).forEach(r => {
          if (r.type === CSSRule.FONT_FACE_RULE && !/font-display/i.test(r.cssText)) {
            r.style.fontDisplay = 'swap';
          }
        });
      } catch (_) {}
    });
  });

  // --- Link Prefetching ---
  const internalLinks = document.querySelectorAll('a[href$=".html"]:not([data-noprefetch])');
  internalLinks.forEach(a => {
    let loaded = false;
    const prefetch = () => {
      if (loaded) return;
      loaded = true;
      const l = document.createElement('link');
      l.rel = 'prefetch';
      l.href = a.href;
      document.head.appendChild(l);
    };
    a.addEventListener('mouseenter', prefetch, { passive: true });
    a.addEventListener('focus', prefetch);
  });

  // ==========================================
  // 3. Third Party Libraries Init
  // ==========================================
  
  const initLibs = () => {
    // GLightbox
    if (typeof GLightbox !== 'undefined') {
      GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: true
      });
    }
    // Tiny Slider (if used)
    if (typeof tns !== 'undefined') {
       // tns({ container: '.my-slider', ... });
    }
  };

  // Attempt init immediately, or wait for load
  initLibs();
  window.addEventListener('load', initLibs);

})();

// ==========================================
// 4. Google Translate Integration (Global)
// ==========================================

// Define the callback function globally so Google script can find it
window.googleTranslateElementInit = function() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,mr,hi,kn,te,ta,pa,bn,gu,ml,or,ur,as',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false,
    multilanguagePage: true,
    gaTrack: true, 
  }, 'google_translate_element');

  // Restore saved language preference
  const savedLang = localStorage.getItem('googleTranslateLanguage');
  if (savedLang && savedLang !== 'en') {
    const checkCombo = setInterval(() => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        clearInterval(checkCombo);
        combo.value = savedLang;
        combo.dispatchEvent(new Event('change'));
      }
    }, 500);
  }

  // Listen for language changes to save preference
  const observer = new MutationObserver((mutations) => {
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.addEventListener('change', () => {
        localStorage.setItem('googleTranslateLanguage', combo.value);
      });
      observer.disconnect();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
};


// Auto-collapse navbar on mobile when a nav link is clicked
document.querySelectorAll(".navbar-nav a:not(.dropdown-toggle)").forEach(link => {
  link.addEventListener("click", () => {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
      if (navbarToggler) navbarToggler.classList.remove("active");
    }
  });
});



