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

/**
 * Scrolls the gallery in the specified direction
 * @param {string} direction - The direction to scroll ('left' or 'right')
 */
function scrollGallery(direction) {
  const gallery = document.querySelector('.gallery-scroll');
  const scrollAmount = 300; // Width of one gallery item
  const currentScroll = gallery.scrollLeft;
  const maxScroll = gallery.scrollWidth - gallery.clientWidth;

  let newScroll;
  if (direction === 'left') {
    newScroll = currentScroll - scrollAmount;
    // If we're at the start, jump to end
    if (newScroll < 0) {
      newScroll = maxScroll;
    }
  } else {
    newScroll = currentScroll + scrollAmount;
    // If we're at the end, jump to start
    if (newScroll >= maxScroll) {
      newScroll = 0;
    }
  }

  gallery.scrollTo({
    left: newScroll,
    behavior: 'smooth'
  });
}

/**
 * Handles the contact form submission
 * @param {Event} event - The form submission event
 */
function handleSubmit(event) {
  event.preventDefault();
  
  // Get form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };

  // Disable submit button and show loading state
  const submitBtn = event.target.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  // Send email using EmailJS
  emailjs.send(
    'service_rsgb24k', // Email service ID from EmailJS
    'template_pbvsk2g', // Email template ID from EmailJS
    {
      from_name: formData.name,
      from_email: formData.email,
      reply_to: formData.email,
      to_name: 'Siraj',
      subject: formData.subject,
      message: formData.message,
      email_content: `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
    }
  ).then(
    function(response) {
      // Show success message
      alert('Thank you for your message! I will get back to you soon.');
      // Reset form
      event.target.reset();
    },
    function(error) {
      // Show error message
      alert('Oops! Something went wrong. Please try again later.');
      console.error('Email error:', error);
    }
  ).finally(() => {
    // Re-enable submit button and restore text
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });
}

// Gallery Drag Scrolling
const slider = document.querySelector('.gallery-scroll');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('dragging');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('dragging');
});

slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('dragging');
});

slider.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2; // Scroll speed multiplier
  slider.scrollLeft = scrollLeft - walk;
});

// Touch events for mobile
slider.addEventListener('touchstart', (e) => {
  isDown = true;
  slider.classList.add('dragging');
  startX = e.touches[0].pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('touchend', () => {
  isDown = false;
  slider.classList.remove('dragging');
});

slider.addEventListener('touchmove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.touches[0].pageX - slider.offsetLeft;
  const walk = (x - startX) * 2;
  slider.scrollLeft = scrollLeft - walk;
});

// Work Section Filtering and Load More
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let currentlyShowing = 3;
    const increment = 3;

    // Initial setup - show first 3 cards
    updateVisibleCards('all');

    // Handle filter button clicks
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Reset count when changing filters
            currentlyShowing = 3;
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            updateVisibleCards(filterValue);
        });
    });

    // Handle load more button clicks
    loadMoreBtn.addEventListener('click', () => {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        currentlyShowing += increment;
        updateVisibleCards(activeFilter);
    });

    // Function to update visible cards
    function updateVisibleCards(filterValue) {
        let visibleCount = 0;
        let totalFilteredCards = 0;

        workCards.forEach((card, index) => {
            const cardCategory = card.getAttribute('data-category');
            const matchesFilter = filterValue === 'all' || filterValue === cardCategory;

            // Count total cards matching current filter
            if (matchesFilter) {
                totalFilteredCards++;
            }

            // Determine if card should be visible
            if (matchesFilter && visibleCount < currentlyShowing) {
                card.style.display = 'block';
                card.style.animation = 'revealCard 0.5s ease forwards';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide load more button
        loadMoreBtn.style.display = visibleCount < totalFilteredCards ? 'inline-block' : 'none';
    }
});

// Add fadeIn animation to CSS
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}`;
document.head.appendChild(style);
