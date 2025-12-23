// Order Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load cart items
    loadCartItems();
    
    // Initialize checkout process
    initCheckout();
    
    // Initialize form validation
    initOrderForm();
});

// Load cart items
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCart = document.getElementById('emptyCart');
    const cart = getCart();
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartItemsContainer) cartItemsContainer.innerHTML = '';
        updateOrderSummary();
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    
    // Clear container
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        
        // Add each cart item
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="updateCartQuantity(${item.id}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
    
    // Update order summary
    updateOrderSummary();
    
    // Update review items (for checkout section)
    updateReviewItems();
}

// Update order summary
function updateOrderSummary() {
    const cart = getCart();
    
    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 10) : 0;
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + shipping + tax;
    
    // Update display
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Update review section
    document.getElementById('reviewSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('reviewShipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('reviewTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('reviewTotal').textContent = `$${total.toFixed(2)}`;
    
    // Enable/disable checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
    
    // Update order confirmation
    document.getElementById('orderTotal').textContent = `$${total.toFixed(2)}`;
}

// Update review items
function updateReviewItems() {
    const reviewItems = document.getElementById('reviewItems');
    const cart = getCart();
    
    if (reviewItems) {
        reviewItems.innerHTML = '';
        
        cart.forEach(item => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <div class="review-item-name">${item.name} x ${item.quantity}</div>
                <div class="review-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            reviewItems.appendChild(reviewItem);
        });
        
        // Add CSS for review items
        const reviewStyle = document.createElement('style');
        reviewStyle.textContent = `
            .review-item {
                display: flex;
                justify-content: space-between;
                padding: 15px 0;
                border-bottom: 1px solid var(--border-color);
            }
            
            .review-item:last-child {
                border-bottom: none;
            }
            
            .review-summary {
                margin-top: 20px;
            }
        `;
        if (!document.querySelector('style[data-review-style]')) {
            reviewStyle.setAttribute('data-review-style', 'true');
            document.head.appendChild(reviewStyle);
        }
    }
}

// Initialize checkout process
function initCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const backToCart = document.getElementById('backToCart');
    const checkoutForm = document.getElementById('checkoutForm');
    const cartSection = document.querySelector('.cart-section');
    const checkoutSection = document.getElementById('checkoutSection');
    const confirmationSection = document.getElementById('confirmationSection');
    
    // Proceed to checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cartSection) cartSection.style.display = 'none';
            if (checkoutSection) checkoutSection.style.display = 'block';
            
            // Update process steps
            updateProcessSteps(2);
        });
    }
    
    // Back to cart
    if (backToCart) {
        backToCart.addEventListener('click', function() {
            if (checkoutSection) checkoutSection.style.display = 'none';
            if (cartSection) cartSection.style.display = 'block';
            
            // Update process steps
            updateProcessSteps(1);
        });
    }
    
    // Handle form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm('checkoutForm')) {
                showNotification('Please fill all required fields correctly');
                return;
            }
            
            // Get form data
            const formData = {
                name: document.getElementById('fullName').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                district: document.getElementById('district').value,
                notes: document.getElementById('notes').value,
                payment: document.querySelector('input[name="payment"]:checked').value
            };
            
            // Generate order ID
            const orderId = 'PS-' + Date.now().toString().slice(-6);
            const orderDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Update confirmation section
            document.getElementById('orderId').textContent = orderId;
            document.getElementById('orderDate').textContent = orderDate;
            document.getElementById('orderPayment').textContent = 
                getPaymentMethodName(formData.payment);
            
            // Show confirmation
            if (checkoutSection) checkoutSection.style.display = 'none';
            if (confirmationSection) confirmationSection.style.display = 'block';
            
            // Update process steps
            updateProcessSteps(4);
            
            // Clear cart
            clearCart();
            
            // Send order to Telegram bot (simulated)
            sendOrderToTelegram(formData, orderId);
            
            // Show success message
            showNotification('Order placed successfully!');
        });
    }
}

