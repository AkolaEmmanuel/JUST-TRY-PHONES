// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    
    mobileMenuBtn.addEventListener('click', function() {
        navbar.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Cart functionality
    let cart = [];
    const cartCount = document.querySelector('.cart-count');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const orderSummaryContainer = document.querySelector('.order-summary .cart-items');
    const subtotalElements = document.querySelectorAll('.subtotal-amount');
    const totalElements = document.querySelectorAll('.total-amount');
    const shippingElements = document.querySelectorAll('.shipping-amount');
    const cartModal = document.querySelector('.cart-modal');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartIcon = document.querySelector('.cart-icon a');
    const viewCartBtn = document.querySelector('.view-cart');
    const checkoutBtn = document.querySelector('.checkout');
    const successModal = document.querySelector('.success-modal');
    const closeSuccessBtn = document.querySelector('.close-success');

    // Add to cart functionality
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            // Check if item already exists in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }
            
            updateCart();
            showCartNotification();
        });
    });

    // Update cart function
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items in order summary
        if (cart.length === 0) {
            orderSummaryContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            document.querySelector('.order-summary .empty-cart').style.display = 'block';
        } else {
            orderSummaryContainer.innerHTML = '';
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">&times;</button>
                `;
                orderSummaryContainer.appendChild(cartItemElement);
            });
        }
        
        // Update cart modal items
        const cartModalItems = document.querySelector('.cart-modal-items');
        if (cart.length === 0) {
            cartModalItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartModalItems.innerHTML = '';
            cart.forEach(item => {
                const cartModalItem = document.createElement('div');
                cartModalItem.className = 'cart-modal-item';
                cartModalItem.innerHTML = `
                    <div class="cart-modal-item-info">
                        <p class="cart-modal-item-name">${item.name} × ${item.quantity}</p>
                        <p class="cart-modal-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button class="cart-modal-item-remove" data-id="${item.id}">&times;</button>
                `;
                cartModalItems.appendChild(cartModalItem);
            });
        }
        
        // Calculate totals
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 15.00 : 0.00; // Example shipping calculation
        const total = subtotal + shipping;
        
        // Update totals in all locations
        subtotalElements.forEach(el => el.textContent = $${subtotal.toFixed(2)});
        shippingElements.forEach(el => el.textContent = $${shipping.toFixed(2)});
        totalElements.forEach(el => el.textContent = $${total.toFixed(2)});
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-item-remove, .cart-modal-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                cart = cart.filter(item => item.id !== itemId);
                updateCart();
            });
        });
    }

    // Show cart notification
    function showCartNotification() {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = 'Item added to cart';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // Cart modal functionality
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.classList.add('active');
    });

    closeCartBtn.addEventListener('click', function() {
        cartModal.classList.remove('active');
    });

    viewCartBtn?.addEventListener('click', function() {
        cartModal.classList.remove('active');
        document.querySelector('#order').scrollIntoView({ behavior: 'smooth' });
    });

    checkoutBtn?.addEventListener('click', function() {
        cartModal.classList.remove('active');
        document.querySelector('#order').scrollIntoView({ behavior: 'smooth' });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });

    // Form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, you would process the payment here
            // For demo purposes, we'll just show a success message
            
            // Reset cart
            cart = [];
            updateCart();
            
            // Show success modal
            successModal.classList.add('active');
            
            // Reset form
            this.reset();
        });
    }

    // Close success modal
    closeSuccessBtn?.addEventListener('click', function() {
        successModal.classList.remove('active');
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                navbar.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add this CSS for the cart notification (should be added to your CSS file)
/*
.cart-notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #10b981;
    color: white;
    padding: 12px 24px;
    border-radius: 50px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.cart-notification.show {
    opacity: 1;
}
*/