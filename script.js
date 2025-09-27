// Utility Functions
const utils = {
  // Format number with Indian numbering system
  formatIndianNumber(num) {
    if (!num) return '';
    
    num = num.toString().replace(/[^\d.]/g, '');
    if (num === '') return '';
    
    const parts = num.split('.');
    let integerPart = parts[0];
    const lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);
    
    let formattedNumber = lastThree;
    if (otherNumbers !== '') {
      formattedNumber = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    
    return parts.length > 1 ? formattedNumber + '.' + parts[1] : formattedNumber;
  },

  showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('show');
  },

  hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('show');
  },

  showToast(title = 'Success!', message = 'Action completed successfully') {
    const toast = document.getElementById('successToast');
    const titleEl = toast.querySelector('h4');
    const messageEl = toast.querySelector('p');
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  },

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

  setTodaysDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
      const today = new Date();
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      dateInput.value = today.toLocaleDateString('en-GB', options);
    }
  },

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
  buildMessage() {
    const data = this.extractFormData();
    const lines = [];

    lines.push("=======================");
    lines.push(`💎 ${data.shop.toUpperCase()} 💎`);
    lines.push("=======================");
    lines.push("");
    
    lines.push(`📅 *${data.date}*`);
    lines.push("");
    
    lines.push("💰 బంగారు & వెండి ధరలు 💰");
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━");
    lines.push("");
    
    lines.push(`💛 బంగారు (22ct – 1gm) : *₹${data.gold}*`);
    lines.push(`🤍 వెండి (10gm)        : *₹${data.silver}*`);
    lines.push("");
    
    lines.push(`🌟 Gold (22ct – 1gm)   : *₹${data.gold}*`);
    lines.push(`🌟 Silver (10gm)       : *₹${data.silver}*`);
    
    if (data.gattu) {
      lines.push("");
      lines.push(`💐 గట్టుబంగారు         : *₹${data.gattu}* 💐`);
    }
    
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━");
    
    if (data.address) {
      const [shopAddress, contact, mapLink] = data.address.split('|');
      lines.push(`*Address :* ${shopAddress.trim()} | ${contact ? contact.trim() : ''}`);
      if (mapLink) {
        lines.push(`*Location :* ${mapLink.trim()}`);
      }
    }
    
    if (data.extra) {
      lines.push(`☎️ ${data.extra}`);
    }
    
    lines.push("━━━━━━━━━━━━━━━━━");

    return lines.join('\n');
  },

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

// Main Application
const app = {
  generatePreview() {
    utils.showLoading();
    
    setTimeout(() => {
      const message = messageBuilder.buildMessage();
      const output = document.getElementById('output');
      
      output.value = message;
      output.focus();
      output.setSelectionRange(0, 0);
      
      output.style.background = 'rgba(212, 175, 55, 0.05)';
      setTimeout(() => {
        output.style.background = 'rgba(255, 255, 255, 0.9)';
      }, 500);
      
      utils.hideLoading();
      return message;
    }, 300);
  },

  async copyPreview() {
    const message = messageBuilder.buildMessage();
    try {
      await navigator.clipboard.writeText(message);
      utils.showToast('Copied!', 'Message copied to clipboard');
      document.getElementById('output').value = message;
    } catch (error) {
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

  openWhatsApp() {
    const message = messageBuilder.buildMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    document.getElementById('output').value = message;
    window.open(whatsappUrl, '_blank');
    utils.showToast('WhatsApp Opened!', 'Message ready to send');
  },

  // 🔥 Modified to also send data to Google Sheet
  async generateAndOpen() {
    utils.showLoading();
    
    setTimeout(async () => {
      const message = this.generatePreview();
      const data = messageBuilder.extractFormData();

      // ✅ Send to Google Sheet
      await sendToSheet(data);

      setTimeout(() => {
        this.openWhatsApp();
        utils.hideLoading();
      }, 500);
    }, 200);
  },

  clearForm() {
    const confirmed = confirm('🗑️ Clear all fields?\n\nThis will reset all input fields except shop name, date, and address.');
    if (!confirmed) return;
    const fieldsToClear = ['gold', 'silver', 'gattu', 'extra', 'output'];
    fieldsToClear.forEach((fieldId, index) => {
      setTimeout(() => {
        const field = document.getElementById(fieldId);
        if (field) {
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

  init() {
    utils.setTodaysDate();
    utils.addInputAnimations();
    this.generatePreview();
    this.addKeyboardShortcuts();
    this.addFormValidation();
    console.log('🎉 Royal Rate Formatter initialized successfully!');
  },

  addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.generateAndOpen();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && e.target.id === 'output') {
        this.copyPreview();
      }
      if (e.key === 'Escape' && e.shiftKey) {
        this.clearForm();
      }
    });
  },

  addFormValidation() {
    const numericInputs = ['gold', 'silver', 'gattu'];
    numericInputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', (e) => {
          let value = e.target.value;
          value = value.replace(/[^\d.]/g, '');
          const parts = value.split('.');
          if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
          }
          e.target.value = value;
        });
      }
    });
  }
};

// ✅ New function: send to Google Sheets
async function sendToSheet(data) {
  const url = "https://script.google.com/macros/s/AKfycbwdKNc5VJVts9zEjuz8Prk2ASG2GTA418phKYHanPhJJ1Swx7-wxCMGdG1FcfAJrH6O/exec"; // Replace with your Apps Script Web App URL
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        gold24: data.gattu || '',
        gold22: data.gold || '',
        silver: data.silver || ''
      })
    });
    const result = await response.text();
    console.log("Google Sheet Response:", result);
    utils.showToast("Saved!", "Rates updated in Google Sheet");
  } catch (err) {
    console.error("Error sending to sheet:", err);
    utils.showToast("Error", "Could not update Google Sheet");
  }
}

// Global Functions
function generatePreview() { app.generatePreview(); }
function copyPreview() { app.copyPreview(); }
function openWhatsApp() { app.openWhatsApp(); }
function generateAndOpen() { app.generateAndOpen(); }
function clearForm() { app.clearForm(); }
function downloadText() { app.downloadText(); }

document.addEventListener('DOMContentLoaded', () => { app.init(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) utils.setTodaysDate(); });
window.addEventListener('online', () => { utils.showToast('Online!', 'Connection restored'); });
window.addEventListener('offline', () => { utils.showToast('Offline', 'Working in offline mode'); });

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { app, utils, messageBuilder };
}
