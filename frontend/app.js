// ============ GOOGLE CLIENT ID ============
const GOOGLE_CLIENT_ID = '956139573371-kk1o33j2kcfrri7mgmh4p64ojh3jkfjd.apps.googleusercontent.com';

// ============ GLOBAL VARIABLES ============
let currentUser = null;
let appData = null;
let weeklyChartInst = null;
let distributionChart = null;
let categoryChart = null;
let timerInterval = null;
let timerSeconds = 25 * 60;
let timerRunning = false;
let currentTwisterIdx = 0;
let currentPassageIdx = 0;

// ============ READING PASSAGES ============
const READING_PASSAGES = [
    { text: "The sun is shining brightly today. The birds are singing in the trees. It is a beautiful day to go outside and play.", level: "Easy", difficulty: 1, words: 20 },
    { text: "I like to read books. Reading helps me learn new things. My favorite books are about animals and nature.", level: "Easy", difficulty: 1, words: 18 },
    { text: "My family likes to eat dinner together every evening. We talk about our day and share happy moments.", level: "Easy", difficulty: 1, words: 18 },
    { text: "The cat sleeps on the soft couch. The dog plays in the green yard. They are best friends.", level: "Easy", difficulty: 1, words: 16 },
    { text: "Water is essential for life. We should drink plenty of water every day to stay healthy and active.", level: "Easy", difficulty: 1, words: 17 },
    { text: "Technology has transformed the way we communicate with each other. Smartphones and social media platforms allow us to connect with people across the globe instantly.", level: "Medium", difficulty: 2, words: 24 },
    { text: "Artificial intelligence is revolutionizing various industries. From healthcare to transportation, AI systems are helping doctors diagnose diseases and enabling self-driving cars.", level: "Medium", difficulty: 2, words: 25 },
    { text: "Climate change is one of the most pressing challenges facing humanity. Rising temperatures and extreme weather events demand immediate action.", level: "Medium", difficulty: 2, words: 22 },
    { text: "The rapid advancement of quantum computing promises to revolutionize fields such as cryptography, drug discovery, and climate modeling.", level: "Hard", difficulty: 3, words: 20 },
    { text: "Neuroscience has revealed that neuroplasticity—the brain's ability to reorganize itself—continues throughout life, enabling lifelong learning.", level: "Hard", difficulty: 3, words: 19 },
    { text: "Blockchain technology extends beyond cryptocurrency applications, offering solutions for supply chain transparency and digital identity verification.", level: "Hard", difficulty: 3, words: 20 }
];

// ============ TONGUE TWISTERS ============
const TONGUE_TWISTERS = [
    { text: 'She sells seashells by the seashore', difficulty: 'easy' },
    { text: 'Peter Piper picked a peck of pickled peppers', difficulty: 'easy' },
    { text: 'How much wood would a woodchuck chuck', difficulty: 'easy' },
    { text: 'I scream you scream we all scream for ice cream', difficulty: 'easy' },
    { text: 'Fuzzy Wuzzy was a bear', difficulty: 'easy' },
    { text: 'A big black bug bit a big black bear', difficulty: 'medium' },
    { text: 'Red lorry yellow lorry red lorry yellow lorry', difficulty: 'medium' },
    { text: 'Unique New York you know you need unique New York', difficulty: 'medium' },
    { text: 'Six slippery snails slid slowly seaward', difficulty: 'medium' },
    { text: 'Pad kid poured curd pulled cod', difficulty: 'hard' },
    { text: 'Irish wristwatch Swiss wristwatch', difficulty: 'hard' },
    { text: 'Specific Pacific Pacific specific specific Pacific', difficulty: 'hard' }
];

// ============ ROADMAP DATA ============
const ROADMAP_DATA = [
    { month: 'Month 1: Foundations', topics: [
        { name: 'HTML & CSS', duration: '5 days', cat: 'fs' },
        { name: 'JavaScript Basics', duration: '7 days', cat: 'fs' },
        { name: 'DOM Manipulation', duration: '4 days', cat: 'fs' },
        { name: 'Git & GitHub', duration: '3 days', cat: 'fs' },
        { name: 'Python Basics', duration: '5 days', cat: 'ai' },
        { name: 'English Grammar', duration: 'ongoing', cat: 'en' }
    ]},
    { month: 'Month 2: Intermediate', topics: [
        { name: 'React.js', duration: '6 days', cat: 'fs' },
        { name: 'React Hooks', duration: '5 days', cat: 'fs' },
        { name: 'MongoDB', duration: '6 days', cat: 'fs' },
        { name: 'REST APIs', duration: '5 days', cat: 'fs' },
        { name: 'Python Data Science', duration: '5 days', cat: 'ai' },
        { name: 'Conversation Practice', duration: 'ongoing', cat: 'en' }
    ]},
    { month: 'Month 3: Advanced', topics: [
        { name: 'Advanced React', duration: '5 days', cat: 'fs' },
        { name: 'TypeScript', duration: '4 days', cat: 'fs' },
        { name: 'Next.js', duration: '5 days', cat: 'fs' },
        { name: 'Full Stack Project', duration: '7 days', cat: 'fs' },
        { name: 'Deep Learning', duration: '5 days', cat: 'ai' },
        { name: 'Fluency Challenge', duration: 'ongoing', cat: 'en' }
    ]}
];

