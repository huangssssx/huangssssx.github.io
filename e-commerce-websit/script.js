const form = document.getElementById("contactForm");

(function () {
  var saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var html = document.documentElement;
      var isDark = html.getAttribute("data-theme") === "dark";
      if (isDark) {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }
})();

(function () {
  var mainImg = document.querySelector(".product-main-img");
  var thumbs = document.querySelectorAll(".product-thumb");
  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      var src = thumb.getAttribute("src");
      mainImg.src = src;
      thumbs.forEach(function (t) { t.classList.remove("active"); });
      thumb.classList.add("active");
    });
  });
})();

if (form) {
  const status = document.getElementById("formStatus");
  const submitButton = form.querySelector('button[type="submit"]');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showStatus = (type, message) => {
    status.className = `form-status visible ${type}`;
    status.textContent = message;
  };

  const setError = (field, message) => {
    const error = field.parentElement.querySelector(".error");
    if (error) {
      error.textContent = message;
    }
    field.setAttribute("aria-invalid", message ? "true" : "false");
  };

  const clearErrors = () => {
    form.querySelectorAll(".error").forEach((node) => {
      node.textContent = "";
    });

    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.removeAttribute("aria-invalid");
    });
  };

  const validate = () => {
    clearErrors();

    let valid = true;
    ["name", "email", "subject", "message"].forEach((name) => {
      const field = form.elements[name];
      if (!field.value.trim()) {
        setError(field, "This field is required.");
        valid = false;
      }
    });

    const email = form.elements.email;
    if (email.value.trim() && !emailPattern.test(email.value.trim())) {
      setError(email, "Please enter a valid email address.");
      valid = false;
    }

    if (form.elements.website.value.trim()) {
      showStatus("error", "Spam protection triggered. Submission rejected.");
      return false;
    }

    return valid;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    if (!validate()) {
      if (!status.textContent) {
        showStatus("error", "Please fix the highlighted fields and try again.");
      }
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      console.log("Demo submission payload:", payload);
      form.reset();
      clearErrors();
      showStatus(
        "success",
        "Thank you! Your message has been received. We'll get back to you within one business day."
      );
    } catch (error) {
      showStatus("error", "Something went wrong while sending your message. Please try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }
  });
}

(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const topbar = document.querySelector(".topbar");
  if (topbar) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          topbar.classList.toggle("scrolled", window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  if (!prefersReducedMotion) {
    const reveals = document.querySelectorAll(
      ".section > .container, .section > .container > *"
    );
    reveals.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  }
})();

(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const carousel = document.querySelector(".carousel");
  if (!carousel || prefersReducedMotion) return;

  const track = carousel.querySelector(".carousel-track");
  const dots = carousel.querySelectorAll(".carousel-dot");
  const total = dots.length;
  let current = 0;
  let timer;

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  function startAuto() {
    timer = setInterval(() => goTo(current + 1), 4500);
  }

  function stopAuto() {
    clearInterval(timer);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      stopAuto();
      goTo(Number(dot.dataset.index));
      startAuto();
    });
  });

  let touchStartX = 0;
  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });

  carousel.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goTo(current + (diff > 0 ? 1 : -1));
    }
    startAuto();
  }, { passive: true });

  startAuto();
})();