// Update process steps
function updateProcessSteps(stepNumber) {
    const steps = document.querySelectorAll('.process-step');
    
    steps.forEach((step, index) => {
        if (index < stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Get payment method name
function getPaymentMethodName(method) {
    const methods = {
        'cash': 'Cash on Delivery',
        'aba': 'ABA Bank Transfer',
        'card': 'Credit/Debit Card'
    };
    return methods[method] || method;
}

// Initialize order form
function initOrderForm() {
    // Apply coupon code
    const applyCoupon = document.getElementById('applyCoupon');
    const couponCode = document.getElementById('couponCode');
    
    if (applyCoupon && couponCode) {
        applyCoupon.addEventListener('click', function() {
            const code = couponCode.value.trim().toUpperCase();
            
            if (code === 'PHONE10') {
                // Apply 10% discount
                const cart = getCart();
                if (cart.length > 0) {
                    showNotification('Coupon applied! 10% discount added.');
                    couponCode.value = '';
                    
                    // In a real app, you would apply the discount to the order total
                    // For now, just show a message
                }
            } else if (code) {
                showNotification('Invalid coupon code');
            }
        });
    }
    
    // City change handler
    const citySelect = document.getElementById('city');
    if (citySelect) {
        citySelect.addEventListener('change', function() {
            const districtInput = document.getElementById('district');
            if (this.value === 'phnom-penh' && districtInput) {
                districtInput.placeholder = 'e.g., Chamkarmon, Daun Penh, etc.';
            } else {
                districtInput.placeholder = '';
            }
        });
    }
}

// Send order to Telegram bot (simulated)
function sendOrderToTelegram(orderData, orderId) {
    // In a real implementation, this would send data to your Telegram bot
    // For now, we'll simulate it and log to console
    const cart = getCart(); // Note: cart is cleared after order, so this would be empty
    
    const orderDetails = {
        orderId: orderId,
        customer: orderData,
        items: cart, // Would be empty after clearCart()
        total: document.getElementById('total').textContent,
        timestamp: new Date().toISOString()
    };
    
    console.log('Order sent to Telegram bot:', orderDetails);
    
    // Example of how to actually send to a Telegram bot:
    // Telegram Bot Integration for Phone Khmer Shop

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8403805443:AAE1O0WpgY_RCdWSP1H-HmClw-BDJbtU-7o';
const TELEGRAM_CHAT_ID = '1179617605';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Telegram Bot Integration Loaded');
    
    // Initialize contact form handler
    initContactForm();
    
    // Initialize Telegram notification toggle
    if (localStorage.getItem('telegramNotifications') === 'true') {
        setupTelegramNotifications();
    }
    
    // Add Telegram notification toggle to footer
    addTelegramNotificationToggle();
});

// Initialize contact form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const telegramConsent = document.getElementById('telegramConsent');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Get form data
                const formData = {
                    name: document.getElementById('contactName').value.trim(),
                    phone: document.getElementById('contactPhone').value.trim(),
                    email: document.getElementById('contactEmail').value.trim(),
                    subject: document.getElementById('contactSubject').value,
                    message: document.getElementById('contactMessage').value.trim(),
                    telegramConsent: telegramConsent ? telegramConsent.checked : false,
                    timestamp: new Date().toISOString(),
                    ip: await getUserIP(), // Optional: Get user IP
                    userAgent: navigator.userAgent,
                    pageUrl: window.location.href
                };
                
                // Validate form
                if (!validateContactForm(formData)) {
                    showStatus('Please fill in all required fields correctly.', 'error');
                    return;
                }
                
                // Send to Telegram
                const telegramSent = await sendContactToTelegram(formData);
                
                // Also send to your server/backend if needed
                const serverSent = await sendContactToServer(formData);
                
                if (telegramSent || serverSent) {
                    // Show success message
                    showStatus('Thank you! Your message has been sent successfully. We will contact you soon.', 'success');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Store in local storage (optional)
                    storeContactSubmission(formData);
                    
                    // Send confirmation if user consented
                    if (formData.telegramConsent && formData.phone) {
                        await sendTelegramConfirmation(formData);
                    }
                } else {
                    showStatus('Unable to send message. Please try again later.', 'error');
                }
                
            } catch (error) {
                console.error('Error submitting contact form:', error);
                showStatus('An error occurred. Please try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Send contact form data to Telegram
async function sendContactToTelegram(contactData) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('Telegram bot not configured');
        return false;
    }
    
    try {
        // Format the message with all data
        const message = formatContactMessage(contactData);
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        });
        
        const data = await response.json();
        
        // Send additional data as separate message if needed
        if (contactData.message.length > 1000) {
            const followUpMessage = `
<b>📝 Full Message:</b>
${contactData.message}

<b>📱 User Agent:</b>
${contactData.userAgent}

<b>🌐 Page URL:</b>
${contactData.pageUrl}

<b>🕒 Local Time:</b>
${new Date(contactData.timestamp).toLocaleString()}
            `;
            
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: followUpMessage,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                })
            });
        }
        
        return data.ok;
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        return false;
    }
}

