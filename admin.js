// Admin Panel JavaScript

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }

    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Add forms
    const addNewsForm = document.getElementById('addNewsForm');
    const addMemberForm = document.getElementById('addMemberForm');
    const addEventForm = document.getElementById('addEventForm');
    const settingsForm = document.getElementById('settingsForm');

    if (addNewsForm) addNewsForm.addEventListener('submit', handleAddNews);
    if (addMemberForm) addMemberForm.addEventListener('submit', handleAddMember);
    if (addEventForm) addEventForm.addEventListener('submit', handleAddEvent);
    if (settingsForm) settingsForm.addEventListener('submit', handleSaveSettings);

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Login handling
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple demo authentication (in real app, this would be server-side)
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid credentials! Use admin/admin123', 'error');
    }
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';

    // Load dashboard data
    loadDashboardData();
    loadNewsTable();
    loadMembersTable();
    loadEventsTable();
}

// Logout
function logout() {
    localStorage.removeItem('adminLoggedIn');
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
    showNotification('Logged out successfully!', 'success');
}

// Tab navigation
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all nav tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked nav tab
    event.target.classList.add('active');
}

// Load dashboard overview data
function loadDashboardData() {
    const newsData = window.adminFunctions.getNewsData();
    const membersData = window.adminFunctions.getMembersData();
    const eventsData = window.adminFunctions.getEventsData();

    // Update stats
    document.getElementById('totalMembers').textContent = membersData.length;
    document.getElementById('totalNews').textContent = newsData.length;
    document.getElementById('upcomingEvents').textContent = eventsData.filter(e => e.status === 'Upcoming').length;
    document.getElementById('activeMembers').textContent = membersData.filter(m => m.status === 'Active').length;

    // Load recent activities
    const activitiesList = document.getElementById('recentActivities');
    const activities = [
        { icon: 'fas fa-user-plus', text: 'New member registered: Ram Magar', time: '2 hours ago' },
        { icon: 'fas fa-newspaper', text: 'News article published: Cultural Festival 2024', time: '1 day ago' },
        { icon: 'fas fa-calendar', text: 'Event created: Health Camp', time: '2 days ago' },
        { icon: 'fas fa-edit', text: 'Member profile updated: Sita Magar', time: '3 days ago' }
    ];

    activitiesList.innerHTML = activities.map(activity => `
        <li style="display: flex; align-items: center; padding: 1rem 0; border-bottom: 1px solid #eee;">
            <i class="${activity.icon}" style="color: #ff6b35; margin-right: 1rem; width: 20px;"></i>
            <div style="flex: 1;">
                <div>${activity.text}</div>
                <small style="color: #666;">${activity.time}</small>
            </div>
        </li>
    `).join('');
}

