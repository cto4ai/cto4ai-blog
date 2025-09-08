import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

let lightboxInstance = null;

export function initializeLightbox() {
  // Only initialize once
  if (lightboxInstance || typeof window === 'undefined') {
    return lightboxInstance;
  }

  lightboxInstance = GLightbox({
    touchNavigation: true,
    loop: false,
    autoplayVideos: true,
  });

  // Mark as initialized
  window.glightboxInitialized = true;

  return lightboxInstance;
}

export function refreshLightbox() {
  // Destroy existing instance
  if (lightboxInstance) {
    try {
      lightboxInstance.destroy();
    } catch (error) {
      console.warn('Error destroying lightbox:', error);
    }
    lightboxInstance = null;
    window.glightboxInitialized = false;
  }

  // Create new instance
  setTimeout(() => {
    initializeLightbox();
  }, 10);
}

// Initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLightbox);
  } else {
    initializeLightbox();
  }
}
