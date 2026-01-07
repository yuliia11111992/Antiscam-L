document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // SMOOTH SCROLL
  // ==========================================

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  const burger = document.getElementById("burger");
  const nav = document.querySelector(".nav");

  burger.addEventListener("click", () => {
    nav.classList.toggle("active");
    burger.classList.toggle("active");
  });

  // ==========================================
  // SCROLL ANIMATIONS
  // ==========================================

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // Unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  document.querySelectorAll(".animate-on-scroll").forEach((element) => {
    observer.observe(element);
  });
  const header = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  });

  // ==========================================
  // COUNTER ANIMATION
  // ==========================================

  const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      // Format number with spaces for thousands
      const formatted = Math.floor(current).toLocaleString("ru-RU");
      element.textContent = formatted;

      // Add "+" for some numbers
      if (
        target >= 50 &&
        element.textContent === target.toLocaleString("ru-RU")
      ) {
        element.textContent = formatted + "+";
      }
    }, 16);
  };

  // Observe stats section for counter animation
  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll(".stat-number");
          statNumbers.forEach((stat) => {
            const target = parseInt(stat.getAttribute("data-target"));
            animateCounter(stat, target);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector(".stats-section");
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ==========================================
  // FORM HANDLING
  // ==========================================

  const consultationForm = document.getElementById("consultationForm");
  const modal = document.getElementById("successModal");
  const modalClose = document.querySelector(".modal-close");

  if (consultationForm) {
    consultationForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        message: formData.get("message"),
        timestamp: new Date().toISOString(),
      };

      // Log form data (in real app, send to server)
      console.log("Form submitted:", data);

      // Show success modal
      showModal();

      // Reset form
      this.reset();

      // Hide modal after 3 seconds
      setTimeout(() => {
        hideModal();
      }, 3000);
    });
  }

  // Modal functions
  function showModal() {
    if (modal) {
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  }

  function hideModal() {
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  // Close modal on X click
  if (modalClose) {
    modalClose.addEventListener("click", hideModal);
  }

  // Close modal on outside click
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      hideModal();
    }
  });

  // Close modal on ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "block") {
      hideModal();
    }
  });

  // ==========================================
  // SCROLL TO FORM FUNCTION
  // ==========================================

  window.scrollToForm = function () {
    const form = document.querySelector(".hero-form");
    if (form) {
      form.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Focus on first input after scroll
      setTimeout(() => {
        const firstInput = form.querySelector("input");
        if (firstInput) {
          firstInput.focus();
        }
      }, 500);
    }
  };

  // ==========================================
  // PHONE INPUT MASK
  // ==========================================

  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach((input) => {
    input.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      // Limit to 11 digits
      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      // Format phone number
      let formatted = "";
      if (value.length > 0) {
        formatted = "+7";
        if (value.length > 1) {
          formatted += " (" + value.substring(1, 4);
        }
        if (value.length >= 4) {
          formatted += ") " + value.substring(4, 7);
        }
        if (value.length >= 7) {
          formatted += "-" + value.substring(7, 9);
        }
        if (value.length >= 9) {
          formatted += "-" + value.substring(9, 11);
        }
      }

      e.target.value = formatted;
    });

    // Set initial value
    input.addEventListener("focus", function (e) {
      if (e.target.value === "") {
        e.target.value = "+7";
      }
    });

    // Clear if only +7
    input.addEventListener("blur", function (e) {
      if (e.target.value === "+7" || e.target.value === "+7 ") {
        e.target.value = "";
      }
    });
  });

  // ==========================================
  // PARALLAX EFFECT FOR HERO
  // ==========================================

  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector(".hero");

    if (hero && scrolled < window.innerHeight) {
      const parallaxSpeed = 0.5;
      hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      hero.style.opacity = 1 - scrolled / window.innerHeight;
    }
  });

  // ==========================================
  // LAZY LOADING IMAGES
  // ==========================================

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // If image has data-src, load it
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }

          // Add loaded class for fade-in effect
          img.classList.add("loaded");

          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px",
    }
  );

  // Observe all images
  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });

  // ==========================================
  // FORM VALIDATION
  // ==========================================

  const inputs = document.querySelectorAll("input, textarea");

  inputs.forEach((input) => {
    // Real-time validation
    input.addEventListener("blur", function () {
      validateInput(this);
    });

    // Remove error on input
    input.addEventListener("input", function () {
      if (this.classList.contains("error")) {
        this.classList.remove("error");
        const errorMsg = this.parentElement.querySelector(".error-message");
        if (errorMsg) {
          errorMsg.remove();
        }
      }
    });
  });

  function validateInput(input) {
    let isValid = true;
    let errorMessage = "";

    // Check if required
    if (input.hasAttribute("required") && !input.value.trim()) {
      isValid = false;
      errorMessage = "Это поле обязательно для заполнения";
    }

    // Email validation
    if (input.type === "email" && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        errorMessage = "Введите корректный email";
      }
    }

    // Phone validation
    if (input.type === "tel" && input.value) {
      const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
      if (!phoneRegex.test(input.value)) {
        isValid = false;
        errorMessage = "Введите корректный номер телефона";
      }
    }

    // Show/hide error
    if (!isValid) {
      input.classList.add("error");
      showError(input, errorMessage);
    } else {
      input.classList.remove("error");
      removeError(input);
    }

    return isValid;
  }

  function showError(input, message) {
    removeError(input);

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    errorDiv.style.color = "#ef4444";
    errorDiv.style.fontSize = "0.875rem";
    errorDiv.style.marginTop = "5px";

    input.parentElement.appendChild(errorDiv);
  }

  function removeError(input) {
    const errorMsg = input.parentElement.querySelector(".error-message");
    if (errorMsg) {
      errorMsg.remove();
    }
  }

  // ==========================================
  // SCROLL INDICATOR HIDE ON SCROLL
  // ==========================================

  const scrollIndicator = document.querySelector(".scroll-indicator");

  if (scrollIndicator) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 100) {
        scrollIndicator.style.opacity = "0";
        scrollIndicator.style.pointerEvents = "none";
      } else {
        scrollIndicator.style.opacity = "1";
        scrollIndicator.style.pointerEvents = "auto";
      }
    });
  }

  // ==========================================
  // REVIEWS SLIDER AUTO SCROLL
  // ==========================================

  const reviewsSlider = document.querySelector(".reviews-slider");

  if (reviewsSlider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    // Enable horizontal scroll with mouse drag
    reviewsSlider.addEventListener("mousedown", (e) => {
      isDown = true;
      reviewsSlider.style.cursor = "grabbing";
      startX = e.pageX - reviewsSlider.offsetLeft;
      scrollLeft = reviewsSlider.scrollLeft;
    });

    reviewsSlider.addEventListener("mouseleave", () => {
      isDown = false;
      reviewsSlider.style.cursor = "grab";
    });

    reviewsSlider.addEventListener("mouseup", () => {
      isDown = false;
      reviewsSlider.style.cursor = "grab";
    });

    reviewsSlider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - reviewsSlider.offsetLeft;
      const walk = (x - startX) * 2;
      reviewsSlider.scrollLeft = scrollLeft - walk;
    });
  }

  // ==========================================
  // PERFORMANCE OPTIMIZATION
  // ==========================================

  // Debounce function for scroll events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ==========================================
  // CONSOLE LOG
  // ==========================================

  console.log(
    "%c🛡️ ANTISCAM Landing Page",
    "color: #1e40af; font-size: 24px; font-weight: bold;"
  );
  console.log(
    "%cПрофессиональный возврат средств от мошенников",
    "color: #3b82f6; font-size: 14px;"
  );
  console.log(
    "%c© 2025 ANTISCAM. Все права защищены.",
    "color: #64748b; font-size: 12px;"
  );
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Get form data as object
function getFormData(form) {
  const formData = new FormData(form);
  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  return data;
}

// Format number with spaces
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
