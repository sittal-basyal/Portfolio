// Animation functionality
// Enhanced version with better performance and error handling

// Enhanced Typing Effect
function initTypingEffect() {
  const typedTextSpan = document.getElementById("typed");
  if (!typedTextSpan) {
    console.warn("Typed text element not found");
    return;
  }

  const textArray = [
    "Data Science Enthusiast",
    "AI/ML Developer",
    "Web Developer",
    "Problem Solver",
    "Creative Thinker",
  ];

  const typingDelay = 100;
  const erasingDelay = 50;
  const newTextDelay = 2000;
  let textArrayIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeoutId;

  function type() {
    const currentText = textArray[textArrayIndex];

    if (isDeleting) {
      // Deleting text
      typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Typing text
      typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
      // Finished typing, wait then start deleting
      isDeleting = true;
      timeoutId = setTimeout(type, newTextDelay);
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, move to next text
      isDeleting = false;
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      timeoutId = setTimeout(type, typingDelay);
    } else {
      // Continue typing/deleting
      const delay = isDeleting ? erasingDelay : typingDelay;
      timeoutId = setTimeout(type, delay);
    }
  }

  // Add cursor styles if not present
  if (!document.querySelector("#typing-styles")) {
    const styles = document.createElement("style");
    styles.id = "typing-styles";
    styles.textContent = `
            #typed {
                border-right: 2px solid #3b82f6;
                padding-right: 4px;
                animation: blink-caret 0.7s infinite;
            }
            
            @keyframes blink-caret {
                from, to { border-color: transparent; }
                50% { border-color: #3b82f6; }
            }
        `;
    document.head.appendChild(styles);
  }

  // Start typing effect
  if (textArray.length) {
    timeoutId = setTimeout(type, newTextDelay + 250);
  }

  // Cleanup function
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}

// Enhanced Scroll animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right, .zoom-in"
  );

  if (!animatedElements.length) {
    console.warn("No animation elements found");
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;

        // Add different animation classes based on element type
        if (element.classList.contains("fade-in")) {
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        } else if (element.classList.contains("slide-in-left")) {
          element.style.opacity = "1";
          element.style.transform = "translateX(0)";
        } else if (element.classList.contains("slide-in-right")) {
          element.style.opacity = "1";
          element.style.transform = "translateX(0)";
        } else if (element.classList.contains("zoom-in")) {
          element.style.opacity = "1";
          element.style.transform = "scale(1)";
        }

        observer.unobserve(element);
      }
    });
  }, observerOptions);

  // Initialize elements with their starting states
  animatedElements.forEach((el) => {
    // Set initial states based on animation type
    if (el.classList.contains("fade-in")) {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
    } else if (el.classList.contains("slide-in-left")) {
      el.style.opacity = "0";
      el.style.transform = "translateX(-50px)";
    } else if (el.classList.contains("slide-in-right")) {
      el.style.opacity = "0";
      el.style.transform = "translateX(50px)";
    } else if (el.classList.contains("zoom-in")) {
      el.style.opacity = "0";
      el.style.transform = "scale(0.8)";
    }

    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Add animation styles
  if (!document.querySelector("#animation-styles")) {
    const styles = document.createElement("style");
    styles.id = "animation-styles";
    styles.textContent = `
            .fade-in, .slide-in-left, .slide-in-right, .zoom-in {
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            /* Stagger animations for children */
            .stagger-animation > * {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
        `;
    document.head.appendChild(styles);
  }
}

// Enhanced Parallax effect for hero section
function initParallaxEffect() {
  const hero = document.querySelector(".hero");
  if (!hero) {
    console.warn("Hero section not found for parallax");
    return;
  }

  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    // Only apply parallax if not scrolled too far
    if (scrolled < window.innerHeight) {
      const rate = scrolled * -0.3; // Reduced strength for better performance
      hero.style.transform = `translateY(${rate}px)`;
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Cleanup function
  return () => {
    window.removeEventListener("scroll", onScroll);
    hero.style.transform = "";
  };
}

// Enhanced Counter animation for statistics
function initCounterAnimation() {
  const counters = document.querySelectorAll(".counter");

  if (!counters.length) {
    console.warn("Counter elements not found");
    return;
  }

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute("data-target");
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString(); // Format with commas
          }
        };

        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => {
    // Set initial value to 0
    counter.textContent = "0";
    observer.observe(counter);
  });
}

// Enhanced Hover effects for project cards
function initHoverEffects() {
  const projectCards = document.querySelectorAll(".project-card");

  if (!projectCards.length) {
    console.warn("Project cards not found for hover effects");
    return;
  }

  projectCards.forEach((card) => {
    // Add transition for smooth animation
    card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";

    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px) scale(1.02)";
      card.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
      card.style.boxShadow = "";
    });

    // Touch device support
    card.addEventListener("touchstart", () => {
      card.style.transform = "translateY(-4px) scale(1.01)";
    });

    card.addEventListener("touchend", () => {
      card.style.transform = "translateY(0) scale(1)";
    });
  });
}

// Particle effect for hero section (optional enhancement)
function initParticleEffect() {
  const hero = document.querySelector(".hero");
  if (!hero || document.querySelector("#particles-js")) return;

  try {
    // Only load particles if the library is available
    if (typeof particlesJS !== "undefined") {
      particlesJS("hero", {
        particles: {
          number: { value: 30, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
          },
          move: { enable: true, speed: 2, direction: "none", random: true },
        },
      });
    }
  } catch (error) {
    console.warn("Particles.js not available, skipping particle effect");
  }
}

// Initialize all animations when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize with error handling
  try {
    initTypingEffect();
    initScrollAnimations();
    initParallaxEffect();
    initCounterAnimation();
    initHoverEffects();
    initParticleEffect(); // Optional
  } catch (error) {
    console.error("Error initializing animations:", error);
  }
});

// Re-initialize animations when navigating (for SPAs)
function reinitAnimations() {
  initScrollAnimations();
  initCounterAnimation();
  initHoverEffects();
}

// Export functions for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initTypingEffect,
    initScrollAnimations,
    initParallaxEffect,
    initCounterAnimation,
    initHoverEffects,
    initParticleEffect,
    reinitAnimations,
  };
}
