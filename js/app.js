// API Configuration and Utility Functions
const API_BASE_URL = 'https://madalali-tz-production.up.railway.app/api';


// Storage helper functions
const Storage = {
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    
    get: (key) => {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    },
    
    remove: (key) => {
        localStorage.removeItem(key);
    },
    
    clear: () => {
        localStorage.clear();
    }
};

// Get authentication token
function getAuthToken() {
    const user = Storage.get('user');
    return user ? user.token : null;
}

// Get current user
function getCurrentUser() {
    return Storage.get('user');
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getAuthToken();
}

// Logout function
function logout() {
    Storage.clear();
    window.location.href = '/index.html';
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        ...options,
        headers
    };
    
    console.log('🌐 API Request:', endpoint, options.method || 'GET');
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('❌ Server Error: Response is not JSON');
            console.error('Response status:', response.status);
            console.error('Response text:', await response.text());
            throw new Error('Server error: Invalid response format. Check if the server is running.');
        }
        
        const data = await response.json();
        console.log('📥 API Response:', data);
        
        if (!response.ok) {
            console.error('❌ API Error:', response.status, data.message);
            // Handle 401 Unauthorized - token expired
            if (response.status === 401) {
                console.warn('Token expired or invalid, logging out...');
                logout();
                return;
            }
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('❌ API Request Failed:', error);
        console.error('Endpoint:', API_BASE_URL + endpoint);
        console.error('Error details:', error.message);
        
        // Check if server is unreachable
        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            throw new Error(`Cannot connect to server at ${API_BASE_URL}. Please check if the backend server is running.`);
        }
        
        throw error;
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// Form validation helper
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    const inputs = form.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        const errorElement = input.nextElementSibling;
        
        // Reset error state
        input.classList.remove('error');
        if (errorElement && errorElement.classList.contains('form-error')) {
            errorElement.classList.remove('show');
        }
        
        // Check if required field is empty
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            if (errorElement) {
                errorElement.textContent = `${input.name || 'This field'} is required`;
                errorElement.classList.add('show');
            }
        }
        
        // Email validation
        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid email';
                    errorElement.classList.add('show');
                }
            }
        }
        
        // Password validation
        if (input.type === 'password' && input.value.trim() && input.value.length < 6) {
            isValid = false;
            input.classList.add('error');
            if (errorElement) {
                errorElement.textContent = 'Password must be at least 6 characters';
                errorElement.classList.add('show');
            }
        }
    });
    
    return isValid;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Modal helper functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modal on background click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Loading state helper
function setLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Loading...';
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || button.textContent;
    }
}

// Redirect based on user role
function redirectToDashboard(role) {
    const dashboards = {
        admin: '/admin/dashboard.html',
        agent: '/agent/dashboard.html',
        client: '/client/dashboard.html'
    };
    
    window.location.href = dashboards[role] || '/index.html';
}

// Check authentication and redirect if not logged in
function requireAuth(allowedRoles = []) {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = '/login.html';
        return false;
    }
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.user.role)) {
        showAlert('Access denied. You do not have permission to access this page.', 'danger');
        setTimeout(() => redirectToDashboard(user.user.role), 2000);
        return false;
    }
    
    return true;
}

// Prevent access if already logged in
function preventAuthAccess() {
    if (isAuthenticated()) {
        const user = getCurrentUser();
        redirectToDashboard(user.user.role);
    }
}

// Initialize common page elements
function initializePage() {
    // Update navbar based on auth status
    const user = getCurrentUser();
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarMenu && user) {
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', initializePage);

// Export functions for use in other scripts
window.API = {
    request: apiRequest,
    baseUrl: API_BASE_URL
};

window.Auth = {
    getToken: getAuthToken,
    getUser: getCurrentUser,
    isAuthenticated,
    logout,
    requireAuth,
    preventAuthAccess,
    redirectToDashboard
};

window.Utils = {
    showAlert,
    validateForm,
    formatCurrency,
    formatDate,
    debounce,
    showModal,
    hideModal,
    setLoading,
    Storage
};

// Attach logout handler globally for all .logout-btn elements
document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});

// Mobile Menu Toggle
function initializeMobileMenu() {
    // Create mobile toggle button if navbar exists and toggle doesn't exist
    const navbar = document.querySelector('.navbar .container');
    if (navbar && !document.querySelector('.navbar-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'navbar-toggle';
        toggleBtn.innerHTML = '☰';
        toggleBtn.setAttribute('aria-label', 'Toggle navigation');
        
        const menu = document.querySelector('.navbar-menu');
        const brand = document.querySelector('.navbar-brand');
        
        if (brand && menu) {
            brand.parentNode.insertBefore(toggleBtn, menu);
            
            // Toggle menu on button click
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('active');
                toggleBtn.innerHTML = menu.classList.contains('active') ? '✕' : '☰';
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbar.contains(e.target) && menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    toggleBtn.innerHTML = '☰';
                }
            });
            
            // Close menu when clicking on a link
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        menu.classList.remove('active');
                        toggleBtn.innerHTML = '☰';
                    }
                });
            });
        }
    }
    
    // Dashboard sidebar toggle
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar && mainContent && window.innerWidth <= 768) {
        // Create sidebar toggle if it doesn't exist
        if (!document.querySelector('.sidebar-toggle')) {
            const sidebarToggle = document.createElement('button');
            sidebarToggle.className = 'btn btn-primary sidebar-toggle';
            sidebarToggle.innerHTML = '☰ Menu';
            sidebarToggle.style.cssText = 'position: fixed; top: 75px; left: 10px; z-index: 1000;';
            
            document.body.appendChild(sidebarToggle);
            
            sidebarToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebar.classList.toggle('active');
            });
            
            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target) && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            });
        }
    }
}

// Initialize mobile menu on page load
document.addEventListener('DOMContentLoaded', initializeMobileMenu);

// Re-initialize on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initializeMobileMenu();
    }, 250);
});
