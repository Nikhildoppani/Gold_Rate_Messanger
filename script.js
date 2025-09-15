// Utility Functions
const utils = {
  // Format number with Indian numbering system
  formatIndianNumber(num) {
    if (!num) return '';
    
    // Remove all non-digit characters except decimal point
    num = num.toString().replace(/[^\d.]/g, '');
    if (num === '') return '';
    
    const parts = num.split('.');
    let integerPart = parts[0];
    
    // Handle Indian numbering (last 3 digits, then groups of 2)
    const lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);
    
    let formattedNumber = lastThree;
    if (otherNumbers !== '') {
      formattedNumber = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    
    // Add decimal part if exists
    return parts.length > 1 ? formattedNumber + '.' + parts[1] : formattedNumber;
  },

  // Show loading overlay
  showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('show');
  },

  // Hide loading overlay
  hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('show');
  },

  // Show success toast
  showToast(title = 'Success!', message = 'Action completed successfully') {
    const toast = document.getElementById('successToast');
    const titleEl = toast.querySelector('h4');
    const messageEl = toast.querySelector('p');
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    toast.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  },

  // Animate elements on scroll
  animateOnScroll() {
    const elements = document.querySelectorAll('.input-group');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    });

    elements.forEach(el => observer.observe(el));
  },

  // Set today's date
  setTodaysDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
      const today = new Date();
      const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      };
      dateInput.value = today.toLocaleDateString('en-GB', options);
    }
  },

  // Add input animations
  addInputAnimations() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        const group = e.target.closest('.input-group');
        if (group) {
          group.style.transform = 'scale(1.02)';
          group.style.zIndex = '10';
        }
      });

      input.addEventListener('blur', (e) => {
        const group = e.target.closest('.input-group');
        if (group) {
          group.style.transform = 'scale(1)';
          group.style.zIndex = '1';
        }
      });

      // Add typing sound effect (visual feedback)
      input.addEventListener('input', (e) => {
        const highlight = e.target.nextElementSibling;
        if (highlight && highlight.classList.contains('input-highlight')) {
          highlight.style.width = '100%';
          setTimeout(() => {
            highlight.style.width = '0';
          }, 200);
        }
      });
    });
  }
};

// Message Building Functions
const messageBuilder = {
  // Build the complete WhatsApp message
  buildMessage() {
    const data = this.extractFormData();
    const lines = [];

    // Header section
    lines.push("=======================");
    lines.push(`💎 ${data.shop.toUpperCase()} 💎`);
    lines.push("=======================");
    lines.push("");
    
    // Date section
    lines.push(`📅 *${data.date}*`);
    lines.push("");
    
    // Rates title
    lines.push("💰 బంగారు & వెండి ధరలు 💰");
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━");
    lines.push("");
    
    // Telugu rates
    lines.push(`💛 బంగారు (22ct – 1gm) : *₹${data.gold}*`);
    lines.push(`🤍 వెండి (10gm)        : *₹${data.silver}*`);
    lines.push("");
    
    // English rates
    lines.push(`🌟 Gold (22ct – 1gm)   : *₹${data.gold}*`);
    lines.push(`🌟 Silver (10gm)       : *₹${data.silver}*`);
    
    // Optional Gattu Bangaram
    if (data.gattu) {
      lines.push("");
      lines.push(`💐 గట్టుబంగారు         : *₹${data.gattu}* 💐`);
    }
    
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━");
    
    // Contact info
    if (data.address) {
      lines.push(`📍 ${data.address}`);
    }
    
    if (data.extra) {
      lines.push(`☎️ ${data.extra}`);
    }
    
    lines.push("━━━━━━━━━━━━━━━━━");

    return lines.join('\n');
  },

  // Extract and format form data
  extractFormData() {
    return {
      shop: (document.getElementById('shop').value || "VENKATESWARA JEWELLER'S").trim(),
      date: document.getElementById('date').value.trim(),
      gold: utils.formatIndianNumber(document.getElementById('gold').value.trim()) || '—',
      silver: utils.formatIndianNumber(document.getElementById('silver').value.trim()) || '—',
      gattu: utils.formatIndianNumber(document.getElementById('gattu').value.trim()),
      address: document.getElementById('address').value.trim(),
      extra: document.getElementById('extra').value.trim()
    };
  }
};