// Format contact message for Telegram
function formatContactMessage(contactData) {
    const subjectText = {
        'product-inquiry': '📱 Product Inquiry',
        'order-status': '📦 Order Status',
        'warranty': '🔧 Warranty & Support',
        'business': '🤝 Business Partnership',
        'other': '📨 Other'
    }[contactData.subject] || contactData.subject;
    
    const telegramStatus = contactData.telegramConsent ? '✅ Yes' : '❌ No';
    
    let message = `
🎯 <b>NEW CONTACT FORM SUBMISSION</b>
━━━━━━━━━━━━━━━━━━━━━━━

👤 <b>Customer Information:</b>
├ Name: <b>${escapeHTML(contactData.name)}</b>
├ Phone: <code>${escapeHTML(contactData.phone)}</code>
├ Email: <code>${escapeHTML(contactData.email)}</code>
└ Telegram Updates: ${telegramStatus}

📌 <b>Contact Details:</b>
├ Subject: ${subjectText}
├ Message Preview: ${contactData.message.substring(0, 200)}${contactData.message.length > 200 ? '...' : ''}
└ Full message sent as follow-up

📊 <b>Technical Details:</b>
├ IP: <code>${contactData.ip || 'Not available'}</code>
├ Submitted: ${new Date(contactData.timestamp).toLocaleString()}
└ URL: ${contactData.pageUrl}
━━━━━━━━━━━━━━━━━━━━━━━
💡 <i>Action Required: Follow up with customer within 24 hours</i>
    `;
    
    return message;
}

// Send confirmation to user via Telegram
async function sendTelegramConfirmation(contactData) {
    try {
        const confirmationMessage = `
Hello ${contactData.name}! 👋

Thank you for contacting Phone Khmer Shop!

We have received your message regarding "${contactData.subject}".
Our team will review your inquiry and contact you within 24 hours.

For urgent matters, please call us at: 012 345 678

Best regards,
Phone Khmer Shop Team
        `;
        
        // If you have user's Telegram chat ID, you can send direct message
        // Otherwise, you could send SMS or email confirmation
        console.log('Confirmation message ready for:', contactData.phone);
        
    } catch (error) {
        console.error('Error sending confirmation:', error);
    }
}

// Helper function to escape HTML for Telegram
function escapeHTML(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Validate contact form
function validateContactForm(data) {
    if (!data.name || data.name.length < 2) return false;
    if (!data.phone || !/^[0-9+()\-\s]{10,}$/.test(data.phone)) return false;
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return false;
    if (!data.subject) return false;
    if (!data.message || data.message.length < 10) return false;
    return true;
}

// Show status message
function showStatus(message, type = 'info') {
    let statusDiv = document.getElementById('contactStatus');
    
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'contactStatus';
        const contactSection = document.querySelector('.contact-section');
        if (contactSection) {
            contactSection.appendChild(statusDiv);
        }
    }
    
    statusDiv.className = `status-message ${type}`;
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 10000);
}

// Store submission in local storage (for backup)
function storeContactSubmission(data) {
    try {
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push({
            ...data,
            storedAt: new Date().toISOString()
        });
        
        // Keep only last 50 submissions
        if (submissions.length > 50) {
            submissions.shift();
        }
        
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    } catch (error) {
        console.error('Error storing contact submission:', error);
    }
}

// Get user IP (optional)
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'Not available';
    }
}

// Send to server backend (optional)
async function sendContactToServer(data) {
    try {
        // Replace with your actual endpoint
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        return response.ok;
    } catch (error) {
        console.warn('Server submission failed:', error);
        return false;
    }
}

