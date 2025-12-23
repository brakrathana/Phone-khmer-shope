// cart.js - Cart functionality for Phone Khmer Shop

// Cart data structure
let cart = JSON.parse(localStorage.getItem('phoneKhmerCart')) || [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('phoneKhmerCart', JSON.stringify(cart));
    updateCartCount();
}

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('phoneKhmerCart')) || [];
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Add to cart function
function addToCart(product) {
    try {
        console.log('Adding to cart:', product);
        
        // Get current cart
        let cart = getCart();
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // Update quantity if product exists
            cart[existingItemIndex].quantity += product.quantity || 1;
        } else {
            // Add new product to cart
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || 'https://via.placeholder.com/100x100?text=No+Image',
                quantity: product.quantity || 1,
                category: product.category || 'General'
            });
        }
        
        // Save to localStorage
        localStorage.setItem('phoneKhmerCart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show success message
        showCartNotification('Product added to cart!', 'success');
        
        // Update cart dropdown if open
        updateCartDropdown();
        
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        showCartNotification('Error adding product to cart', 'error');
        return false;
    }
}

// Remove from cart
function removeFromCart(productId) {
    try {
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('phoneKhmerCart', JSON.stringify(cart));
        
        // Reload cart items if on cart page
        if (typeof loadCartItems === 'function') {
            loadCartItems();
        }
        
        // Update cart dropdown
        updateCartDropdown();
        
        // Show notification
        showCartNotification('Product removed from cart', 'info');
        
        return true;
    } catch (error) {
        console.error('Error removing from cart:', error);
        return false;
    }
}

// Update cart quantity
function updateCartQuantity(productId, newQuantity) {
    try {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        
        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = newQuantity;
            localStorage.setItem('phoneKhmerCart', JSON.stringify(cart));
            
            // Reload cart items if on cart page
            if (document.getElementById('cartItemsContainer')) {
                if (typeof loadCartItems === 'function') {
                    loadCartItems();
                }
            }
            
            // Update cart count
            updateCartCount();
            
            // Update cart dropdown
            updateCartDropdown();
        }
    } catch (error) {
        console.error('Error updating cart quantity:', error);
    }
}

// Clear cart
function clearCart() {
    localStorage.removeItem('phoneKhmerCart');
    cart = [];
    
    // Update UI
    if (typeof loadCartItems === 'function') {
        loadCartItems();
    }
    
    updateCartCount();
    updateCartDropdown();
    showCartNotification('Cart cleared', 'info');
}

// Update cart dropdown
function updateCartDropdown() {
    const cartDropdownItems = document.getElementById('cartDropdownItems');
    const cartDropdownTotal = document.getElementById('cartDropdownTotal');
    const cart = getCart();
    
    if (!cartDropdownItems) return;
    
    if (cart.length === 0) {
        cartDropdownItems.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        if (cartDropdownTotal) cartDropdownTotal.textContent = '$0.00';
        return;
    }
    
    // Clear and add items
    cartDropdownItems.innerHTML = '';
    let dropdownTotal = 0;
    
    cart.forEach(item => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        dropdownTotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-dropdown-item';
        cartItem.innerHTML = `
            <div class="cart-dropdown-item-image">
                <img src="${item.image || 'https://via.placeholder.com/50x50?text=No+Image'}" alt="${item.name}">
            </div>
            <div class="cart-dropdown-item-details">
                <h4>${item.name}</h4>
                <div class="cart-dropdown-item-price">
                    $${(item.price || 0).toFixed(2)} x ${item.quantity || 1}
                </div>
            </div>
            <div class="cart-dropdown-item-remove">
                <button onclick="removeFromCart(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        cartDropdownItems.appendChild(cartItem);
    });
    
    if (cartDropdownTotal) {
        cartDropdownTotal.textContent = `$${dropdownTotal.toFixed(2)}`;
    }
}

// Show cart notification
function showCartNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `cart-notification ${type}`;
    notification.innerHTML = `
        <div class="cart-notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateCartDropdown();
});

// Export functions for global use
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.updateCartDropdown = updateCartDropdown;