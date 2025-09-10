/**
 * Accessibility improvements for Mitsutouge Tourism Website
 */

document.addEventListener('DOMContentLoaded', function() {
  // Add rel="noopener" to external links
  document.querySelectorAll('a[href^="http"]').forEach(a => {
    a.setAttribute('rel', 'noopener');
    a.setAttribute('target', '_blank');
  });

  // Add focus management for dropdown menus
  const detailsElements = document.querySelectorAll('details');
  detailsElements.forEach(details => {
    const summary = details.querySelector('summary');
    if (summary) {
      summary.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          details.open = !details.open;
        }
      });
    }
  });

  // Improve keyboard navigation for custom elements
  const customButtons = document.querySelectorAll('[role="button"]');
  customButtons.forEach(button => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });

  // Add skip links for better navigation
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50';
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add main content landmark
  const mainContent = document.querySelector('main') || document.querySelector('#top');
  if (mainContent) {
    mainContent.id = 'main-content';
    mainContent.setAttribute('role', 'main');
  }

  // Improve form accessibility
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      if (!input.id) {
        input.id = `input-${index}`;
      }
      
      const label = form.querySelector(`label[for="${input.id}"]`);
      if (!label && input.type !== 'hidden') {
        const newLabel = document.createElement('label');
        newLabel.setAttribute('for', input.id);
        newLabel.textContent = input.placeholder || input.name || `Input ${index + 1}`;
        input.parentNode.insertBefore(newLabel, input);
      }
    });
  });

  // Add ARIA labels to interactive elements
  const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
  interactiveElements.forEach(element => {
    if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
      const title = element.getAttribute('title');
      if (title) {
        element.setAttribute('aria-label', title);
      }
    }
  });

  // Improve image accessibility
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.alt) {
      img.alt = 'Image';
    }
  });

  // Add loading states for better UX
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // Announce dynamic content changes to screen readers
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);

  window.announceToScreenReader = function(message) {
    announcer.textContent = message;
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  };
});

// Utility function for focus management
window.setFocus = function(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
};

// Utility function for trap focus in modals
window.trapFocus = function(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
};