// Add Telegram notification toggle (same as before)
function addTelegramNotificationToggle() {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    const notificationSection = document.createElement('div');
    notificationSection.className = 'notification-preference';
    notificationSection.innerHTML = `
        <div class="container">
            <div class="telegram-notification">
                <div>
                    <h4><i class="fab fa-telegram-plane"></i> Get Telegram Updates</h4>
                    <p>Receive order confirmations, promotions, and support via Telegram</p>
                    <small>We'll never spam you. Unsubscribe anytime.</small>
                </div>
                <label class="switch">
                    <input type="checkbox" id="telegramNotificationToggle">
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    `;
    
    const footerBottom = footer.querySelector('.footer-bottom');
    if (footerBottom) {
        footer.insertBefore(notificationSection, footerBottom);
    } else {
        footer.appendChild(notificationSection);
    }
    
    const toggle = document.getElementById('telegramNotificationToggle');
    if (toggle) {
        toggle.checked = localStorage.getItem('telegramNotifications') === 'true';
        
        toggle.addEventListener('change', function() {
            const isEnabled = this.checked;
            localStorage.setItem('telegramNotifications', isEnabled);
            
            if (isEnabled) {
                showStatus('Telegram notifications enabled! You will receive updates about your orders.', 'success');
                setupTelegramNotifications();
            } else {
                showStatus('Telegram notifications disabled.', 'info');
            }
        });
    }
    
    // Add CSS styles...
}

function setupTelegramNotifications() {
    console.log('Telegram notifications enabled');
}
}

// Add CSS for order process
const orderStyles = document.createElement('style');
orderStyles.textContent = `
    .process-steps {
        position: relative;
        margin-bottom: 40px;
    }
    
    .process-step {
        text-align: center;
        z-index: 2;
    }
    
    .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--border-color);
        color: var(--dark-color);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin: 0 auto 10px;
        transition: var(--transition);
    }
    
    .process-step.active .step-number {
        background-color: var(--secondary-color);
        color: white;
    }
    
    .process-steps:before {
        content: '';
        position: absolute;
        top: 20px;
        left: 50px;
        right: 50px;
        height: 2px;
        background-color: var(--border-color);
        z-index: 1;
    }
    
    @media (max-width: 768px) {
        .process-steps:before {
            left: 40px;
            right: 40px;
        }
    }
    
    @media (max-width: 576px) {
        .process-steps:before {
            display: none;
        }
        
        .process-steps {
            flex-direction: column;
            gap: 20px;
        }
        
        .process-step {
            flex-direction: row;
            justify-content: flex-start;
            gap: 15px;
        }
        
        .step-number {
            margin: 0;
        }
    }
    
    .payment-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        margin-top: 10px;
    }
    
    .payment-option {
        border: 2px solid var(--border-color);
        border-radius: 10px;
        padding: 15px;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .payment-option:hover {
        border-color: var(--secondary-color);
    }
    
    .payment-option input[type="radio"] {
        display: none;
    }
    
    .payment-option input[type="radio"]:checked + .payment-content {
        color: var(--secondary-color);
    }
    
    .payment-option input[type="radio"]:checked + .payment-content i {
        color: var(--secondary-color);
    }
    
    .payment-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .payment-content i {
        font-size: 24px;
        color: var(--gray-color);
    }
    
    .confirmation-content {
        text-align: center;
        padding: 40px 20px;
        background-color: white;
        border-radius: 10px;
        box-shadow: var(--shadow);
    }
    
    .confirmation-icon {
        font-size: 80px;
        color: var(--success-color);
        margin-bottom: 20px;
    }
    
    .confirmation-content h2 {
        font-size: 32px;
        margin-bottom: 15px;
        color: var(--primary-color);
    }
    
    .confirmation-content p {
        margin-bottom: 30px;
        color: var(--gray-color);
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .order-details {
        background-color: var(--light-gray);
        padding: 25px;
        border-radius: 10px;
        margin: 30px auto;
        max-width: 500px;
        text-align: left;
    }
    
    .order-info p {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }
    
    .order-info strong {
        color: var(--primary-color);
    }
    
    .confirmation-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 30px;
    }
    
    @media (max-width: 576px) {
        .confirmation-actions {
            flex-direction: column;
        }
        
        .confirmation-actions .btn {
            width: 100%;
        }
    }
`;
document.head.appendChild(orderStyles);
