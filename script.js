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

// Track current image index for lightbox navigation
let currentImageIndex = 0;
let galleryImages = [];

/**
 * Opens the lightbox with the given image source.
 * @param {string} src - The source URL of the image.
 */
function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  
  // Update gallery images array
  galleryImages = Array.from(document.querySelectorAll('.gallery-item img')).map(img => img.src);
  currentImageIndex = galleryImages.indexOf(src);
  
  // Set the image source
  lightboxImg.src = src;
  
  // Show the lightbox with flex display
  lightbox.style.display = "flex";
  
  // Trigger reflow to enable transition
  lightbox.offsetHeight;
  
  // Add show class for transition
  lightbox.classList.add("show");
  
  // Prevent body scrolling when lightbox is open
  document.body.style.overflow = "hidden";
  
  // Add keyboard event listener
  document.addEventListener('keydown', handleLightboxKeyPress);
}

/**
 * Closes the lightbox.
 * @param {Event} [e] - Optional event parameter to prevent propagation.
 */
function closeLightbox(e) {
  if (e) {
    e.stopPropagation(); // Prevent click from bubbling
  }
  const lightbox = document.getElementById("lightbox");
  
  // Remove show class to trigger transition
  lightbox.classList.remove("show");
  
  // Wait for transition to complete before hiding
  setTimeout(() => {
    lightbox.style.display = "none";
  }, 300);
  
  // Restore body scrolling
  document.body.style.overflow = "";
  
  // Remove keyboard event listener
  document.removeEventListener('keydown', handleLightboxKeyPress);
}

/**
 * Navigates through images in the lightbox
 * @param {string} direction - Direction to navigate ('prev' or 'next')
 * @param {Event} e - The event object
 */
function navigateLightbox(direction, e) {
  e.stopPropagation(); // Prevent lightbox from closing
  
  if (direction === 'prev') {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  } else {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  }
  
  const lightboxImg = document.getElementById("lightbox-img");
  lightboxImg.style.opacity = '0';
  
  setTimeout(() => {
    lightboxImg.src = galleryImages[currentImageIndex];
    lightboxImg.style.opacity = '1';
  }, 200);
}

