"use strict";

/**
 * Smoothly scrolls the page to a given section by ID.
 * @param {string} sectionId - The ID of the target section.
 */
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 60, // offset for fixed header
      behavior: "smooth",
    });
  }
}

// Optionally, highlight the active nav link on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav ul li a");
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 80; // offset for fixed header
    if (pageYOffset >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});
