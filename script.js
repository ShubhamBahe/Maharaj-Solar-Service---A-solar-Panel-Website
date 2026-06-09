// ===== HERO SLIDER =====
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let current = 0;

function showSlide(index) {
  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));
  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

setInterval(() => {
  current = (current + 1) % slides.length;
  showSlide(current);
}, 5000);

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    current = i;
    showSlide(current);
  });
});

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 100);
});

// ===== BACK TO TOP =====
const backTop = document.getElementById("back-top");
window.addEventListener("scroll", () => {
  backTop.classList.toggle("show", window.scrollY > 500);
});
backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===== SERVICES TABS =====
const stabs = document.querySelectorAll(".stab");
const panels = document.querySelectorAll(".service-panel");

stabs.forEach(tab => {
  tab.addEventListener("click", () => {
    stabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
  });
});

// ===== PROJECT FILTERS =====
const pfilts = document.querySelectorAll(".pfilt");
const pcards = document.querySelectorAll(".project-card");

pfilts.forEach(btn => {
  btn.addEventListener("click", () => {
    pfilts.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    pcards.forEach(card => {
      if (filter === "all" || card.dataset.cat === filter) {
        card.style.display = "block";
        card.style.opacity = "1";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// ===== COUNTER ANIMATION =====
const statNums = document.querySelectorAll(".stat-num");
let counted = false;

function animateCounters() {
  if (counted) return;
  const banner = document.querySelector(".stats-banner");
  if (!banner) return;
  const rect = banner.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    counted = true;
    statNums.forEach(num => {
      const target = parseInt(num.dataset.target);
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          num.textContent = target.toLocaleString("en-IN");
          clearInterval(timer);
        } else {
          num.textContent = Math.floor(current).toLocaleString("en-IN");
        }
      }, 20);
    });
  }
}
window.addEventListener("scroll", animateCounters);

// ===== SAVINGS CALCULATOR =====
const billSlider = document.getElementById("bill-slider");
const billVal = document.getElementById("bill-val");

if (billSlider) {
  billSlider.addEventListener("input", () => {
    billVal.textContent = parseInt(billSlider.value).toLocaleString("en-IN");
  });
}

document.getElementById("calc-btn")?.addEventListener("click", () => {
  const bill = parseInt(document.getElementById("bill-slider").value);
  const tariff = parseFloat(document.getElementById("tariff-select").value);
  const efficiency = parseFloat(document.getElementById("system-select").value);

  const units = bill / tariff;
  const kw = Math.ceil((units / 120) * 1.2 * 10) / 10;
  const monthlySaved = Math.round(bill * efficiency);
  const annualSaved = monthlySaved * 12;
  const cost = kw * 65000;
  const payback = (cost / annualSaved).toFixed(1);

  document.getElementById("res-system").textContent = kw + " kW System";
  document.getElementById("res-monthly").textContent = "₹" + monthlySaved.toLocaleString("en-IN");
  document.getElementById("res-annual").textContent = "₹" + annualSaved.toLocaleString("en-IN");
  document.getElementById("res-25yr").textContent = "₹" + (annualSaved * 25).toLocaleString("en-IN");
  document.getElementById("res-payback").textContent = payback + " Years";
});

// ===== REVIEWS CAROUSEL =====
const reviewCards = document.querySelectorAll(".review-card");
const track = document.getElementById("reviews-track");
const revDotsContainer = document.getElementById("rev-dots");
let revCurrent = 0;
const visibleCount = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

function buildRevDots() {
  if (!revDotsContainer) return;
  revDotsContainer.innerHTML = "";
  const total = reviewCards.length - visibleCount + 1;
  for (let i = 0; i < total; i++) {
    const d = document.createElement("div");
    d.className = "rev-dot" + (i === 0 ? " active" : "");
    d.addEventListener("click", () => goToReview(i));
    revDotsContainer.appendChild(d);
  }
}

function goToReview(index) {
  const maxIndex = reviewCards.length - visibleCount;
  revCurrent = Math.max(0, Math.min(index, maxIndex));
  const cardWidth = reviewCards[0]?.offsetWidth + 28 || 0;
  if (track) track.style.transform = `translateX(-${revCurrent * cardWidth}px)`;
  document.querySelectorAll(".rev-dot").forEach((d, i) => d.classList.toggle("active", i === revCurrent));
}

document.getElementById("rev-prev")?.addEventListener("click", () => goToReview(revCurrent - 1));
document.getElementById("rev-next")?.addEventListener("click", () => goToReview(revCurrent + 1));
buildRevDots();
setInterval(() => goToReview((revCurrent + 1) % (reviewCards.length - visibleCount + 1)), 5000);

// ===== FAQ ACCORDION =====
document.querySelectorAll(".faq-q").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});

// ===== CONTACT FORM — saves to localStorage for admin =====
document.getElementById("contact-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const lead = {
    name: form.querySelector('[name="name"]')?.value || '',
    phone: form.querySelector('[name="phone"]')?.value || '',
    email: form.querySelector('[name="email"]')?.value || '',
    system: form.querySelector('[name="system_type"]')?.value || '',
    city: form.querySelector('[name="city"]')?.value || '',
    bill: form.querySelector('[name="bill"]')?.value || '',
    notes: form.querySelector('[name="message"]')?.value || '',
    status: 'New',
    assigned: 'Rinkesh Puri',
    date: new Date().toISOString().split('T')[0],
    id: Date.now()
  };

  // Save to localStorage so admin panel picks it up
  try {
    const leads = JSON.parse(localStorage.getItem('mss_leads') || '[]');
    leads.unshift(lead);
    localStorage.setItem('mss_leads', JSON.stringify(leads));
  } catch(err) {}

  const btn = form.querySelector(".form-submit");
  btn.textContent = "✅ Request Sent! We'll call you soon.";
  btn.style.background = "#4caf50";
  btn.style.color = "white";
  setTimeout(() => {
    btn.textContent = "Send My Request →";
    btn.style.background = "";
    btn.style.color = "";
    form.reset();
  }, 4000);
});

// ===== SCROLL ANIMATIONS =====
const animItems = document.querySelectorAll(".why-card, .project-card, .pstep, .review-card, .faq-item, .stat-item, .brand-chip, .ci-item");
animItems.forEach(el => el.classList.add("animate-on-scroll"));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"), i * 80);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

animItems.forEach(el => observer.observe(el));

// ===== SMOOTH SCROLL NAV =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const href = a.getAttribute("href");
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById("hamburger");
hamburger?.addEventListener("click", () => {
  const nav = document.querySelector(".nav-links");
  const isOpen = nav.style.display === "flex";
  nav.style.display = isOpen ? "none" : "flex";
  nav.style.flexDirection = "column";
  nav.style.position = "absolute";
  nav.style.top = "70px";
  nav.style.left = "0";
  nav.style.width = "100%";
  nav.style.background = "rgba(0,0,0,0.95)";
  nav.style.padding = "20px";
  nav.style.gap = "16px";
  nav.style.zIndex = "1000";
});