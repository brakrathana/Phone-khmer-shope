// Products Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize filter functionality
    initProductFilters();
    
    // Load all products
    loadAllProducts();
    
    // Initialize search functionality
    initSearch();
});

// Sample product data (in real app, this would come from an API)
const allProducts = [
    {
        id: 1,
        name: 'Samsung Galaxy S23 Ultra',
        category: 'samsung',
        price: 1299,
        image: 'images/products/Samsung Galaxy S23 Ultra.png',
        description: 'Latest flagship with S Pen, 200MP camera',
        featured: true
    },
    {
        id: 2,
        name: 'iPhone 15 Pro Max',
        category: 'iphone',
        price: 1399,
        image: 'images/products/iPhone 14 Pro.png',
        description: 'Titanium design, A17 Pro chip, 5x zoom',
        featured: true
    },
    {
        id: 3,
        name: 'Xiaomi 13 Pro',
        category: 'xiaomi',
        price: 899,
        image: 'images/products/xiaomi 13 pro.png',
        description: 'Leica camera, Snapdragon 8 Gen 2',
        featured: true
    },
    {
        id: 4,
        name: 'Samsung Galaxy Z Fold5',
        category: 'samsung',
        price: 1799,
        image: 'images/products/Samsung Galaxy Z Fold5.png',
        description: 'Foldable smartphone with S Pen support',
        featured: false
    },
    {
        id: 5,
        name: 'iPhone 14 Pro',
        category: 'iphone',
        price: 1099,
        image: 'images/products/iPhone 14 Pro.png',
        description: 'Dynamic Island, 48MP camera, A16 Bionic',
        featured: false
    },
    {
        id: 6,
        name: 'Xiaomi Redmi Note 12 Pro',
        category: 'xiaomi',
        price: 399,
        image: 'images/products/Xiaomi Redmi Note 12 Pro.png',
        description: '108MP camera, 120Hz AMOLED display',
        featured: false
    },
    {
        id: 7,
        name: 'OPPO Find X6 Pro',
        category: 'oppo',
        price: 999,
        image: 'images/products/OPPO Find X6 Pro.png',
        description: 'Hasselblad camera, Snapdragon 8 Gen 2',
        featured: false
    },
    {
        id: 8,
        name: 'Vivo X90 Pro',
        category: 'vivo',
        price: 1099,
        image: 'images/products/vivo x90 pro.png',
        description: 'Zeiss camera, MediaTek Dimensity 9200',
        featured: false
    },
    {
        id: 9,
        name: 'Samsung Galaxy A54',
        category: 'samsung',
        price: 449,
        image: 'images/products/Samsung Galaxy A54.png',
        description: 'Mid-range with 120Hz display, 4 years updates',
        featured: false
    },
    {
        id: 10,
        name: 'iPhone SE (2022)',
        category: 'iphone',
        price: 499,
        image: 'images/products/iphone se (2022).png',
        description: 'Compact design with A15 Bionic chip',
        featured: false
    },
    {
        id: 11,
        name: 'OPPO Find X9',
        category: 'oppo',
        price: 699,
        image: 'images/products/OPPO Find X9 Pro.png',
        description: 'Portrait expert camera, 100W fast charging',
        featured: false
    },
    {
        id: 12,
        name: 'Iphone 17 pro max',
        category: 'Iphon',
        price: 599,
        image: 'images/products/iphone 17 pro max.png',
        description: 'Color-changing fluorite AG glass, 50MP camera',
        featured: false
    }
];

// Load all products
function loadAllProducts(filter = 'all', searchQuery = '') {
    const productsContainer = document.getElementById('productsContainer');
    
    if (!productsContainer) return;
    
    // Clear existing products
    productsContainer.innerHTML = '';
    
    // Filter products
    let filteredProducts = allProducts;
    
    if (filter !== 'all') {
        filteredProducts = allProducts.filter(product => product.category === filter);
    }
    
    // Apply search filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }
    
    // Check if no products found
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }
    
    // Display products
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.featured ? '<div class="featured-badge">Featured</div>' : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="viewProductDetail(${product.id})">View Details</button>
                    <button class="btn btn-secondary" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">Add to Cart</button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
    
    // Add CSS for featured badge
    const featuredBadgeStyle = document.createElement('style');
    featuredBadgeStyle.textContent = `
        .featured-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background-color: var(--accent-color);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .no-products {
            text-align: center;
            padding: 60px 20px;
            grid-column: 1 / -1;
        }
        
        .no-products i {
            font-size: 60px;
            color: var(--gray-color);
            margin-bottom: 20px;
        }
        
        .no-products h3 {
            font-size: 24px;
            margin-bottom: 10px;
            color: var(--primary-color);
        }
        
        .no-products p {
            color: var(--gray-color);
        }
    `;
    if (!document.querySelector('style[data-featured-badge]')) {
        featuredBadgeStyle.setAttribute('data-featured-badge', 'true');
        document.head.appendChild(featuredBadgeStyle);
    }
}

// Get category display name
function getCategoryName(category) {
    const categories = {
        'samsung': 'Samsung',
        'iphone': 'iPhone',
        'xiaomi': 'Xiaomi',
        'oppo': 'OPPO',
        'vivo': 'Vivo'
    };
    return categories[category] || category;
}

// Initialize product filters
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            
            // Load filtered products
            loadAllProducts(filter);
        });
    });
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            loadAllProducts(getActiveFilter(), query);
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                loadAllProducts(getActiveFilter(), query);
            }
        });
        
        // Clear search on input change if empty
        searchInput.addEventListener('input', function() {
            if (this.value.trim() === '') {
                loadAllProducts(getActiveFilter());
            }
        });
    }
}

// Get active filter
function getActiveFilter() {
    const activeButton = document.querySelector('.filter-btn.active');
    return activeButton ? activeButton.getAttribute('data-filter') : 'all';
}