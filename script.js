// Main JavaScript for Phone Khmer Shop

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize cart functionality
    initCart();
    
    // Load featured products on homepage
    if (document.querySelector('.featured-products')) {
        loadFeaturedProducts();
    }
    
    // Initialize FAQ functionality
    if (document.querySelector('.faq-section')) {
        initFAQ();
    }
    
    // Initialize modal functionality
    if (document.querySelector('.modal')) {
        initModal();
    }
    
    // Update cart count in navbar
    updateCartCount();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// Initialize Cart
function initCart() {
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('phoneKhmerShopCart')) || [];
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('phoneKhmerShopCart', JSON.stringify(cart));
        updateCartCount();
    }
    
    // Update cart count in navbar
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    }
    
    // Add item to cart
    window.addToCart = function(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1
            });
        }
        
        saveCart();
        showNotification('Product added to cart!');
    };
    
    // Remove item from cart
    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        
        // If on cart page, reload cart display
        if (window.location.pathname.includes('order.html')) {
            window.location.reload();
        }
    };
    
    // Update item quantity
    window.updateCartQuantity = function(productId, quantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveCart();
                
                // If on cart page, reload cart display
                if (window.location.pathname.includes('order.html')) {
                    window.location.reload();
                }
            }
        }
    };
    
    // Get cart items
    window.getCart = function() {
        return cart;
    };
    
    // Clear cart
    window.clearCart = function() {
        cart = [];
        saveCart();
    };
}

// Load Featured Products
function loadFeaturedProducts() {
    const productsGrid = document.querySelector('.products-grid');
    
    if (productsGrid) {
        // Sample product data (in real app, this would come from an API)
        const featuredProducts = [
            {
                id: 1,
                name: 'Samsung Galaxy S23 Ultra',
                category: 'Samsung',
                price: 1299,
                image: 'images/products/phone1.jpg',
                description: 'Latest flagship with S Pen, 200MP camera'
            },
            {
                id: 2,
                name: 'iPhone 15 Pro Max',
                category: 'iPhone',
                price: 1399,
                image: 'images/products/phone2.jpg',
                description: 'Titanium design, A17 Pro chip, 5x zoom'
            },
            {
                id: 3,
                name: 'Xiaomi 13 Pro',
                category: 'Xiaomi',
                price: 899,
                image: 'images/products/phone3.jpg',
                description: 'Leica camera, Snapdragon 8 Gen 2'
            }
        ];
        
        // Clear existing content
        productsGrid.innerHTML = '';
        
        // Add product cards
        featuredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="viewProductDetail(${product.id})">View Details</button>
                        <button class="btn btn-secondary" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">Add to Cart</button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
    }
}

