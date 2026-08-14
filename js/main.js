/* ============================================================
   Sittal Basyal — Portfolio 2026
   Interactions & animations
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    var preloader = document.getElementById("preloader");
    if (preloader) {
      setTimeout(function () {
        preloader.classList.add("hidden");
      }, 500);
    }
  });

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Navbar: scroll state ---------- */
  var nav = document.getElementById("nav");
  function onScrollNav() {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("nav-toggle");
  var links = document.getElementById("nav-links");
  function closeMenu() {
    if (toggle && links) {
      toggle.classList.remove("open");
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  }
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-link");
  function onScrollActive() {
    var pos = window.scrollY + 120;
    var currentId = "";
    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop) {
        currentId = sec.getAttribute("id");
      }
    });
    navLinks.forEach(function (l) {
      l.classList.toggle("active", l.getAttribute("href") === "#" + currentId);
    });
  }
  window.addEventListener("scroll", onScrollActive, { passive: true });
  onScrollActive();

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById("to-top");
  function onScrollTop() {
    if (!toTop) return;
    if (window.scrollY > 600) {
      toTop.classList.add("show");
    } else {
      toTop.classList.remove("show");
    }
  }
  window.addEventListener("scroll", onScrollTop, { passive: true });
  onScrollTop();
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var revealObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- Typing effect ---------- */
  var roles = [
    "AI/ML models.",
    "data pipelines.",
    "neural networks.",
    "intelligent systems.",
    "the future."
  ];
  var typeEl = document.getElementById("type-text");
  if (typeEl) {
    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function type() {
      var current = roles[roleIndex];
      if (!deleting) {
        typeEl.textContent = current.slice(0, ++charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1600);
          return;
        }
        setTimeout(type, 70);
      } else {
        typeEl.textContent = current.slice(0, --charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(type, 350);
          return;
        }
        setTimeout(type, 35);
      }
    }
    setTimeout(type, 800);
  }
})();