// Main Application Functions
const app = {
  // Generate preview in textarea
  generatePreview() {
    utils.showLoading();
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const message = messageBuilder.buildMessage();
      const output = document.getElementById('output');
      
      output.value = message;
      output.focus();
      output.setSelectionRange(0, 0);
      
      // Add visual feedback
      output.style.background = 'rgba(212, 175, 55, 0.05)';
      setTimeout(() => {
        output.style.background = 'rgba(255, 255, 255, 0.9)';
      }, 500);
      
      utils.hideLoading();
      return message;
    }, 300);
  },

  // Copy message to clipboard
  async copyPreview() {
    const message = messageBuilder.buildMessage();
    
    try {
      await navigator.clipboard.writeText(message);
      utils.showToast('Copied!', 'Message copied to clipboard');
      
      // Update preview
      document.getElementById('output').value = message;
    } catch (error) {
      // Fallback for older browsers
      const textarea = document.getElementById('output');
      textarea.value = message;
      textarea.removeAttribute('readonly');
      textarea.select();
      
      try {
        document.execCommand('copy');
        utils.showToast('Copied!', 'Message copied to clipboard');
      } catch (fallbackError) {
        utils.showToast('Error', 'Could not copy to clipboard');
      }
      
      textarea.setAttribute('readonly', '');
    }
  },

  // Open WhatsApp with formatted message
  openWhatsApp() {
    const message = messageBuilder.buildMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    // Update preview first
    document.getElementById('output').value = message;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    utils.showToast('WhatsApp Opened!', 'Message ready to send');
  },

  // Generate preview and open WhatsApp
  generateAndOpen() {
    utils.showLoading();
    
    setTimeout(() => {
      this.generatePreview();
      setTimeout(() => {
        this.openWhatsApp();
        utils.hideLoading();
      }, 500);
    }, 200);
  },

  // Clear form fields
  clearForm() {
    // Custom confirmation dialog
    const confirmed = confirm('🗑️ Clear all fields?\n\nThis will reset all input fields except shop name, date, and address.');
    
    if (!confirmed) return;

    // Clear specific fields with animation
    const fieldsToClear = ['gold', 'silver', 'gattu', 'extra', 'output'];
    
    fieldsToClear.forEach((fieldId, index) => {
      setTimeout(() => {
        const field = document.getElementById(fieldId);
        if (field) {
          // Add clearing animation
          field.style.background = 'rgba(239, 68, 68, 0.1)';
          field.style.transform = 'scale(0.98)';
          
          setTimeout(() => {
            field.value = '';
            field.style.background = '';
            field.style.transform = '';
          }, 200);
        }
      }, index * 100);
    });

    utils.showToast('Cleared!', 'Form fields have been reset');
  },

  // Download message as text file
  downloadText() {
    const message = messageBuilder.buildMessage();
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `royal-rate-${timestamp}.txt`;
    
    const blob = new Blob([message], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    utils.showToast('Downloaded!', `File saved as ${filename}`);
  },

  // Initialize the application
  init() {
    // Set today's date
    utils.setTodaysDate();
    
    // Add input animations
    utils.addInputAnimations();
    
    // Generate initial preview
    this.generatePreview();
    
    // Add keyboard shortcuts
    this.addKeyboardShortcuts();
    
    // Add form validation
    this.addFormValidation();
    
    console.log('🎉 Royal Rate Formatter initialized successfully!');
  },

  // Add keyboard shortcuts
  addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter: Generate and open WhatsApp
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.generateAndOpen();
      }
      
      // Ctrl/Cmd + C: Copy when textarea is focused
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && e.target.id === 'output') {
        this.copyPreview();
      }
      
      // Escape: Clear form
      if (e.key === 'Escape' && e.shiftKey) {
        this.clearForm();
      }
    });
  },

  // Add form validation
  addFormValidation() {
    const numericInputs = ['gold', 'silver', 'gattu'];
    
    numericInputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', (e) => {
          let value = e.target.value;
          
          // Remove non-numeric characters except decimal point
          value = value.replace(/[^\d.]/g, '');
          
          // Ensure only one decimal point
          const parts = value.split('.');
          if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
          }
          
          e.target.value = value;
          
          // Auto-generate preview on valid input
          if (value && parseFloat(value) > 0) {
            clearTimeout(this.previewTimeout);
            this.previewTimeout = setTimeout(() => {
              this.generatePreview();
            }, 1000);
          }
        });
      }
    });
  }
};

// Global Functions (for onclick handlers)
function generatePreview() {
  app.generatePreview();
}

function copyPreview() {
  app.copyPreview();
}

function openWhatsApp() {
  app.openWhatsApp();
}

function generateAndOpen() {
  app.generateAndOpen();
}

function clearForm() {
  app.clearForm();
}

function downloadText() {
  app.downloadText();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Refresh date when page becomes visible
    utils.setTodaysDate();
  }
});

// Handle online/offline status
window.addEventListener('online', () => {
  utils.showToast('Online!', 'Connection restored');
});

window.addEventListener('offline', () => {
  utils.showToast('Offline', 'Working in offline mode');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { app, utils, messageBuilder };
}