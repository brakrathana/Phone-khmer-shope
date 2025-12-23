// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form
    initContactForm();
    
    // Initialize FAQ if exists
    if (document.querySelector('.faq-section')) {
        initFAQ();
    }
});

// Initialize contact form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) { // Changed to async
            e.preventDefault();
            
            // Validate form
            if (!validateForm('contactForm')) {
                showNotification('Please fill all required fields correctly', 'error');
                return;
            }
            
            // Get form data
            const formData = {
                name: document.getElementById('contactName').value,
                phone: document.getElementById('contactPhone').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value,
                timestamp: new Date().toISOString()
            };
            
            try {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Save to localStorage (for demo purposes)
                saveContactMessage(formData);
                
                // Send to Telegram bot
                const telegramResult = await sendContactToTelegram(formData);
                
                // Show success message
                showNotification('Message sent successfully! We will contact you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
                console.error('Form submission error:', error);
            } finally {
                // Restore button state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        });
    }
}

// Save contact message (for demo)
function saveContactMessage(formData) {
    // Get existing messages or create new array
    let messages = JSON.parse(localStorage.getItem('phoneKhmerShopMessages')) || [];
    
    // Add new message
    messages.push(formData);
    
    // Save back to localStorage
    localStorage.setItem('phoneKhmerShopMessages', JSON.stringify(messages));
    
    console.log('Contact message saved:', formData);
}

// Send contact message to Telegram bot (ACTUAL IMPLEMENTATION)
async function sendContactToTelegram(formData) {
    // Your Telegram Bot API credentials
    const BOT_TOKEN = '8403805443:AAE1O0WpgY_RCdWSP1H-HmClw-BDJbtU-7o';
    const CHAT_ID = '1179617605'; // Your user ID from the message
    
    // Format the subject
    const subjectText = {
        'product-inquiry': 'Product Inquiry 📱',
        'order-status': 'Order Status 📦',
        'warranty': 'Warranty & Support 🔧',
        'business': 'Business Partnership 🤝',
        'other': 'Other ❓'
    }[formData.subject] || formData.subject;
    
    // Format the message for Telegram
    const messageText = `
🎯 *NEW CONTACT FORM SUBMISSION*
    
👤 *Name:* ${formData.name || 'Not provided'}
📞 *Phone:* ${formData.phone || 'Not provided'}
📧 *Email:* ${formData.email || 'Not provided'}
🏷️ *Subject:* ${subjectText}
    
💬 *Message:*
${formData.message}
    
⏰ *Time:* ${new Date().toLocaleString('en-US', { 
    timeZone: 'Asia/Phnom_Penh',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})}
    
✅ *Submitted via Phone Khmer Shop Website*
    `;
    
    // Telegram API URL
    const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: messageText,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            })
        });
        
        const result = await response.json();
        
        if (!result.ok) {
            throw new Error(`Telegram API Error: ${result.description}`);
        }
        
        console.log('✅ Message sent to Telegram successfully:', result);
        return result;
        
    } catch (error) {
        console.error('❌ Failed to send to Telegram:', error);
        // You can also send a backup notification or save for later retry
        backupToLocalStorage(formData);
        throw error;
    }
}

// Backup function if Telegram fails
function backupToLocalStorage(formData) {
    let failedMessages = JSON.parse(localStorage.getItem('failedTelegramMessages')) || [];
    formData.failedAt = new Date().toISOString();
    failedMessages.push(formData);
    localStorage.setItem('failedTelegramMessages', JSON.stringify(failedMessages));
    console.log('Message saved for retry:', formData);
}

// Phone number validation for Cambodia
function validateCambodianPhone(phone) {
    const pattern = /^(\+855|0)[0-9]{8,9}$/;
    return pattern.test(phone);
}

// Override the general validateForm for contact page if needed
const originalValidateForm = window.validateForm;
window.validateForm = function(formId) {
    const isValid = originalValidateForm(formId);
    
    // Additional validation for contact form
    if (formId === 'contactForm') {
        const phoneInput = document.getElementById('contactPhone');
        if (phoneInput && phoneInput.value) {
            if (!validateCambodianPhone(phoneInput.value)) {
                phoneInput.style.borderColor = 'var(--accent-color)';
                showNotification('Please enter a valid Cambodian phone number (e.g., +85512345678 or 012345678)', 'error');
                return false;
            }
        }
    }
    
    return isValid;
};

// Helper notification function (add if not exists)
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}