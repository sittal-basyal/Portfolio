// Main JavaScript functionality
// Enhanced version with better error handling and performance

// Mobile Menu Toggle with enhanced functionality
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;

  if (!mobileMenuBtn || !navLinks) {
    console.warn("Mobile menu elements not found");
    return;
  }

  mobileMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActive = navLinks.classList.toggle("active");

    // Update button icon
    mobileMenuBtn.innerHTML = isActive
      ? '<i class="fas fa-times" aria-hidden="true"></i>'
      : '<i class="fas fa-bars" aria-hidden="true"></i>';

    // Update accessibility attributes
    mobileMenuBtn.setAttribute("aria-expanded", isActive);

    // Prevent body scroll when menu is open
    body.style.overflow = isActive ? "hidden" : "";

    // Add backdrop for mobile
    if (isActive) {
      createMobileMenuBackdrop();
    } else {
      removeMobileMenuBackdrop();
    }
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    navLinks.classList.remove("active");
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    body.style.overflow = "";
    removeMobileMenuBackdrop();
  }

  function createMobileMenuBackdrop() {
    removeMobileMenuBackdrop(); // Remove existing first

    const backdrop = document.createElement("div");
    backdrop.className = "mobile-menu-backdrop";
    backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

    document.body.appendChild(backdrop);

    // Animate backdrop
    setTimeout(() => {
      backdrop.style.opacity = "1";
    }, 10);

    // Close menu when backdrop is clicked
    backdrop.addEventListener("click", closeMobileMenu);
  }

  function removeMobileMenuBackdrop() {
    const backdrop = document.querySelector(".mobile-menu-backdrop");
    if (backdrop) {
      backdrop.remove();
    }
  }
}

// Header scroll effect with throttling
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Optional: Hide header on scroll down, show on scroll up
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY) {
        header.classList.add("header-hidden");
      } else {
        header.classList.remove("header-hidden");
      }
    }

    lastScrollY = window.scrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}

// Enhanced smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    // Skip if it's a filter button or has no-scroll class
    if (
      anchor.classList.contains("filter-btn") ||
      anchor.classList.contains("no-scroll")
    ) {
      return;
    }

    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip empty or invalid href
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // Close mobile menu if open
      const navLinks = document.querySelector(".nav-links");
      if (navLinks && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
        if (mobileMenuBtn) {
          mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
        document.body.style.overflow = "";
      }

      // Calculate header height for offset
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = target.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Update URL without pushing to history
      if (history.pushState) {
        history.pushState(null, null, href);
      } else {
        location.hash = href;
      }
    });
  });
}

// Enhanced Project filter functionality
function initProjectFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const projectGrid = document.querySelector(".projects-grid");

  if (!filterButtons.length || !projectCards.length) {
    console.warn("Project filter elements not found");
    return;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterValue = button.getAttribute("data-filter");

      // Update active button
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      // Add loading state to grid
      if (projectGrid) {
        projectGrid.style.opacity = "0.7";
        projectGrid.style.pointerEvents = "none";
      }

      // Filter projects with animation
      let visibleCount = 0;
      projectCards.forEach((card, index) => {
        const matchesFilter =
          filterValue === "all" ||
          card.getAttribute("data-category") === filterValue;

        if (matchesFilter) {
          visibleCount++;
          card.style.display = "block";
          // Stagger animation
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0) scale(1)";
          }, index * 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px) scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });

      // Remove loading state
      setTimeout(() => {
        if (projectGrid) {
          projectGrid.style.opacity = "1";
          projectGrid.style.pointerEvents = "auto";
        }
      }, Math.max(300, projectCards.length * 50));
    });
  });
}

