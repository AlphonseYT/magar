// Initialize default news data
const defaultNewsData = [
    {
        id: 1,
        title: "Annual Cultural Festival 2024",
        date: "December 15, 2024",
        excerpt: "Join us for our biggest cultural celebration featuring traditional dances, music, and food.",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=250&fit=crop"
    },
    {
        id: 2,
        title: "Scholarship Program Applications Open",
        date: "December 10, 2024",
        excerpt: "We are now accepting applications for our 2025 education scholarship program.",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop"
    },
    {
        id: 3,
        title: "Community Health Camp",
        date: "December 5, 2024",
        excerpt: "Free health checkups and medical consultations for all community members.",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop"
    },
    {
        id: 4,
        title: "Youth Leadership Workshop",
        date: "November 28, 2024",
        excerpt: "Empowering young Magar leaders with skills and knowledge for community development.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop"
    },
    {
        id: 5,
        title: "Traditional Craft Exhibition",
        date: "November 20, 2024",
        excerpt: "Showcasing beautiful handmade crafts and traditional art by Magar artisans.",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop"
    },
    {
        id: 6,
        title: "Women Empowerment Program",
        date: "November 15, 2024",
        excerpt: "Supporting women in our community with skill development and entrepreneurship training.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop"
    }
];

// Load news data from localStorage or use default
function getNewsData() {
    const stored = localStorage.getItem('websiteNewsData');
    if (stored) {
        return JSON.parse(stored);
    } else {
        // First time loading, save default data
        localStorage.setItem('websiteNewsData', JSON.stringify(defaultNewsData));
        return defaultNewsData;
    }
}

// Get current news data
let newsData = getNewsData();

let newsDisplayed = 0;
const newsPerPage = 3;

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('.nav ul');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navUl.classList.toggle('active');
        });
    }

    // Load initial news
    loadMoreNews();

    // Listen for storage changes (when admin updates data)
    window.addEventListener('storage', function(e) {
        if (e.key === 'websiteNewsData') {
            refreshNewsDisplay();
        }
    });

    // Also refresh when window gets focus (in case admin was used in same tab)
    window.addEventListener('focus', function() {
        refreshNewsDisplay();
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });
});

// Load more news function
function loadMoreNews() {
    // Refresh news data from localStorage
    newsData = getNewsData();

    const newsGrid = document.getElementById('newsGrid');
    const remainingNews = newsData.slice(newsDisplayed, newsDisplayed + newsPerPage);

    remainingNews.forEach(news => {
        const newsCard = createNewsCard(news);
        newsGrid.appendChild(newsCard);
    });

    newsDisplayed += remainingNews.length;

    // Hide load more button if all news are displayed
    const loadMoreBtn = document.querySelector('.news .btn');
    if (newsDisplayed >= newsData.length) {
        loadMoreBtn.style.display = 'none';
    }
}

// Function to refresh news display
function refreshNewsDisplay() {
    newsData = getNewsData();
    newsDisplayed = 0;
    const newsGrid = document.getElementById('newsGrid');
    if (newsGrid) {
        newsGrid.innerHTML = '';
        const loadMoreBtn = document.querySelector('.news .btn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'block';
        }
        loadMoreNews();
    }
}

// Create news card element
function createNewsCard(news) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
        <img src="${news.image}" alt="${news.title}" loading="lazy">
        <div class="news-card-content">
            <h3>${news.title}</h3>
            <div class="date">${news.date}</div>
            <p>${news.excerpt}</p>
        </div>
    `;
    return card;
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Show success message (in real app, you'd send this to a server)
    alert('Thank you for your message! We will get back to you soon.');

    // Reset form
    e.target.reset();
}

// Utility function to show notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.service-card, .news-card, .about-content, .stats');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Initialize default members data
const defaultMembersData = [
    { id: 1, name: "Ram Magar", email: "ram@example.com", phone: "9841234567", membershipDate: "2020-01-15", status: "Active" },
    { id: 2, name: "Sita Magar", email: "sita@example.com", phone: "9841234568", membershipDate: "2021-03-20", status: "Active" },
    { id: 3, name: "Hari Magar", email: "hari@example.com", phone: "9841234569", membershipDate: "2019-07-10", status: "Inactive" }
];

// Initialize default events data
const defaultEventsData = [
    { id: 1, name: "Cultural Festival", date: "2024-12-15", location: "Kathmandu", status: "Upcoming" },
    { id: 2, name: "Health Camp", date: "2024-12-05", location: "Pokhara", status: "Completed" }
];

// Functions to get data from localStorage
function getMembersData() {
    const stored = localStorage.getItem('websiteMembersData');
    if (stored) {
        return JSON.parse(stored);
    } else {
        localStorage.setItem('websiteMembersData', JSON.stringify(defaultMembersData));
        return defaultMembersData;
    }
}

function getEventsData() {
    const stored = localStorage.getItem('websiteEventsData');
    if (stored) {
        return JSON.parse(stored);
    } else {
        localStorage.setItem('websiteEventsData', JSON.stringify(defaultEventsData));
        return defaultEventsData;
    }
}

// Functions to save data to localStorage
function saveNewsData(data) {
    localStorage.setItem('websiteNewsData', JSON.stringify(data));
}

function saveMembersData(data) {
    localStorage.setItem('websiteMembersData', JSON.stringify(data));
}

function saveEventsData(data) {
    localStorage.setItem('websiteEventsData', JSON.stringify(data));
}

// Global admin functions (used in admin.html)
window.adminFunctions = {
    // Data management functions
    getNewsData: getNewsData,
    getMembersData: getMembersData,
    getEventsData: getEventsData,
    saveNewsData: saveNewsData,
    saveMembersData: saveMembersData,
    saveEventsData: saveEventsData,
    refreshNewsDisplay: refreshNewsDisplay
};

// Export for admin use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { newsData, loadMoreNews, createNewsCard };
}
