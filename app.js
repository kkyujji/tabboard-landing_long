const pageData = window.tabboardPageData;

const featureGrid = document.querySelector("#featureGrid");
const usecaseGrid = document.querySelector("#usecaseGrid");
const faqList = document.querySelector("#faqList");

function renderFeatures() {
  featureGrid.innerHTML = pageData.features
    .map((feature) => `
      <article class="info-card">
        <div class="card-icon" aria-hidden="true">${feature.icon}</div>
        <h3>${feature.title}</h3>
        <p>${feature.description}</p>
      </article>
    `)
    .join("");
}

function renderUsecases() {
  usecaseGrid.innerHTML = pageData.usecases
    .map((usecase) => `
      <article class="usecase-card">
        <span class="usecase-label">${usecase.title}</span>
        <h3>${usecase.subtitle}</h3>
        <p>${usecase.description}</p>
      </article>
    `)
    .join("");
}

function renderFaqs() {
  faqList.innerHTML = pageData.faqs
    .map((faq, index) => `
      <details class="faq-item" ${index === 0 ? "open" : ""}>
        <summary>${faq.question}</summary>
        <p>${faq.answer}</p>
      </details>
    `)
    .join("");

  faqList.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqList.querySelectorAll(".faq-item").forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initImageModal() {
  const modal = document.querySelector("#imageModal");
  const trigger = document.querySelector(".floating-stage");
  const modalImage = modal?.querySelector(".image-modal-img");
  const modalTitle = modal?.querySelector(".image-modal-title");
  const modalCount = modal?.querySelector(".image-modal-count");
  const closeButton = modal?.querySelector(".image-modal-close");
  const prevButton = modal?.querySelector(".image-carousel-prev");
  const nextButton = modal?.querySelector(".image-carousel-next");
  const dotsWrap = modal?.querySelector(".image-carousel-dots");

  if (!modal || !trigger || !modalImage || !modalTitle || !modalCount || !closeButton || !prevButton || !nextButton || !dotsWrap) {
    return;
  }

  const slides = Array.from(document.querySelectorAll(".floating-stage img")).map((image) => ({
    src: image.dataset.full || image.getAttribute("src"),
    title: image.dataset.title || image.alt || "탭보드 화면",
    alt: image.alt || image.dataset.title || "탭보드 화면"
  }));

  if (!slides.length) {
    return;
  }

  let currentIndex = 0;
  let timerId = null;

  dotsWrap.innerHTML = slides
    .map((slide, index) => `
      <button class="image-carousel-dot" type="button" aria-label="${slide.title} 보기" data-index="${index}"></button>
    `)
    .join("");

  const dots = Array.from(dotsWrap.querySelectorAll(".image-carousel-dot"));

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    const slide = slides[currentIndex];

    modalImage.src = slide.src;
    modalImage.alt = slide.alt;
    modalTitle.textContent = slide.title;
    modalCount.textContent = `${currentIndex + 1} / ${slides.length}`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
    });

    modalImage.classList.remove("is-animating");
    requestAnimationFrame(() => {
      modalImage.classList.add("is-animating");
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function stopRolling() {
    if (!timerId) return;
    window.clearInterval(timerId);
    timerId = null;
  }

  function startRolling() {
    stopRolling();
    timerId = window.setInterval(nextSlide, 3000);
  }

  function restartRolling() {
    stopRolling();
    startRolling();
  }

  function openModal() {
    showSlide(0);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    startRolling();
    closeButton.focus();
  }

  trigger.addEventListener("click", openModal);
  trigger.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openModal();
  });

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalImage.src = "";
    modalImage.alt = "";
    modalTitle.textContent = "";
    modalCount.textContent = "";
    stopRolling();
    trigger.focus();
  }

  closeButton.addEventListener("click", closeModal);

  nextButton.addEventListener("click", () => {
    nextSlide();
    restartRolling();
  });

  prevButton.addEventListener("click", () => {
    prevSlide();
    restartRolling();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.index));
      restartRolling();
    });
  });

const floatingStage = document.querySelector(".floating-stage");
const galleryHoverHint = document.querySelector(".gallery-hover-hint");

if (floatingStage && galleryHoverHint) {
  floatingStage.addEventListener("mouseenter", () => {
    galleryHoverHint.classList.add("is-visible");
  });

  floatingStage.addEventListener("mousemove", (event) => {
    galleryHoverHint.style.left = `${event.clientX}px`;
    galleryHoverHint.style.top = `${event.clientY}px`;
  });

  floatingStage.addEventListener("mouseleave", () => {
    galleryHoverHint.classList.remove("is-visible");
  });
}

modalImage.addEventListener("mouseenter", stopRolling);

modalImage.addEventListener("mouseleave", startRolling);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
    }

    if (event.key === "ArrowRight") {
      nextSlide();
      restartRolling();
    }

    if (event.key === "ArrowLeft") {
      prevSlide();
      restartRolling();
    }
  });
}

renderFeatures();
renderUsecases();
renderFaqs();
initSmoothScroll();
initImageModal();