// ============ CHATBOT RESPONSES ============
const CHAT_RESPONSES = {
    'how to use': 'You can navigate using the sidebar menu. Start with Dashboard, then explore Timetable, Roadmap, Habits, English Fluency, and Notes!',
    'features': 'GrowthPilot offers: 📊 Dashboard analytics, 📅 Timetable planner, 🗺️ 3-Month Roadmap, ✅ Daily Habits tracker, 🎤 English Fluency practice, 👅 Tongue Twisters, and 📝 Notes!',
    'habit': 'Click on "Daily Habits" in the sidebar, then click "+ Add Habit" to create new habits. Click on the day circles to mark them as complete!',
    'roadmap': 'The 3-Month Roadmap shows your learning path. Click on any topic to mark it as complete.',
    'timetable': 'Go to Timetable page, click "+ Add Block" to schedule your day. You can also use Quick Templates!',
    'timer': 'The Quick Timer helps you focus. Choose 5, 25, or 50 minutes, then click Start.',
    'help': 'I can help you with: features, habits, roadmap, timetable, timer, analytics, notes, and account issues.',
    'default': "I'm here to help! Ask me about features, habits, roadmap, timetable, timer, analytics, notes, or account help."
};

// ============ DEFAULT DATA ============
function getDefaultData() {
    return {
        schedule: [],
        habits: [
            { id: 1, name: 'Study Coding', icon: '💻', completed: [] },
            { id: 2, name: 'Practice English', icon: '🎤', completed: [] },
            { id: 3, name: 'Exercise', icon: '🏃', completed: [] }
        ],
        roadmapCompleted: {},
        twisters: { streak: 0, easy: [], medium: [], hard: [] },
        english: { speeds: [] },
        notes: [],
        feedbacks: [],
        streak: 0,
        lastActiveDate: null,
        studyMinutes: {}
    };
}

// ============ TOAST NOTIFICATION ============
function showToast(msg, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `bg-white border ${type === 'success' ? 'border-green-400' : 'border-red-400'} rounded-xl px-4 py-3 shadow-lg toast-slide flex items-center gap-2 z-50`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span><span class="text-gray-700 text-sm">${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============ SIDEBAR ============
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
    }
}

// ============ MODALS ============
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

// ============ HELPERS ============
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function getTodayKey() {
    return new Date().toISOString().split('T')[0];
}

function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) targetPage.classList.add('active');
    const navItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (navItem) navItem.classList.add('active');
    
    if (pageId === 'dashboard') updateDashboard();
    if (pageId === 'roadmap') renderRoadmap();
    if (pageId === 'habits') renderHabits();
    if (pageId === 'timetable') renderScheduleUI();
    if (pageId === 'analytics') initAnalytics();
    if (pageId === 'tonguetwisters') {
        renderCurrentTwister();
        updateTwisterStats();
        renderTwisterList();
    }
    if (pageId === 'notes') renderNotes();
    
    if (window.innerWidth <= 1024) {
        document.getElementById('sidebar').classList.add('-translate-x-full');
    }
}

// ============ CHATBOT ============
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow) {
        chatWindow.classList.toggle('hidden');
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim().toLowerCase();
    if (!message) return;
    
    const chatMessages = document.getElementById('chatMessages');
    
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'flex justify-end';
    userMsgDiv.innerHTML = `<div class="bg-indigo-600 text-white rounded-lg p-2 max-w-[80%]"><p class="text-sm">${escapeHtml(input.value)}</p></div>`;
    chatMessages.appendChild(userMsgDiv);
    
    let response = CHAT_RESPONSES.default;
    for (const [key, value] of Object.entries(CHAT_RESPONSES)) {
        if (message.includes(key)) {
            response = value;
            break;
        }
    }
    
    setTimeout(() => {
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'flex justify-start';
        botMsgDiv.innerHTML = `<div class="bg-gray-200 rounded-lg p-2 max-w-[80%]"><p class="text-sm text-gray-800">🤖 ${response}</p></div>`;
        chatMessages.appendChild(botMsgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 300);
    
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ============ FEEDBACK ============
function submitFeedback() {
    const feedback = document.getElementById('feedbackInput').value.trim();
    if (!feedback) {
        showToast('Please enter your feedback', 'error');
        return;
    }
    if (!appData.feedbacks) appData.feedbacks = [];
    appData.feedbacks.unshift({
        id: Date.now().toString(),
        text: feedback,
        date: new Date().toISOString()
    });
    saveDataImmediately();
    document.getElementById('feedbackInput').value = '';
    showToast('Thank you for your feedback! 🙏');
}

// ============ LOGOUT DROPDOWN ============
function toggleLogoutDropdown() {
    const dropdown = document.getElementById('logoutDropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
}

// ============ DATA PERSISTENCE ============
function saveDataImmediately() {
    if (!currentUser || !appData) return;
    localStorage.setItem(`growthpilot_data_${currentUser.email}`, JSON.stringify(appData));
}

function loadUserData() {
    const savedUser = localStorage.getItem('growthpilot_current_user');
    if (!savedUser) return;
    
    currentUser = JSON.parse(savedUser);
    updateUserUI();
    
    const savedData = localStorage.getItem(`growthpilot_data_${currentUser.email}`);
    if (savedData) {
        appData = { ...getDefaultData(), ...JSON.parse(savedData) };
    } else {
        appData = getDefaultData();
    }
    
    updateDashboard();
    renderRoadmap();
    renderHabits();
    renderScheduleUI();
    renderNotes();
    renderCurrentTwister();
    updateTwisterStats();
    renderTwisterList();
    initAnalytics();
}

function updateUserUI() {
    if (!currentUser) return;
    document.getElementById('userName').innerText = currentUser.name;
    document.getElementById('userAvatar').innerText = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('welcomeName').innerHTML = ` ${currentUser.name.split(' ')[0]}! 👋`;
}

// ============ AUTHENTICATION ============
function showLoginForm() {
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('signupFormContainer').style.display = 'none';
}

function showSignupForm() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('signupFormContainer').style.display = 'block';
}

function handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    if (!name || !email || !password) {
        showToast('Please fill all fields', 'error');
        return;
    }
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('growthpilot_users') || '{}');
    if (users[email]) {
        showToast('User already exists! Please login.', 'error');
        return;
    }
    
    users[email] = { name, email, password };
    localStorage.setItem('growthpilot_users', JSON.stringify(users));
    
    currentUser = { email, name };
    localStorage.setItem('growthpilot_current_user', JSON.stringify(currentUser));
    
    showToast('Account created successfully! 🎉');
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('dashboardPage').style.display = 'block';
    document.getElementById('mainFooter').style.display = 'block';
    
    appData = getDefaultData();
    saveDataImmediately();
    updateUserUI();
    updateDashboard();
    renderRoadmap();
    renderHabits();
    renderScheduleUI();
    renderNotes();
    renderCurrentTwister();
    updateTwisterStats();
    renderTwisterList();
    initAnalytics();
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('growthpilot_users') || '{}');
    const user = users[email];
    
    if (user && user.password === password) {
        currentUser = { email: user.email, name: user.name };
        localStorage.setItem('growthpilot_current_user', JSON.stringify(currentUser));
        showToast(`Welcome back, ${user.name}! 🎉`);
        document.getElementById('authPage').style.display = 'none';
        document.getElementById('dashboardPage').style.display = 'block';
        document.getElementById('mainFooter').style.display = 'block';
        loadUserData();
    } else {
        showToast('Invalid email or password', 'error');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        saveDataImmediately();
        localStorage.removeItem('growthpilot_current_user');
        currentUser = null;
        appData = null;
        showToast('Logged out successfully');
        document.getElementById('authPage').style.display = 'flex';
        document.getElementById('dashboardPage').style.display = 'none';
        document.getElementById('mainFooter').style.display = 'none';
        showLoginForm();
    }
}