// View Product Detail (for modal)
function viewProductDetail(productId) {
    // Sample product data
    const products = {
        1: {
            id: 1,
            name: 'Samsung Galaxy S23 Ultra',
            category: 'Samsung',
            price: 1299,
            image: 'images/products/phone1.jpg',
            description: 'The Samsung Galaxy S23 Ultra is the ultimate smartphone for productivity and creativity. It features a built-in S Pen, a revolutionary 200MP camera for stunning photos, and the most powerful mobile processor yet.',
            specifications: {
                'Display': '6.8" Dynamic AMOLED 2X',
                'Processor': 'Snapdragon 8 Gen 2',
                'RAM': '12GB',
                'Storage': '256GB / 512GB / 1TB',
                'Camera': '200MP + 12MP + 10MP + 10MP',
                'Battery': '5000mAh',
                'OS': 'Android 13'
            }
        },
        2: {
            id: 2,
            name: 'iPhone 15 Pro Max',
            category: 'iPhone',
            price: 1399,
            image: 'images/products/phone2.jpg',
            description: 'The iPhone 15 Pro Max features an aerospace-grade titanium design, making it the lightest Pro model ever. The A17 Pro chip enables gaming and performance previously reserved for consoles and PCs.',
            specifications: {
                'Display': '6.7" Super Retina XDR',
                'Processor': 'A17 Pro',
                'RAM': '8GB',
                'Storage': '256GB / 512GB / 1TB',
                'Camera': '48MP + 12MP + 12MP',
                'Battery': '4422mAh',
                'OS': 'iOS 17'
            }
        },
        3: {
            id: 3,
            name: 'Xiaomi 13 Pro',
            category: 'Xiaomi',
            price: 899,
            image: 'images/products/phone3.jpg',
            description: 'Co-engineered with Leica, the Xiaomi 13 Pro features a triple Leica professional optical lens. Powered by Snapdragon 8 Gen 2, it delivers exceptional performance for gaming and productivity.',
            specifications: {
                'Display': '6.73" AMOLED',
                'Processor': 'Snapdragon 8 Gen 2',
                'RAM': '12GB',
                'Storage': '256GB / 512GB',
                'Camera': '50MP + 50MP + 50MP',
                'Battery': '4820mAh',
                'OS': 'MIUI 14 based on Android 13'
            }
        }
    };
    
    const product = products[productId];
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    if (modal && modalBody) {
        // Create specifications HTML
        let specsHTML = '';
        for (const [key, value] of Object.entries(product.specifications)) {
            specsHTML += `
                <div class="spec-row">
                    <div class="spec-key">${key}</div>
                    <div class="spec-value">${value}</div>
                </div>
            `;
        }
        
        modalBody.innerHTML = `
            <div class="product-modal-content">
                <div class="modal-product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="modal-product-info">
                    <div class="modal-product-category">${product.category}</div>
                    <h2 class="modal-product-name">${product.name}</h2>
                    <div class="modal-product-price">$${product.price}</div>
                    <p class="modal-product-description">${product.description}</p>
                    
                    <div class="modal-product-specs">
                        <h3>Specifications</h3>
                        <div class="specs-list">
                            ${specsHTML}
                        </div>
                    </div>
                    
                    <div class="modal-product-actions">
                        <button class="btn btn-primary" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">Add to Cart</button>
                        <button class="btn btn-outline" onclick="window.location.href='order.html'">Buy Now</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }
}

// Initialize Modal
function initModal() {
    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (modal && closeBtn) {
        // Close modal when clicking X
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }
}

// Initialize FAQ
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: var(--shadow);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation keyframes
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--accent-color)';
            isValid = false;
        } else {
            input.style.borderColor = 'var(--border-color)';
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value)) {
                input.style.borderColor = 'var(--accent-color)';
                isValid = false;
            }
        }
        
        // Phone validation (Cambodian format)
        if (input.type === 'tel' && input.value) {
            const phonePattern = /^(\+855|0)[0-9]{8,9}$/;
            if (!phonePattern.test(input.value)) {
                input.style.borderColor = 'var(--accent-color)';
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Add CSS for modal product
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .product-modal-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
    }
    
    .modal-product-image img {
        width: 100%;
        border-radius: 10px;
    }
    
    .modal-product-category {
        color: var(--secondary-color);
        font-weight: 500;
        margin-bottom: 10px;
    }
    
    .modal-product-name {
        font-size: 28px;
        margin-bottom: 15px;
        color: var(--primary-color);
    }
    
    .modal-product-price {
        font-size: 32px;
        font-weight: 700;
        color: var(--accent-color);
        margin-bottom: 20px;
    }
    
    .modal-product-description {
        margin-bottom: 30px;
        line-height: 1.8;
    }
    
    .modal-product-specs h3 {
        font-size: 20px;
        margin-bottom: 15px;
        color: var(--primary-color);
    }
    
    .specs-list {
        margin-bottom: 30px;
    }
    
    .spec-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .spec-key {
        font-weight: 500;
    }
    
    .spec-value {
        color: var(--gray-color);
    }
    
    .modal-product-actions {
        display: flex;
        gap: 15px;
    }
    
    @media (max-width: 768px) {
        .product-modal-content {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(modalStyles);

// Add this function to handle form submission to Telegram bot
function sendToTelegramBot(formData) {
    const botToken = '8403805443:AAE1O0WpgY_RCdWSP1H-HmClw-BDJbtU-7o';
    const chatId = '1179617605'; // Your chat ID from the information above
    
    // Format the message for Telegram
    let message = `📱 *New Contact Form Submission - Phone Khmer Shop* 📱\n\n`;
    message += `*Name:* ${formData.name}\n`;
    message += `*Email:* ${formData.email}\n`;
    message += `*Phone:* ${formData.phone}\n`;
    message += `*Subject:* ${formData.subject}\n\n`;
    message += `*Message:*\n${formData.message}\n\n`;
    message += `*Submitted at:* ${new Date().toLocaleString()}`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Send to Telegram bot API
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodedMessage}&parse_mode=Markdown`;
    
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Telegram bot response:', data);
            return data.ok;
        })
        .catch(error => {
            console.error('Error sending to Telegram:', error);
            return false;
        });
}

