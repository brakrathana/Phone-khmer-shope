// Image switcher functionality
document.querySelectorAll('.image-thumb').forEach(thumb => {
    thumb.addEventListener('click', function() {
        const card = this.closest('.modern-product-card');
        const mainImage = card.querySelector('.product-main-image');
        const imageUrl = this.getAttribute('data-image');
        
        // Update main image
        mainImage.src = imageUrl;
        
        // Update active state
        card.querySelectorAll('.image-thumb').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// Filter functionality
document.querySelectorAll('.filter-chip').forEach(filter => {
    filter.addEventListener('click', function() {
        // Update active filter
        document.querySelectorAll('.filter-chip').forEach(f => f.classList.remove('active'));
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        const products = document.querySelectorAll('.modern-product-card');
        
        products.forEach(product => {
            if (filterValue === 'all') {
                product.style.display = 'block';
            } else {
                const categories = product.getAttribute('data-category');
                if (categories.includes(filterValue)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            }
        });
    });
});

// Countdown timer
function updateTimer() {
    const timerElements = document.querySelectorAll('.time-value');
    if (timerElements.length === 3) {
        let hours = parseInt(timerElements[0].textContent);
        let minutes = parseInt(timerElements[1].textContent);
        let seconds = parseInt(timerElements[2].textContent);
        
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            if (minutes < 0) {
                minutes = 59;
                hours--;
                if (hours < 0) {
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }
            }
        }
        
        timerElements[0].textContent = hours.toString().padStart(2, '0');
        timerElements[1].textContent = minutes.toString().padStart(2, '0');
        timerElements[2].textContent = seconds.toString().padStart(2, '0');
    }
}

setInterval(updateTimer, 1000);

// Wishlist toggle
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const isActive = this.classList.contains('active');
        this.classList.toggle('active');
        
        if (isActive) {
            this.innerHTML = '<i class="far fa-heart"></i>';
        } else {
            this.innerHTML = '<i class="fas fa-heart"></i>';
        }
        
        // Here you would typically make an API call to update the wishlist
        const productId = this.getAttribute('data-product-id');
        console.log(`Wishlist updated for product ${productId}`);
    });
});

// Add to cart functionality
document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.modern-product-card');
        const productName = card.querySelector('.product-title').textContent;
        const price = card.querySelector('.price').textContent;
        
        // Animation effect
        this.innerHTML = '<i class="fas fa-check"></i> Added!';
        this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            this.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        }, 2000);
        
        console.log(`Added ${productName} to cart for ${price}`);
        // Here you would typically add to cart via API
    });
});