// ============ DASHBOARD ============
function updateDashboard() {
    if (!appData) return;
    const today = getTodayKey();
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    
    if (appData.lastActiveDate !== today) {
        if (appData.lastActiveDate === yesterdayKey) {
            appData.streak = (appData.streak || 0) + 1;
        } else if (appData.lastActiveDate && appData.lastActiveDate !== today) {
            appData.streak = 0;
        }
        if (!appData.lastActiveDate) appData.streak = 1;
        appData.lastActiveDate = today;
        saveDataImmediately();
    }
    
    document.getElementById('streakValue').innerText = appData.streak || 0;
    document.getElementById('studyHours').innerText = ((appData.studyMinutes?.[today] || 0) / 60).toFixed(1);
    document.getElementById('tasksCompleted').innerText = (appData.schedule || []).filter(s => s.completed && s.date === today).length;
    
    let total = 0, done = 0;
    ROADMAP_DATA.forEach((m, i) => {
        m.topics.forEach((t, j) => {
            total++;
            if (appData.roadmapCompleted?.[i + '-' + j]) done++;
        });
    });
    const pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById('overallProgress').innerText = pct + '%';
    document.getElementById('progressPercent').innerText = pct + '%';
    
    const circ = 2 * Math.PI * 56;
    const prog = document.getElementById('mainProgress');
    if (prog) prog.style.strokeDashoffset = circ - (pct / 100) * circ;
    
    let fsC = 0, fsT = 0, enC = 0, enT = 0, aiC = 0, aiT = 0;
    ROADMAP_DATA.forEach((m, i) => {
        m.topics.forEach((t, j) => {
            const key = i + '-' + j;
            const comp = appData.roadmapCompleted?.[key];
            if (t.cat === 'fs') { fsT++; if (comp) fsC++; }
            if (t.cat === 'en') { enT++; if (comp) enC++; }
            if (t.cat === 'ai') { aiT++; if (comp) aiC++; }
        });
    });
    
    document.getElementById('fullstackPercent').innerText = fsT ? Math.round((fsC / fsT) * 100) + '%' : '0%';
    document.getElementById('fullstackBar').style.width = fsT ? ((fsC / fsT) * 100) + '%' : '0%';
    document.getElementById('englishPercent').innerText = enT ? Math.round((enC / enT) * 100) + '%' : '0%';
    document.getElementById('englishBar').style.width = enT ? ((enC / enT) * 100) + '%' : '0%';
    document.getElementById('aiPercent').innerText = aiT ? Math.round((aiC / aiT) * 100) + '%' : '0%';
    document.getElementById('aiBar').style.width = aiT ? ((aiC / aiT) * 100) + '%' : '0%';
    
    renderScheduleUI();
    
    if (weeklyChartInst) weeklyChartInst.destroy();
    const ctx = document.getElementById('weeklyChart');
    if (ctx) {
        weeklyChartInst = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Hours',
                    data: [2, 3, 4, 3, 5, 4, 2],
                    backgroundColor: '#6366f1',
                    borderRadius: 8
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }
}

