// script.js

/* ===========================
   MOBILE MENU
=========================== */
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.addEventListener('click', () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');
});


/* ===========================
   ACTIVE NAVIGATION ON SCROLL
=========================== */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY;

  sections.forEach(sec => {
    const offset = sec.offsetTop - 150;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');

    if (scrollPos >= offset && scrollPos < offset + height) {
      navLinks.forEach(link => link.classList.remove('active'));
      document
        .querySelector(`header nav a[href*="${id}"]`)
        .classList.add('active');
    }
  });

  // Sticky header
  const header = document.querySelector('header');
  header.classList.toggle('sticky', scrollPos > 100);

  // Close mobile menu on scroll
  menuIcon.classList.remove('bx-x');
  navbar.classList.remove('active');
});


/* ===========================
   SCROLL REVEAL ANIMATIONS
=========================== */

const sr = ScrollReveal({
  distance: '60px',
  duration: 1200,
  delay: 200,
  reset: true
});

// Top elements
sr.reveal('.heading', { origin: 'top' });

// Hero
sr.reveal('.home-content', { origin: 'left' });
sr.reveal('.home-img', { origin: 'right' });

// About
sr.reveal('.about-img', { origin: 'left' });
sr.reveal('.about-content', { origin: 'right' });

// Skills
sr.reveal('.services-container', { origin: 'bottom', interval: 100 });

// Projects
sr.reveal('.portfolio-box', { origin: 'bottom', interval: 150 });

// Contact
sr.reveal('.contact form', { origin: 'bottom' });


/* ===========================
   EMAILJS CONTACT FORM
=========================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        showPopup("Message sent successfully!", "success");
        form.reset();
      } else {
        showPopup("Message failed to send.", "error");
      }
    } catch (err) {
      showPopup("Server error. Please try again later.", "error");
    }
  });
});


// popup elegant
function showPopup(message, type) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.className = `popup show ${type}`;

  setTimeout(() => {
    popup.className = "popup hidden";
  }, 3000);
}

/* ===========================
   FOOTER YEAR AUTO-UPDATE
=========================== */
const currentYear = new Date().getFullYear();
document.getElementById("copyright-text").innerHTML =
  `Portofoliu Maria Lavinia Dusca · Copyright © ${currentYear}  · Crafted with clarity, precision, and purpose`;