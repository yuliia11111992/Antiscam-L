document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Все скрипты загружены");

  /* ===========================
     Navigation & Burger Menu
  =========================== */

  const burgerMenu = document.getElementById("burgerMenu");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const header = document.querySelector(".header");

  if (burgerMenu && navMenu) {
    burgerMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      burgerMenu.classList.toggle("active");
      navMenu.classList.toggle("active");
      document.body.style.overflow = navMenu.classList.contains("active")
        ? "hidden"
        : "";
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        burgerMenu.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !burgerMenu.contains(e.target)) {
        burgerMenu.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  /* ===========================
     Header Scroll Effect
  =========================== */

  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 100);
    });
  }

  /* ===========================
     Smooth Scroll
  =========================== */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;

      e.preventDefault();
      const offset = header ? header.offsetHeight : 0;
      const position = target.offsetTop - offset;

      window.scrollTo({
        top: position,
        behavior: "smooth",
      });
    });
  });

  /* ===========================
     Scroll Animations
  =========================== */

  const animatedElements = document.querySelectorAll("[data-animate]");

  if ("IntersectionObserver" in window && animatedElements.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    animatedElements.forEach((el) => el.classList.add("visible"));
  }

  /* ===========================
     Tabs
  =========================== */

  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;

      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const content = document.querySelector(`[data-content="${tab}"]`);
      if (content) content.classList.add("active");
    });
  });

  /* ===========================
     Stats Counter
  =========================== */

  const heroStats = document.querySelector(".hero-stats");

  if (heroStats && "IntersectionObserver" in window) {
    const animateCounter = (el, target) => {
      let current = 0;
      const step = Math.max(1, target / 120);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 16);
    };

    const statsObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll("h3").forEach((el) => {
              const num = parseInt(el.textContent.replace(/\D/g, ""));
              if (!isNaN(num)) {
                el.textContent = "0";
                animateCounter(el, num);
              }
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    statsObserver.observe(heroStats);
  }

  /* ===========================
     Parallax (Safe)
  =========================== */

  const orbs = document.querySelectorAll(".gradient-orb");
  if (orbs.length) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      orbs.forEach((orb, i) => {
        orb.style.transform = `translateY(${y * (0.1 + i * 0.05)}px)`;
      });
    });
  }

  /* ===========================
     Active Navigation Link
  =========================== */

  const sections = document.querySelectorAll("section[id]");
  if (sections.length) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;

      sections.forEach((section) => {
        const top = section.offsetTop - 160;
        const height = section.offsetHeight;
        const id = section.id;

        if (scrollY >= top && scrollY < top + height) {
          document.querySelectorAll(".nav-link").forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    });
  }

  console.log("🛡️ ВозвратСредств — сайт инициализирован");
});