// ============ ANALYTICS ============
function initAnalytics() {
    const distCtx = document.getElementById('distributionChart');
    if (distCtx) {
        if (distributionChart) distributionChart.destroy();
        distributionChart = new Chart(distCtx, {
            type: 'doughnut',
            data: {
                labels: ['Coding', 'AI/ML', 'English', 'Study'],
                datasets: [{ data: [35, 25, 20, 20], backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#3b82f6'] }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
    
    const catCtx = document.getElementById('categoryChart');
    if (catCtx) {
        if (categoryChart) categoryChart.destroy();
        const fs = parseInt(document.getElementById('fullstackPercent').innerText) || 0;
        const en = parseInt(document.getElementById('englishPercent').innerText) || 0;
        const ai = parseInt(document.getElementById('aiPercent').innerText) || 0;
        categoryChart = new Chart(catCtx, {
            type: 'bar',
            data: {
                labels: ['Full Stack', 'English', 'AI Skills'],
                datasets: [{ label: 'Progress (%)', data: [fs, en, ai], backgroundColor: ['#6366f1', '#10b981', '#f59e0b'] }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
    
    const insights = document.getElementById('insightsContainer');
    if (insights) {
        insights.innerHTML = `
            <div class="bg-indigo-50 rounded-lg p-4"><p class="text-indigo-800 font-semibold mb-2">📊 Keep Going!</p><p class="text-gray-600">Complete daily tasks to increase your streak and earn XP!</p></div>
            <div class="bg-indigo-50 rounded-lg p-4"><p class="text-indigo-800 font-semibold mb-2">💡 Pro Tip</p><p class="text-gray-600">Complete your daily habits and roadmap topics to unlock achievements!</p></div>
            <div class="bg-indigo-50 rounded-lg p-4"><p class="text-indigo-800 font-semibold mb-2">🎯 Reading Challenge</p><p class="text-gray-600">Practice English reading daily to improve your fluency!</p></div>
        `;
    }
}

// ============ SCHEDULE FUNCTIONS ============
function renderScheduleUI() {
    const today = getTodayKey();
    const items = (appData.schedule || []).filter(s => s.date === today);
    const container = document.getElementById('todaySchedule');
    const fullContainer = document.getElementById('fullSchedule');
    
    const html = items.length ? items.map(i => `
        <div class="flex items-center gap-3 py-2 border-b border-gray-100">
            <span class="text-indigo-600 font-mono text-sm w-16">${i.start}</span>
            <div class="flex-1 px-3 py-2 rounded-lg cursor-pointer transition ${i.completed ? 'bg-green-50 line-through text-gray-400' : 'bg-indigo-50 hover:bg-indigo-100'}" onclick="toggleTask('${i.id}')">${escapeHtml(i.activity)}</div>
            <button onclick="deleteTask('${i.id}')" class="text-red-400 hover:text-red-600 px-2">🗑️</button>
        </div>
    `).join('') : '<p class="text-gray-500 text-center py-8">No blocks scheduled. Click "+ Add Block" to create your first schedule!</p>';
    
    if (container) container.innerHTML = html;
    if (fullContainer) fullContainer.innerHTML = html;
    
    const studyBlocks = items.length;
    const totalHours = items.reduce((total, item) => {
        const [sh, sm] = item.start.split(':').map(Number);
        const [eh, em] = item.end.split(':').map(Number);
        return total + ((eh * 60 + em) - (sh * 60 + sm)) / 60;
    }, 0);
    
    if (document.getElementById('studyBlocks')) document.getElementById('studyBlocks').innerText = studyBlocks;
    if (document.getElementById('totalPlanned')) document.getElementById('totalPlanned').innerText = totalHours.toFixed(1) + 'h';
    if (document.getElementById('breakTime')) document.getElementById('breakTime').innerText = Math.floor(studyBlocks * 0.25) + 'h';
}

function toggleTask(id) {
    const task = appData.schedule.find(s => s.id === id);
    if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            const [sh, sm] = task.start.split(':').map(Number);
            const [eh, em] = task.end.split(':').map(Number);
            const mins = (eh * 60 + em) - (sh * 60 + sm);
            const today = getTodayKey();
            if (!appData.studyMinutes) appData.studyMinutes = {};
            appData.studyMinutes[today] = (appData.studyMinutes[today] || 0) + mins;
        }
        saveDataImmediately();
        renderScheduleUI();
        updateDashboard();
        showToast(task.completed ? 'Task completed! 🎉 +' + Math.floor(((task.end.split(':')[0] * 60 + parseInt(task.end.split(':')[1])) - (task.start.split(':')[0] * 60 + parseInt(task.start.split(':')[1]))) / 60) + ' hours studied!' : 'Task unmarked');
    }
}

function deleteTask(id) {
    appData.schedule = appData.schedule.filter(s => s.id !== id);
    saveDataImmediately();
    renderScheduleUI();
    updateDashboard();
    showToast('Task deleted');
}

function addScheduleBlock() {
    const start = document.getElementById('scheduleStart').value;
    const end = document.getElementById('scheduleEnd').value;
    const activity = document.getElementById('scheduleActivity').value.trim();
    const category = document.getElementById('scheduleCategory').value;
    
    if (!start || !end || !activity) {
        showToast('Please fill all fields', 'error');
        return;
    }
    
    if (!appData.schedule) appData.schedule = [];
    appData.schedule.push({
        id: Date.now().toString(),
        date: getTodayKey(),
        start, end, activity, category, completed: false
    });
    saveDataImmediately();
    closeModal('scheduleModal');
    renderScheduleUI();
    updateDashboard();
    showToast('Schedule block added successfully! ✅');
    
    document.getElementById('scheduleStart').value = '09:00';
    document.getElementById('scheduleEnd').value = '10:00';
    document.getElementById('scheduleActivity').value = '';
}

function openAddScheduleModal() {
    document.getElementById('scheduleStart').value = '09:00';
    document.getElementById('scheduleEnd').value = '10:00';
    document.getElementById('scheduleActivity').value = '';
    openModal('scheduleModal');
}

function applyTemplate(type) {
    const today = getTodayKey();
    const templates = {
        developer: [
            { start: '09:00', end: '11:00', activity: 'Frontend Development', category: 'coding' },
            { start: '11:00', end: '11:30', activity: 'Break', category: 'break' },
            { start: '11:30', end: '13:30', activity: 'Backend Development', category: 'coding' },
            { start: '14:00', end: '15:30', activity: 'Data Structures & Algorithms', category: 'coding' },
            { start: '15:30', end: '16:30', activity: 'Project Work', category: 'coding' }
        ],
        student: [
            { start: '09:00', end: '11:00', activity: 'Core Subject Study', category: 'study' },
            { start: '11:30', end: '13:30', activity: 'Programming Practice', category: 'coding' },
            { start: '14:00', end: '15:30', activity: 'Assignment Work', category: 'study' },
            { start: '15:30', end: '16:30', activity: 'Revision', category: 'study' }
        ],
        balanced: [
            { start: '08:00', end: '09:00', activity: 'Morning Exercise', category: 'break' },
            { start: '09:30', end: '11:30', activity: 'Deep Work Session', category: 'study' },
            { start: '13:00', end: '15:00', activity: 'Skill Development', category: 'coding' },
            { start: '15:00', end: '16:00', activity: 'English Practice', category: 'english' },
            { start: '16:00', end: '17:00', activity: 'Planning & Review', category: 'study' }
        ]
    };
    
    const blocks = (templates[type] || templates.developer).map(t => ({
        id: Date.now().toString() + Math.random(),
        date: today, ...t, completed: false
    }));
    
    const existingToday = (appData.schedule || []).filter(s => s.date !== today);
    appData.schedule = [...existingToday, ...blocks];
    saveDataImmediately();
    renderScheduleUI();
    updateDashboard();
    showToast(type.charAt(0).toUpperCase() + type.slice(1) + ' template applied! 📅');
}

// ============ ROADMAP ============
function renderRoadmap() {
    const container = document.getElementById('roadmapContainer');
    if (!container) return;
    
    container.innerHTML = ROADMAP_DATA.map((month, mi) => `
        <div class="bg-indigo-50 rounded-xl overflow-hidden">
            <div class="p-4 bg-gradient-to-r from-indigo-200 to-purple-200">
                <h3 class="font-semibold text-gray-800">${month.month}</h3>
            </div>
            <div class="p-3 space-y-2">
                ${month.topics.map((topic, ti) => {
                    const key = mi + '-' + ti;
                    const completed = appData.roadmapCompleted?.[key];
                    return `
                        <div class="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-indigo-100 transition ${completed ? 'opacity-60' : ''}" onclick="toggleRoadmapTopic('${key}')">
                            <div class="w-5 h-5 rounded-full border-2 ${completed ? 'bg-green-500 border-green-500' : 'border-gray-400'} flex items-center justify-center text-xs text-white">${completed ? '✓' : ''}</div>
                            <div><div class="text-gray-800 text-sm font-medium">${escapeHtml(topic.name)}</div><div class="text-gray-400 text-xs">${topic.duration}</div></div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

function toggleRoadmapTopic(key) {
    if (!appData.roadmapCompleted) appData.roadmapCompleted = {};
    const wasCompleted = appData.roadmapCompleted[key];
    appData.roadmapCompleted[key] = !wasCompleted;
    saveDataImmediately();
    renderRoadmap();
    updateDashboard();
    showToast(appData.roadmapCompleted[key] ? 'Topic completed! 🎉 +50 XP' : 'Topic unmarked');
}

function resetRoadmap() {
    if (confirm('Reset all roadmap progress? This cannot be undone.')) {
        appData.roadmapCompleted = {};
        saveDataImmediately();
        renderRoadmap();
        updateDashboard();
        showToast('Roadmap has been reset');
    }
}

// ============ HABITS ============
function renderHabits() {
    const container = document.getElementById('habitTrackerContainer');
    if (!container) return;
    
    const weekDates = (() => {
        let today = new Date();
        let day = today.getDay();
        let diff = today.getDate() - day + (day === 0 ? -6 : 1);
        let monday = new Date(today);
        monday.setDate(diff);
        return Array.from({ length: 7 }, (_, i) => {
            let d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d;
        });
    })();
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    if (!appData.habits?.length) {
        container.innerHTML = '<div class="text-center py-8 text-gray-500">No habits yet. Click "+ Add Habit" to get started!</div>';
        return;
    }
    
    let html = '<div class="overflow-x-auto"><table class="w-full min-w-[800px]"><thead><tr><th class="text-left py-2 px-2">Habit</th>';
    days.forEach(day => { html += `<th class="text-center py-2 px-2 text-sm text-gray-500">${day}</th>`; });
    html += '</tr></thead><tbody>';
    
    appData.habits.forEach(habit => {
        html += `<tr class="border-b border-gray-100"><td class="py-3 px-2"><span class="text-xl mr-2">${habit.icon}</span><span class="text-gray-700">${escapeHtml(habit.name)}</span></td>`;
        weekDates.forEach(date => {
            const key = date.toISOString().split('T')[0];
            const isToday = key === getTodayKey();
            const isDone = habit.completed?.includes(key);
            html += `<td class="text-center py-2"><div class="inline-block w-8 h-8 rounded-full cursor-pointer transition ${isDone ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-indigo-100'} flex items-center justify-center ${isToday ? 'ring-2 ring-indigo-500' : ''}" onclick="toggleHabitDay(${habit.id},'${key}')">${isDone ? '✓' : ''}</div></td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
    updateAchievements();
}

function toggleHabitDay(id, date) {
    const habit = appData.habits.find(h => h.id == id);
    if (habit) {
        if (!habit.completed) habit.completed = [];
        const idx = habit.completed.indexOf(date);
        if (idx >= 0) {
            habit.completed.splice(idx, 1);
            showToast(`Unmarked ${habit.name} for ${date}`);
        } else {
            habit.completed.push(date);
            showToast(`✅ ${habit.name} completed for ${date}! +10 XP`);
        }
        saveDataImmediately();
        renderHabits();
        updateDashboard();
    }
}

function addHabit() {
    const name = document.getElementById('habitName').value.trim();
    const icon = document.getElementById('habitIcon').value.trim() || '📌';
    if (!name) {
        showToast('Please enter a habit name', 'error');
        return;
    }
    appData.habits.push({ id: Date.now(), name: name, icon: icon, completed: [] });
    saveDataImmediately();
    closeModal('habitModal');
    renderHabits();
    showToast(`Habit "${name}" added successfully!`);
    document.getElementById('habitName').value = '';
    document.getElementById('habitIcon').value = '📌';
}

function openAddHabitModal() {
    openModal('habitModal');
}

function updateAchievements() {
    const container = document.getElementById('achievementsContainer');
    if (!container) return;
    
    const achievements = [
        { name: 'First Step', desc: 'Complete first habit', icon: '🌱', check: appData.habits.some(h => h.completed?.length > 0) },
        { name: 'Streak Master', desc: '3 day streak', icon: '🔥', check: appData.streak >= 3 },
        { name: 'Language Lover', desc: 'Master 3 twisters', icon: '🗣️', check: (appData.twisters?.easy?.length + appData.twisters?.medium?.length + appData.twisters?.hard?.length) >= 3 },
        { name: 'Code Warrior', desc: 'Complete 5 roadmap topics', icon: '💻', check: Object.values(appData.roadmapCompleted || {}).filter(Boolean).length >= 5 }
    ];
    
    container.innerHTML = achievements.map(a => `
        <div class="flex items-center gap-3 p-3 ${a.check ? 'bg-indigo-50' : 'bg-gray-50'} rounded-lg transition">
            <div class="text-2xl">${a.icon}</div>
            <div class="flex-1">
                <div class="font-semibold text-gray-800">${a.check ? '🏆 ' : '🔒 '}${a.name}</div>
                <div class="text-xs text-gray-500">${a.desc}</div>
            </div>
            ${a.check ? '<div class="text-green-500 text-xl">✓</div>' : '<div class="text-gray-400">⚡</div>'}
        </div>
    `).join('');
}

// ============ NOTES ============
function renderNotes() {
    const container = document.getElementById('notesContainer');
    if (!container) return;
    
    if (!appData.notes?.length) {
        container.innerHTML = '<div class="text-center py-8 text-gray-500 col-span-3">No notes yet. Click "+ New Note" to create your first note!</div>';
        return;
    }
    
    container.innerHTML = appData.notes.map(n => `
        <div class="bg-white border border-gray-200 rounded-xl p-4 note-card shadow-sm hover:shadow-md transition">
            <div class="flex justify-between items-start">
                <h3 class="font-semibold text-gray-800">${escapeHtml(n.title)}</h3>
                <button onclick="deleteNote('${n.id}')" class="text-red-400 hover:text-red-600 text-sm">🗑️</button>
            </div>
            <p class="text-gray-600 text-sm mt-2">${escapeHtml(n.content.substring(0, 120))}${n.content.length > 120 ? '...' : ''}</p>
            <div class="text-gray-400 text-xs mt-2">${new Date(n.date).toLocaleDateString()}</div>
        </div>
    `).join('');
}

function openAddNoteModal() {
    const title = prompt('Enter note title:');
    if (!title) return;
    const content = prompt('Enter note content:');
    if (!content) return;
    
    if (!appData.notes) appData.notes = [];
    appData.notes.unshift({ id: Date.now().toString(), title, content, date: new Date().toISOString() });
    saveDataImmediately();
    renderNotes();
    showToast('Note saved successfully! 📝');
}

function deleteNote(id) {
    if (confirm('Delete this note?')) {
        appData.notes = appData.notes.filter(n => n.id !== id);
        saveDataImmediately();
        renderNotes();
        showToast('Note deleted');
    }
}

// ============ READING PASSAGES ============
function newReadingPassage() {
    currentPassageIdx = (currentPassageIdx + 1) % READING_PASSAGES.length;
    const passage = READING_PASSAGES[currentPassageIdx];
    document.getElementById('readingPassage').innerText = passage.text;
    const levelSpan = document.getElementById('currentLevel');
    if (levelSpan) {
        levelSpan.innerText = passage.level;
        if (passage.level === 'Easy') levelSpan.className = 'text-xs px-3 py-1 bg-green-200 text-green-800 rounded-full';
        else if (passage.level === 'Medium') levelSpan.className = 'text-xs px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full';
        else levelSpan.className = 'text-xs px-3 py-1 bg-red-200 text-red-800 rounded-full';
    }
}

function speakText() {
    const text = document.getElementById('readingPassage').innerText;
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}

function recordReadingSpeed() {
    const seconds = parseInt(document.getElementById('readTimeInput').value);
    if (!seconds || seconds <= 0) {
        showToast('Please enter valid seconds', 'error');
        return;
    }
    const passage = READING_PASSAGES[currentPassageIdx];
    const wordCount = passage.text.split(' ').length;
    const wpm = Math.round((wordCount / seconds) * 60);
    document.getElementById('wpmDisplay').innerText = wpm;
    
    let message = `${wpm} WPM! `;
    if (wpm >= 200) message += '🏆 Expert level! Amazing!';
    else if (wpm >= 150) message += '🌟 Advanced level! Great job!';
    else if (wpm >= 100) message += '👍 Intermediate level! Keep practicing!';
    else message += '💪 Keep practicing to improve your speed!';
    showToast(message);
    
    if (!appData.english) appData.english = { speeds: [] };
    appData.english.speeds.push({ date: new Date().toISOString(), wpm, passage: passage.level });
    saveDataImmediately();
}

// ============ TONGUE TWISTERS ============
function renderCurrentTwister() {
    const twister = TONGUE_TWISTERS[currentTwisterIdx];
    document.getElementById('twisterText').innerHTML = twister.text;
    const diffSpan = document.getElementById('twisterDifficulty');
    if (diffSpan) {
        diffSpan.innerText = twister.difficulty.toUpperCase();
        if (twister.difficulty === 'easy') diffSpan.className = 'inline-block px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs mb-3';
        else if (twister.difficulty === 'medium') diffSpan.className = 'inline-block px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs mb-3';
        else diffSpan.className = 'inline-block px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs mb-3';
    }
}

function nextTwister() {
    currentTwisterIdx = (currentTwisterIdx + 1) % TONGUE_TWISTERS.length;
    renderCurrentTwister();
}

function speakTwister() {
    const text = TONGUE_TWISTERS[currentTwisterIdx].text;
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.7;
        window.speechSynthesis.speak(utterance);
    }
}

function markTwisterComplete() {
    const twister = TONGUE_TWISTERS[currentTwisterIdx];
    if (!appData.twisters) appData.twisters = { streak: 0, easy: [], medium: [], hard: [] };
    
    let isNew = false;
    if (twister.difficulty === 'easy' && !appData.twisters.easy.includes(twister.text)) {
        appData.twisters.easy.push(twister.text);
        isNew = true;
        showToast('🎉 Easy twister mastered! +25 XP');
    } else if (twister.difficulty === 'medium' && !appData.twisters.medium.includes(twister.text)) {
        appData.twisters.medium.push(twister.text);
        isNew = true;
        showToast('🌟 Medium twister mastered! +50 XP');
    } else if (twister.difficulty === 'hard' && !appData.twisters.hard.includes(twister.text)) {
        appData.twisters.hard.push(twister.text);
        isNew = true;
        showToast('🔥 Hard twister mastered! +100 XP');
    } else {
        showToast('You already mastered this twister! Keep practicing!');
        return;
    }
    
    if (isNew) {
        appData.twisters.streak++;
        saveDataImmediately();
        updateTwisterStats();
        renderTwisterList();
        nextTwister();
    }
}

function updateTwisterStats() {
    if (!appData.twisters) appData.twisters = { streak: 0, easy: [], medium: [], hard: [] };
    const totalMastered = appData.twisters.easy.length + appData.twisters.medium.length + appData.twisters.hard.length;
    document.getElementById('masteredCount').innerText = totalMastered;
    document.getElementById('bestTwisterStreak').innerText = appData.twisters.streak;
    document.getElementById('totalTwisterAttempts').innerText = totalMastered;
    const masteryPercent = (totalMastered / TONGUE_TWISTERS.length) * 100;
    document.getElementById('masteryBar').style.width = masteryPercent + '%';
}

function renderTwisterList() {
    const container = document.getElementById('twisterList');
    if (!container) return;
    container.innerHTML = TONGUE_TWISTERS.map((t, i) => {
        const done = appData.twisters?.easy?.includes(t.text) ||
                     appData.twisters?.medium?.includes(t.text) ||
                     appData.twisters?.hard?.includes(t.text);
        return `
            <div class="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-indigo-50 transition shadow-sm border border-gray-100" onclick="currentTwisterIdx=${i};renderCurrentTwister();navigateTo('tonguetwisters')">
                <span class="text-gray-700 text-sm">${done ? '✅' : '⬜'} ${t.text.substring(0, 40)}${t.text.length > 40 ? '...' : ''}</span>
                <span class="text-xs px-2 py-1 rounded-full ${t.difficulty === 'easy' ? 'bg-green-100 text-green-600' : t.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}">${t.difficulty}</span>
            </div>
        `;
    }).join('');
}

// ============ TIMER ============
function setTimer(minutes) {
    clearInterval(timerInterval);
    timerRunning = false;
    timerSeconds = minutes * 60;
    document.getElementById('timerDisplay').innerText = formatTime(timerSeconds);
    const btn = document.getElementById('timerStartBtn');
    if (btn) btn.innerHTML = '▶ Start';
}

function toggleTimer() {
    const btn = document.getElementById('timerStartBtn');
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        if (btn) btn.innerHTML = '▶ Resume';
        showToast('Timer paused');
    } else {
        timerRunning = true;
        if (btn) btn.innerHTML = '⏸ Pause';
        timerInterval = setInterval(() => {
            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                showToast('🎉 Timer completed! Great work! +25 XP');
                if (btn) btn.innerHTML = '▶ Start';
                const today = getTodayKey();
                if (!appData.studyMinutes) appData.studyMinutes = {};
                appData.studyMinutes[today] = (appData.studyMinutes[today] || 0) + 25;
                saveDataImmediately();
                updateDashboard();
                timerSeconds = 25 * 60;
                document.getElementById('timerDisplay').innerText = formatTime(timerSeconds);
            } else {
                timerSeconds--;
                document.getElementById('timerDisplay').innerText = formatTime(timerSeconds);
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerSeconds = 25 * 60;
    document.getElementById('timerDisplay').innerText = formatTime(timerSeconds);
    const btn = document.getElementById('timerStartBtn');
    if (btn) btn.innerHTML = '▶ Start';
    showToast('Timer reset to 25 minutes');
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ============ PREMIUM ============
function initiatePremiumPayment() {
    alert('Premium demo: In production, this would integrate with Razorpay/PayPal.\n\nPremium features include:\n• Unlimited notes\n• Advanced analytics\n• Priority support\n\nThank you for supporting GrowthPilot! 🚀');
    showToast('Premium feature demo - upgrade to unlock all features!');
}

// ============ GOOGLE SIGN-IN ============
function initializeGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredential,
            auto_select: false
        });
        
        const loginBtn = document.getElementById('googleLoginBtn');
        const signupBtn = document.getElementById('googleSignupBtn');
        
        if (loginBtn) {
            google.accounts.id.renderButton(loginBtn, { 
                theme: 'outline', 
                size: 'large', 
                width: '100%',
                text: 'continue_with'
            });
        }
        
        if (signupBtn) {
            google.accounts.id.renderButton(signupBtn, { 
                theme: 'outline', 
                size: 'large', 
                width: '100%',
                text: 'signup_with'
            });
        }
    } else {
        console.log('Google Sign-In not loaded yet, retrying...');
        setTimeout(initializeGoogleSignIn, 500);
    }
}

function handleGoogleCredential(response) {
    try {
        const credential = response.credential;
        const decoded = parseJwt(credential);
        
        const userInfo = {
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
            googleId: decoded.sub
        };
        
        let users = JSON.parse(localStorage.getItem('growthpilot_users') || '{}');
        
        if (!users[userInfo.email]) {
            users[userInfo.email] = {
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture,
                googleId: userInfo.googleId
            };
            localStorage.setItem('growthpilot_users', JSON.stringify(users));
            showToast(`Welcome ${userInfo.name}! 🎉`);
        } else {
            showToast(`Welcome back, ${userInfo.name}! 🎉`);
        }
        
        currentUser = { email: userInfo.email, name: userInfo.name, picture: userInfo.picture };
        localStorage.setItem('growthpilot_current_user', JSON.stringify(currentUser));
        
        document.getElementById('authPage').style.display = 'none';
        document.getElementById('dashboardPage').style.display = 'block';
        document.getElementById('mainFooter').style.display = 'block';
        
        appData = getDefaultData();
        saveDataImmediately();
        updateUserUI();
        updateDashboard();
        renderRoadmap();
        renderHabits();
        renderScheduleUI();
        renderNotes();
        renderCurrentTwister();
        updateTwisterStats();
        renderTwisterList();
        initAnalytics();
        
    } catch (error) {
        console.error('Google login error:', error);
        showToast('Google login failed. Please try again.', 'error');
    }
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// ============ DARK MODE ============
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('darkModeToggle');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        if (btn) {
            btn.innerHTML = '☀️';
        }
    } else {
        localStorage.setItem('darkMode', 'disabled');
        if (btn) {
            btn.innerHTML = '🌙';
        }
    }
}

// ============ AUTO-SAVE ============
setInterval(() => {
    if (currentUser && appData) saveDataImmediately();
}, 30000);

window.addEventListener('beforeunload', () => {
    if (currentUser && appData) saveDataImmediately();
});

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('growthpilot_current_user');
    
    const profileBtn = document.getElementById('userProfileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLogoutDropdown();
        });
    }
    
    document.addEventListener('click', function(event) {
        const profileBtn = document.getElementById('userProfileBtn');
        const dropdown = document.getElementById('logoutDropdown');
        if (profileBtn && dropdown && !profileBtn.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    });
    
    initializeGoogleSignIn();
    
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        const toggleBtn = document.getElementById('darkModeToggle');
        if (toggleBtn) toggleBtn.innerHTML = '☀️';
    }
    
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            document.getElementById('authPage').style.display = 'none';
            document.getElementById('dashboardPage').style.display = 'block';
            document.getElementById('mainFooter').style.display = 'block';
            loadUserData();
        } catch(e) {
            document.getElementById('authPage').style.display = 'flex';
            document.getElementById('dashboardPage').style.display = 'none';
            document.getElementById('mainFooter').style.display = 'none';
        }
    } else {
        document.getElementById('authPage').style.display = 'flex';
        document.getElementById('dashboardPage').style.display = 'none';
        document.getElementById('mainFooter').style.display = 'none';
    }
    
    newReadingPassage();
    renderCurrentTwister();
    
    const chatToggle = document.getElementById('chatToggle');
    if (chatToggle) {
        chatToggle.addEventListener('click', toggleChat);
    }
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }
});

// ============ EXPOSE GLOBAL FUNCTIONS ============
window.toggleSidebar = toggleSidebar;
window.navigateTo = navigateTo;
window.showLoginForm = showLoginForm;
window.showSignupForm = showSignupForm;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.logout = logout;
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.addScheduleBlock = addScheduleBlock;
window.openAddScheduleModal = openAddScheduleModal;
window.applyTemplate = applyTemplate;
window.toggleRoadmapTopic = toggleRoadmapTopic;
window.resetRoadmap = resetRoadmap;
window.toggleHabitDay = toggleHabitDay;
window.addHabit = addHabit;
window.openAddHabitModal = openAddHabitModal;
window.openAddNoteModal = openAddNoteModal;
window.deleteNote = deleteNote;
window.setTimer = setTimer;
window.toggleTimer = toggleTimer;
window.resetTimer = resetTimer;
window.nextTwister = nextTwister;
window.markTwisterComplete = markTwisterComplete;
window.speakTwister = speakTwister;
window.newReadingPassage = newReadingPassage;
window.speakText = speakText;
window.recordReadingSpeed = recordReadingSpeed;
window.toggleChat = toggleChat;
window.sendChatMessage = sendChatMessage;
window.submitFeedback = submitFeedback;
window.initiatePremiumPayment = initiatePremiumPayment;
window.toggleDarkMode = toggleDarkMode;