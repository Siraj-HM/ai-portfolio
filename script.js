"use strict";

/**
 * Smoothly scrolls to the specified section.
 * @param {string} sectionId - The ID of the target section.
 */
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 60, // Adjust for fixed header
      behavior: "smooth"
    });
  }
}

/**
 * Opens the lightbox with the given image source.
 * @param {string} src - The source URL of the image.
 */
function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  lightboxImg.src = src;
  lightbox.style.display = "flex";
}

/**
 * Closes the lightbox.
 * @param {Event} [e] - Optional event parameter to prevent propagation.
 */
function closeLightbox(e) {
  if (e) {
    e.stopPropagation(); // Prevent click from bubbling
  }
  document.getElementById("lightbox").style.display = "none";
}