/**
 * Handles keyboard events for the lightbox
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleLightboxKeyPress(e) {
  switch(e.key) {
    case "Escape":
      closeLightbox();
      break;
    case "ArrowLeft":
      navigateLightbox('prev', new Event('keypress'));
      break;
    case "ArrowRight":
      navigateLightbox('next', new Event('keypress'));
      break;
  }
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

// Initialize gallery functionality
document.addEventListener('DOMContentLoaded', () => {
  // Add click handlers to all gallery images
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    const img = item.querySelector('img');
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(img.src);
    });
  });
  
  // Add click handler to lightbox for closing
  const lightbox = document.getElementById('lightbox');
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox(e);
    }
  });
});

// Video Gallery Functionality
function openVideoModal(videoSrc, isPortrait = false) {
  // Create modal if it doesn't exist
  let modal = document.querySelector('.video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
      <div class="video-modal-content">
        <video controls>
          <source src="" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <span class="close" onclick="closeVideoModal()">&times;</span>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const videoElement = modal.querySelector('video');
  const modalContent = modal.querySelector('.video-modal-content');
  
  // Set video source
  videoElement.src = videoSrc;
  
  // Add portrait class if needed
  modalContent.classList.toggle('portrait', isPortrait);
  
  // Show modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Add event listener for closing modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeVideoModal();
    }
  });
  
  // Add keyboard event listener
  document.addEventListener('keydown', handleVideoModalKeyPress);
}

function closeVideoModal() {
  const modal = document.querySelector('.video-modal');
  if (modal) {
    const video = modal.querySelector('video');
    video.pause();
    modal.classList.remove('show');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleVideoModalKeyPress);
  }
}

function handleVideoModalKeyPress(e) {
  if (e.key === 'Escape') {
    closeVideoModal();
  }
}

// Initialize video gallery functionality
document.addEventListener('DOMContentLoaded', () => {
  // Existing initialization code...

  // Add click handlers to video items
  const videoItems = document.querySelectorAll('.video-item');
  videoItems.forEach(item => {
    item.addEventListener('click', () => {
      const isPortrait = item.classList.contains('portrait');
      const videoUrl = item.getAttribute('data-video-url'); // Get URL from data attribute
      if (videoUrl) {
        openVideoModal(videoUrl, isPortrait);
      } else {
        console.error('No video URL found for this item');
      }
    });
  });
});

// Video Gallery Load More
document.addEventListener('DOMContentLoaded', function() {
  const loadMoreVideosBtn = document.getElementById('loadMoreVideosBtn');
  const videoItems = document.querySelectorAll('.video-item');
  const videosPerLoad = 4;
  let currentlyShowingVideos = videosPerLoad;

  // Hide load more button if there are fewer videos than the initial display amount
  if (videoItems.length <= videosPerLoad) {
    loadMoreVideosBtn.style.display = 'none';
  }

  loadMoreVideosBtn.addEventListener('click', function() {
    // Show next set of videos
    for (let i = currentlyShowingVideos; i < currentlyShowingVideos + videosPerLoad && i < videoItems.length; i++) {
      videoItems[i].classList.add('show');
    }

    // Update counter
    currentlyShowingVideos += videosPerLoad;

    // Hide button if all videos are shown
    if (currentlyShowingVideos >= videoItems.length) {
      loadMoreVideosBtn.style.display = 'none';
    }
  });
});

// Back to Top Button Functionality
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.classList.add('visible');
  } else {
    backToTopButton.classList.remove('visible');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = document.querySelectorAll('img.lazy-image');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loading-animation');
        
        // Load the image
        const loadImage = new Image();
        loadImage.src = img.src;
        loadImage.onload = () => {
          img.classList.remove('loading-animation');
          img.classList.add('loaded');
        };
        
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px'
  });
  
  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
});

// Update all image elements to use lazy loading
document.querySelectorAll('img').forEach(img => {
  if (!img.hasAttribute('loading')) {
    img.setAttribute('loading', 'lazy');
  }
});

// Social Share Functionality
document.addEventListener('DOMContentLoaded', function() {
  const shareButtons = document.querySelectorAll('.share-button');
  const pageUrl = encodeURIComponent(window.location.href);
  const shareMessage = encodeURIComponent("Explore Siraj Hassan's innovative AI-generated artworks, where cutting-edge technology meets creative vision. Experience the intersection of artificial intelligence and artistic expression.");
  const pageTitle = encodeURIComponent("Siraj Hassan - AI Artist & Visual Creator");
  
  shareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      let shareUrl = '';
      
      if (button.classList.contains('facebook')) {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${shareMessage}`;
      } else if (button.classList.contains('twitter')) {
        shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareMessage}`;
      } else if (button.classList.contains('linkedin')) {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}&summary=${shareMessage}`;
      } else if (button.classList.contains('whatsapp')) {
        shareUrl = `https://wa.me/?text=${shareMessage}%20${pageUrl}`;
      } else if (button.classList.contains('copy')) {
        const fullMessage = `${decodeURIComponent(shareMessage)}\n\n${window.location.href}`;
        navigator.clipboard.writeText(fullMessage).then(() => {
          showToast('Link and message copied to clipboard!');
        });
        return;
      }
      
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    });
  });
});

// Toast notification function
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Trigger reflow to enable transition
  toast.offsetHeight;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 2000);
}

// Section lazy loading with Intersection Observer
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // Add visible class when section comes into view
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: Unobserve after animation
      // sectionObserver.unobserve(entry.target);
    } else {
      // Optional: Remove visible class when section leaves viewport
      // entry.target.classList.remove('visible');
    }
  });
}, {
  // Trigger when section is 20% visible
  threshold: 0.2,
  // Start loading slightly before section comes into view
  rootMargin: '50px'
});

// Observe all sections except hero (which should be visible immediately)
document.querySelectorAll('section:not(#hero)').forEach(section => {
  sectionObserver.observe(section);
});

// Make hero section visible immediately
document.querySelector('#hero')?.classList.add('visible');

// Update active navigation link based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
  const scrollPosition = window.scrollY + 100; // Offset for better accuracy

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Image loading animations
function handleImageLoading() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    if (!img.complete) {
      img.parentElement.classList.add('image-loader');
      
      img.addEventListener('load', () => {
        img.classList.add('loaded');
        img.parentElement.classList.remove('image-loader');
      });
      
      img.addEventListener('error', () => {
        img.parentElement.classList.remove('image-loader');
      });
    } else {
      img.classList.add('loaded');
    }
  });
}

document.addEventListener('DOMContentLoaded', handleImageLoading);

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    const headerOffset = 80; // Height of fixed header
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  });
});