// Enhanced Back to top functionality
function initBackToTop() {
  let backToTopButton = document.querySelector(".back-to-top");

  // Create button if it doesn't exist in HTML
  if (!backToTopButton) {
    backToTopButton = document.createElement("button");
    backToTopButton.className = "back-to-top";
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopButton.setAttribute("aria-label", "Back to top");
    backToTopButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        `;
    document.body.appendChild(backToTopButton);
  }

  function updateBackToTop() {
    const scrolled = window.scrollY > 300;

    if (scrolled) {
      backToTopButton.classList.add("visible");
      backToTopButton.style.opacity = "1";
      backToTopButton.style.visibility = "visible";
      backToTopButton.style.transform = "translateY(0)";
    } else {
      backToTopButton.classList.remove("visible");
      backToTopButton.style.opacity = "0";
      backToTopButton.style.visibility = "hidden";
      backToTopButton.style.transform = "translateY(20px)";
    }
  }

  // Throttle scroll events
  let isScrolling;
  window.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(updateBackToTop, 50);
    },
    { passive: true }
  );

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Initial check
  updateBackToTop();
}

// Enhanced Theme toggle functionality
function initThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle");

  if (!themeToggle) {
    console.warn("Theme toggle element not found");
    return;
  }

  // Check for saved theme preference or respect OS preference
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  };

  const setTheme = (theme) => {
    document.body.classList.toggle("light-theme", theme === "light");
    themeToggle.innerHTML =
      theme === "light"
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute(
      "aria-label",
      `Switch to ${theme === "light" ? "dark" : "light"} theme`
    );
    localStorage.setItem("theme", theme);
  };

  // Initialize theme
  setTheme(getPreferredTheme());

  themeToggle.addEventListener("click", () => {
    const isLightTheme = document.body.classList.contains("light-theme");
    setTheme(isLightTheme ? "dark" : "light");
  });

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "light" : "dark");
      }
    });
}

// Add floating animation to hero image
function initHeroAnimation() {
  const heroImage = document.querySelector(".hero-image");
  if (heroImage) {
    heroImage.classList.add("floating");

    // Add floating animation styles
    if (!document.querySelector("#hero-animation-styles")) {
      const styles = document.createElement("style");
      styles.id = "hero-animation-styles";
      styles.textContent = `
                .floating {
                    animation: floating 3s ease-in-out infinite;
                }
                
                @keyframes floating {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `;
      document.head.appendChild(styles);
    }
  }
}

// Loading animation
function initLoadingAnimation() {
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
    setTimeout(() => {
      document.body.style.overflow = "auto";
    }, 500);
  });

  // Fallback: remove loading class after 3 seconds
  setTimeout(() => {
    document.body.classList.add("loaded");
    document.body.style.overflow = "auto";
  }, 3000);
}

// Initialize skill progress bars
function initializeSkillProgress() {
  const skillProgressBars = document.querySelectorAll(".skill-progress");

  if (!skillProgressBars.length) {
    console.warn("Skill progress bars not found");
    return;
  }

  skillProgressBars.forEach((bar) => {
    const level = bar.getAttribute("data-level");
    if (level) {
      // Animate progress on scroll
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                bar.style.width = level + "%";
                bar.setAttribute("aria-valuenow", level);
              }, 200);
              observer.unobserve(bar);
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: "0px 0px -50px 0px",
        }
      );

      observer.observe(bar);
    }
  });
}

// Click outside to close mobile menu
function initClickOutside() {
  document.addEventListener("click", (e) => {
    const navLinks = document.querySelector(".nav-links");
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");

    if (
      navLinks &&
      navLinks.classList.contains("active") &&
      !e.target.closest(".nav-links") &&
      !e.target.closest(".mobile-menu-btn")
    ) {
      navLinks.classList.remove("active");
      if (mobileMenuBtn) {
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      }
      document.body.style.overflow = "";
      removeMobileMenuBackdrop();
    }
  });

  function removeMobileMenuBackdrop() {
    const backdrop = document.querySelector(".mobile-menu-backdrop");
    if (backdrop) {
      backdrop.remove();
    }
  }
}

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initHeaderScroll();
  initSmoothScrolling();
  initProjectFilter();
  initBackToTop();
  initThemeToggle();
  initHeroAnimation();
  initLoadingAnimation();
  initializeSkillProgress();
  initClickOutside();

  console.log("Portfolio JavaScript initialized successfully");
});

// Export functions for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initializeSkillProgress,
    initMobileMenu,
    initThemeToggle,
    initProjectFilter,
  };
}