// Load news table
function loadNewsTable() {
    const tableBody = document.getElementById('newsTable');
    const newsItems = window.adminFunctions.getNewsData();

    tableBody.innerHTML = newsItems.map(news => `
        <tr>
            <td>${news.title}</td>
            <td>${news.date}</td>
            <td><span class="badge badge-success">Published</span></td>
            <td>
                <button class="btn btn-small btn-warning" onclick="editNews(${news.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-small btn-danger" onclick="deleteNews(${news.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Load members table
function loadMembersTable() {
    const tableBody = document.getElementById('membersTable');
    const members = window.adminFunctions.getMembersData();

    tableBody.innerHTML = members.map(member => `
        <tr>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${member.membershipDate}</td>
            <td>
                <span class="badge ${member.status === 'Active' ? 'badge-success' : 'badge-warning'}">
                    ${member.status}
                </span>
            </td>
            <td>
                <button class="btn btn-small btn-warning" onclick="editMember(${member.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-small btn-danger" onclick="deleteMember(${member.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Load events table
function loadEventsTable() {
    const tableBody = document.getElementById('eventsTable');
    const events = window.adminFunctions.getEventsData();

    tableBody.innerHTML = events.map(event => `
        <tr>
            <td>${event.name}</td>
            <td>${event.date}</td>
            <td>${event.location}</td>
            <td>
                <span class="badge ${getEventStatusClass(event.status)}">
                    ${event.status}
                </span>
            </td>
            <td>
                <button class="btn btn-small btn-warning" onclick="editEvent(${event.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-small btn-danger" onclick="deleteEvent(${event.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function getEventStatusClass(status) {
    switch(status) {
        case 'Upcoming': return 'badge-primary';
        case 'Ongoing': return 'badge-warning';
        case 'Completed': return 'badge-success';
        case 'Cancelled': return 'badge-danger';
        default: return 'badge-secondary';
    }
}

// Modal functions
function showAddNewsModal() {
    document.getElementById('addNewsModal').style.display = 'block';
}

function showAddMemberModal() {
    document.getElementById('addMemberModal').style.display = 'block';
}

function showAddEventModal() {
    document.getElementById('addEventModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Add news
function handleAddNews(e) {
    e.preventDefault();

    const newNews = {
        id: Date.now(),
        title: document.getElementById('newsTitle').value,
        date: document.getElementById('newsDate').value,
        excerpt: document.getElementById('newsExcerpt').value,
        image: document.getElementById('newsImage').value || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=250&fit=crop'
    };

    const newsData = window.adminFunctions.getNewsData();
    newsData.unshift(newNews);
    window.adminFunctions.saveNewsData(newsData);

    // Refresh the main website news display
    if (window.adminFunctions.refreshNewsDisplay) {
        window.adminFunctions.refreshNewsDisplay();
    }

    loadNewsTable();
    loadDashboardData();
    closeModal('addNewsModal');
    e.target.reset();
    showNotification('News article added successfully!', 'success');
}

// Add member
function handleAddMember(e) {
    e.preventDefault();

    const newMember = {
        id: Date.now(),
        name: document.getElementById('memberName').value,
        email: document.getElementById('memberEmail').value,
        phone: document.getElementById('memberPhone').value,
        membershipDate: document.getElementById('membershipDate').value,
        status: document.getElementById('memberStatus').value
    };

    const membersData = window.adminFunctions.getMembersData();
    membersData.push(newMember);
    window.adminFunctions.saveMembersData(membersData);

    loadMembersTable();
    loadDashboardData();
    closeModal('addMemberModal');
    e.target.reset();
    showNotification('Member added successfully!', 'success');
}

// Add event
function handleAddEvent(e) {
    e.preventDefault();

    const newEvent = {
        id: Date.now(),
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        location: document.getElementById('eventLocation').value,
        status: document.getElementById('eventStatus').value
    };

    const eventsData = window.adminFunctions.getEventsData();
    eventsData.push(newEvent);
    window.adminFunctions.saveEventsData(eventsData);

    loadEventsTable();
    loadDashboardData();
    closeModal('addEventModal');
    e.target.reset();
    showNotification('Event added successfully!', 'success');
}

// Delete functions
function deleteNews(id) {
    if (confirm('Are you sure you want to delete this news article?')) {
        const newsData = window.adminFunctions.getNewsData();
        const filteredNews = newsData.filter(news => news.id !== id);
        window.adminFunctions.saveNewsData(filteredNews);

        // Refresh the main website news display
        if (window.adminFunctions.refreshNewsDisplay) {
            window.adminFunctions.refreshNewsDisplay();
        }

        loadNewsTable();
        loadDashboardData();
        showNotification('News article deleted successfully!', 'success');
    }
}

function deleteMember(id) {
    if (confirm('Are you sure you want to delete this member?')) {
        const membersData = window.adminFunctions.getMembersData();
        const filteredMembers = membersData.filter(member => member.id !== id);
        window.adminFunctions.saveMembersData(filteredMembers);

        loadMembersTable();
        loadDashboardData();
        showNotification('Member deleted successfully!', 'success');
    }
}

function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        const eventsData = window.adminFunctions.getEventsData();
        const filteredEvents = eventsData.filter(event => event.id !== id);
        window.adminFunctions.saveEventsData(filteredEvents);

        loadEventsTable();
        loadDashboardData();
        showNotification('Event deleted successfully!', 'success');
    }
}

// Edit functions (simplified for demo)
function editNews(id) {
    const newsData = window.adminFunctions.getNewsData();
    const news = newsData.find(n => n.id === id);
    if (news) {
        document.getElementById('newsTitle').value = news.title;
        document.getElementById('newsDate').value = news.date;
        document.getElementById('newsExcerpt').value = news.excerpt;
        document.getElementById('newsImage').value = news.image;
        showAddNewsModal();
        deleteNews(id); // In real app, this would be an update operation
    }
}

function editMember(id) {
    const membersData = window.adminFunctions.getMembersData();
    const member = membersData.find(m => m.id === id);
    if (member) {
        document.getElementById('memberName').value = member.name;
        document.getElementById('memberEmail').value = member.email;
        document.getElementById('memberPhone').value = member.phone;
        document.getElementById('membershipDate').value = member.membershipDate;
        document.getElementById('memberStatus').value = member.status;
        showAddMemberModal();
        deleteMember(id); // In real app, this would be an update operation
    }
}

function editEvent(id) {
    const eventsData = window.adminFunctions.getEventsData();
    const event = eventsData.find(e => e.id === id);
    if (event) {
        document.getElementById('eventName').value = event.name;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventStatus').value = event.status;
        showAddEventModal();
        deleteEvent(id); // In real app, this would be an update operation
    }
}

// Save settings
function handleSaveSettings(e) {
    e.preventDefault();

    // In a real app, these would be saved to a database
    const settings = {
        siteName: document.getElementById('siteName').value,
        siteDescription: document.getElementById('siteDescription').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value
    };

    localStorage.setItem('websiteSettings', JSON.stringify(settings));
    showNotification('Settings saved successfully!', 'success');
}

// Function to refresh the main website display
function refreshMainWebsite() {
    // Trigger storage event to refresh main website if it's open in another tab
    const event = new StorageEvent('storage', {
        key: 'websiteNewsData',
        newValue: localStorage.getItem('websiteNewsData')
    });
    window.dispatchEvent(event);

    showNotification('Website refresh signal sent!', 'success');
}

// Add some CSS for badges
const badgeStyle = document.createElement('style');
badgeStyle.textContent = `
    .badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
    }
    .badge-success { background: #28a745; color: white; }
    .badge-warning { background: #ffc107; color: #333; }
    .badge-primary { background: #007bff; color: white; }
    .badge-danger { background: #dc3545; color: white; }
    .badge-secondary { background: #6c757d; color: white; }
`;
document.head.appendChild(badgeStyle);