// Update form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate form first
            if (!validateForm('contactForm')) {
                showNotification('Please fill all required fields correctly.', 'error');
                return;
            }
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Send to Telegram bot
                const telegramSuccess = await sendToTelegramBot(formData);
                
                if (telegramSuccess) {
                    // Show success message
                    showNotification('Thank you! Your message has been sent. We\'ll contact you soon.', 'success');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Also send an optional email copy (if you want both)
                    sendEmailCopy(formData);
                } else {
                    showNotification('Message sent, but we couldn\'t send notification. We\'ll still get your message.', 'warning');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Error sending message. Please try again or contact us directly.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Optional: Function to send email copy (if you have a backend)
function sendEmailCopy(formData) {
    // This is where you'd add your email sending logic
    // You might use EmailJS, Formspree, or your own backend
    
    // Example with EmailJS (you'll need to set this up):
    /*
    emailjs.send('service_id', 'template_id', formData)
        .then(response => console.log('Email sent:', response))
        .catch(error => console.error('Email error:', error));
    */
}

// Update showNotification function to handle different types
function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles based on type
    let backgroundColor = 'var(--success-color)'; // green
    if (type === 'error') backgroundColor = 'var(--accent-color)'; // red
    if (type === 'warning') backgroundColor = 'var(--warning-color, #ff9800)'; // orange
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${backgroundColor};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: var(--shadow);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add to your existing style sheet
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-success {
        background-color: var(--success-color) !important;
    }
    
    .notification-error {
        background-color: var(--accent-color) !important;
    }
    
    .notification-warning {
        background-color: var(--warning-color, #ff9800) !important;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);
// Function to send order details to Telegram
function sendOrderToTelegram(orderData) {
    const botToken = '8403805443:AAE1O0WpgY_RCdWSP1H-HmClw-BDJbtU-7o';
    const chatId = '1179617605';
    
    // Calculate total
    const total = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let message = `🛒 *New Order Received - Phone Khmer Shop* 🛒\n\n`;
    message += `*Customer:* ${orderData.customer.name}\n`;
    message += `*Phone:* ${orderData.customer.phone}\n`;
    message += `*Email:* ${orderData.customer.email}\n`;
    message += `*Address:* ${orderData.customer.address}\n\n`;
    
    message += `*Order Items:*\n`;
    orderData.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x${item.quantity} - $${item.price * item.quantity}\n`;
    });
    
    message += `\n*Subtotal:* $${total}\n`;
    message += `*Shipping:* $${orderData.shipping || 0}\n`;
    message += `*Total:* $${total + (orderData.shipping || 0)}\n\n`;
    message += `*Payment Method:* ${orderData.paymentMethod}\n`;
    message += `*Delivery Method:* ${orderData.deliveryMethod}\n\n`;
    message += `*Ordered at:* ${new Date().toLocaleString()}`;
    
    const encodedMessage = encodeURIComponent(message);
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodedMessage}&parse_mode=Markdown`;
    
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => data.ok)
        .catch(error => {
            console.error('Error sending order to Telegram:', error);
            return false;
        });
}