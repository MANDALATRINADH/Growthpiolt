// ============ GOOGLE CLIENT ID ============
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';

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
let selectedMood = '';

// ============ 30+ READING PASSAGES (Easy to Hard) ============
const READING_PASSAGES = [
    // EASY LEVEL (1-10)
    { text: "The sun is shining brightly today. The birds are singing in the trees. It is a beautiful day to go outside and play.", level: "Easy", difficulty: 1 },
    { text: "I like to read books. Reading helps me learn new things. My favorite books are about animals and nature.", level: "Easy", difficulty: 1 },
    { text: "My family likes to eat dinner together every evening. We talk about our day and share happy moments.", level: "Easy", difficulty: 1 },
    { text: "The cat sleeps on the soft couch. The dog plays in the green yard. They are best friends.", level: "Easy", difficulty: 1 },
    { text: "Water is essential for life. We should drink plenty of water every day to stay healthy and active.", level: "Easy", difficulty: 1 },
    { text: "The flowers in the garden are blooming. Their colors are red, yellow, pink, and purple. They smell wonderful.", level: "Easy", difficulty: 1 },
    { text: "My school has a big library. There are many books, computers, and comfortable chairs for reading.", level: "Easy", difficulty: 1 },
    { text: "Exercise is good for your body. Running, swimming, and cycling keep you fit and strong.", level: "Easy", difficulty: 1 },
    { text: "The moon shines at night. The stars twinkle in the dark sky. It is a peaceful sight.", level: "Easy", difficulty: 1 },
    { text: "I love eating fresh fruits like apples, bananas, and oranges. They are sweet and healthy.", level: "Easy", difficulty: 1 },
    
    // MEDIUM LEVEL (11-25)
    { text: "Technology has transformed the way we communicate with each other. Smartphones and social media platforms allow us to connect with people across the globe instantly, breaking down geographical barriers and creating a more interconnected world.", level: "Medium", difficulty: 2 },
    { text: "Artificial intelligence is revolutionizing various industries. From healthcare to transportation, AI systems are helping doctors diagnose diseases, enabling self-driving cars, and personalizing our online experiences.", level: "Medium", difficulty: 2 },
    { text: "Learning a new language opens doors to different cultures and perspectives. It requires dedication, patience, and consistent practice. The most successful language learners immerse themselves in the language daily.", level: "Medium", difficulty: 2 },
    { text: "Climate change is one of the most pressing challenges facing humanity. Rising temperatures, extreme weather events, and melting ice caps demand immediate action from governments and individuals alike.", level: "Medium", difficulty: 2 },
    { text: "Effective communication is a vital skill in both personal and professional life. It involves not only speaking clearly but also listening actively and understanding the emotions behind the words.", level: "Medium", difficulty: 2 },
    { text: "The human brain is remarkably complex, containing approximately 86 billion neurons. Each neuron can form thousands of connections, creating an intricate network that enables thought, memory, and consciousness.", level: "Medium", difficulty: 2 },
    { text: "Space exploration has revealed fascinating discoveries about our universe. From the Moon landing to Mars rovers, humanity continues to push the boundaries of what is possible beyond Earth.", level: "Medium", difficulty: 2 },
    { text: "Meditation and mindfulness practices have been shown to reduce stress, improve focus, and enhance overall well-being. Taking just ten minutes a day can make a significant difference.", level: "Medium", difficulty: 2 },
    { text: "Renewable energy sources like solar and wind power are becoming increasingly affordable. They offer a sustainable alternative to fossil fuels and help combat air pollution.", level: "Medium", difficulty: 2 },
    { text: "The art of public speaking combines confidence, preparation, and authentic connection with the audience. Great speakers tell compelling stories that resonate emotionally.", level: "Medium", difficulty: 2 },
    { text: "Entrepreneurship requires risk-taking, resilience, and creative problem-solving. Successful entrepreneurs learn from failures and adapt quickly to changing market conditions.", level: "Medium", difficulty: 2 },
    { text: "Digital literacy is essential in today's world. Understanding how to evaluate online information, protect personal data, and use technology responsibly are crucial skills.", level: "Medium", difficulty: 2 },
    { text: "Teamwork and collaboration drive innovation in the workplace. Diverse teams bring different perspectives, leading to more creative solutions and better decision-making.", level: "Medium", difficulty: 2 },
    { text: "Time management is key to productivity. Prioritizing tasks, setting goals, and avoiding distractions help individuals accomplish more in less time.", level: "Medium", difficulty: 2 },
    { text: "Emotional intelligence involves recognizing and managing your own emotions while understanding others' feelings. It is a predictor of success in relationships and careers.", level: "Medium", difficulty: 2 },
    
    // HARD LEVEL (26-35)
    { text: "The rapid advancement of quantum computing promises to revolutionize fields such as cryptography, drug discovery, and climate modeling. Unlike classical computers that use bits, quantum computers leverage qubits, which can exist in multiple states simultaneously, enabling them to solve complex problems exponentially faster than traditional systems.", level: "Hard", difficulty: 3 },
    { text: "Neuroscience has revealed that neuroplasticity—the brain's ability to reorganize itself by forming new neural connections—continues throughout life. This discovery has profound implications for rehabilitation after injury, treatment of mental health conditions, and lifelong learning capabilities.", level: "Hard", difficulty: 3 },
    { text: "The philosophical concept of consciousness remains one of science's greatest mysteries. While we can observe neural correlates of conscious experience, explaining why and how subjective awareness arises from physical matter is known as the 'hard problem' of consciousness.", level: "Hard", difficulty: 3 },
    { text: "Blockchain technology extends beyond cryptocurrency applications. Its decentralized, immutable ledger system offers potential solutions for supply chain transparency, digital identity verification, smart contracts, and secure voting systems.", level: "Hard", difficulty: 3 },
    { text: "Epigenetics reveals how environmental factors can influence gene expression without changing DNA sequences. These modifications can be inherited across generations, suggesting that our lifestyle choices may affect not only our health but potentially that of our descendants.", level: "Hard", difficulty: 3 },
    { text: "The theory of evolution by natural selection, first articulated by Charles Darwin, explains the diversity of life on Earth. Through variation, inheritance, and differential survival, species gradually adapt to their environments over generations.", level: "Hard", difficulty: 3 },
    { text: "Cognitive biases are systematic patterns of deviation from rational judgment. Understanding biases like confirmation bias, anchoring effect, and availability heuristic can help individuals make more objective decisions and avoid common logical pitfalls.", level: "Hard", difficulty: 3 },
    { text: "The global economy faces complex challenges including income inequality, automation's impact on employment, and sustainable development. Addressing these issues requires coordinated policy responses and innovative economic models.", level: "Hard", difficulty: 3 },
    { text: "Particle physics explores the fundamental constituents of matter and energy. The Standard Model describes twelve elementary particles and four fundamental forces, though dark matter and dark energy remain unexplained.", level: "Hard", difficulty: 3 },
    { text: "The intersection of ethics and artificial intelligence raises important questions about algorithmic bias, autonomous decision-making, and the future of human work. Developing ethical AI frameworks is crucial for responsible technological advancement.", level: "Hard", difficulty: 3 },
    { text: "Nanotechnology involves manipulating matter at the atomic and molecular scale. This field has applications in medicine, electronics, and materials science, enabling breakthroughs like targeted drug delivery and ultra-strong materials.", level: "Hard", difficulty: 3 },
    { text: "Behavioral economics integrates insights from psychology into economic theory, challenging the assumption of perfectly rational actors. Concepts like loss aversion, framing effects, and hyperbolic discounting explain seemingly irrational economic decisions.", level: "Hard", difficulty: 3 }
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
        { name: 'Node.js Basics', duration: '4 days', cat: 'fs' },
        { name: 'Express.js', duration: '3 days', cat: 'fs' },
        { name: 'Python Basics', duration: '5 days', cat: 'ai' },
        { name: 'AI Concepts', duration: '3 days', cat: 'ai' },
        { name: 'English Grammar', duration: 'ongoing', cat: 'en' },
        { name: 'Daily Vocabulary', duration: 'ongoing', cat: 'en' }
    ]},
    { month: 'Month 2: Intermediate', topics: [
        { name: 'React.js', duration: '6 days', cat: 'fs' },
        { name: 'React Hooks', duration: '5 days', cat: 'fs' },
        { name: 'MongoDB', duration: '6 days', cat: 'fs' },
        { name: 'REST APIs', duration: '5 days', cat: 'fs' },
        { name: 'Auth & Security', duration: '4 days', cat: 'fs' },
        { name: 'Python Data Science', duration: '5 days', cat: 'ai' },
        { name: 'ML Basics', duration: '5 days', cat: 'ai' },
        { name: 'AI APIs', duration: '4 days', cat: 'ai' },
        { name: 'Conversation Practice', duration: 'ongoing', cat: 'en' },
        { name: 'Pronunciation', duration: 'ongoing', cat: 'en' }
    ]},
    { month: 'Month 3: Advanced', topics: [
        { name: 'Advanced React', duration: '5 days', cat: 'fs' },
        { name: 'TypeScript', duration: '4 days', cat: 'fs' },
        { name: 'Next.js', duration: '5 days', cat: 'fs' },
        { name: 'DevOps Basics', duration: '4 days', cat: 'fs' },
        { name: 'Full Stack Project #1', duration: '7 days', cat: 'fs' },
        { name: 'Deep Learning', duration: '5 days', cat: 'ai' },
        { name: 'AI-Powered Apps', duration: '5 days', cat: 'ai' },
        { name: 'Full Stack Project #2', duration: '7 days', cat: 'fs' },
        { name: 'Fluency Challenge', duration: 'ongoing', cat: 'en' },
        { name: 'Presentation Skills', duration: 'ongoing', cat: 'en' }
    ]}
];

// ============ CHATBOT RESPONSES ============
const CHAT_RESPONSES = {
    'how to use': 'You can navigate using the sidebar menu. Start with Dashboard, then explore Timetable, Roadmap, Habits, English Fluency, and Notes!',
    'features': 'GrowthPilot offers: 📊 Dashboard analytics, 📅 Timetable planner, 🗺️ 3-Month Roadmap, ✅ Daily Habits tracker, 🎤 English Fluency practice with 30+ passages, 👅 Tongue Twisters, and 📝 Notes & Journal!',
    'habit': 'Click on "Daily Habits" in the sidebar, then click "+ Add Habit" to create new habits. Click on the day circles to mark them as complete!',
    'roadmap': 'The 3-Month Roadmap shows your learning path. Click on any topic to mark it as complete. Your progress is tracked automatically!',
    'timetable': 'Go to Timetable page, click "+ Add Block" to schedule your day. You can also use the Quick Templates for common schedules!',
    'timer': 'The Quick Timer helps you focus. Choose 5, 25, or 50 minutes, then click Start. Your study time is tracked automatically!',
    'analytics': 'The Analytics page shows your study distribution, category progress, and personalized insights based on your activity!',
    'note': 'You can add quick notes and daily journal entries with mood tracking. All your notes are saved automatically!',
    'account': 'You can create an account using email/password or Google login. Your data is saved securely in your browser!',
    'problem': 'If you face any issues, please use the Feedback & Support page to contact us. We respond within 24 hours!',
    'streak': 'Your streak counts consecutive days of activity. Complete tasks and habits daily to increase your streak!',
    'help': 'I can help you with: features, habits, roadmap, timetable, timer, analytics, notes, account issues, and troubleshooting. What would you like to know?',
    'contact': 'You can reach us at growthpilot@gmail.com or call +91 6304248659. Our office is in Visakhapatnam, Andhra Pradesh!',
    'feedback': 'Go to the Feedback & Support page in the sidebar to send us your feedback, suggestions, or report any issues!',
    'default': "I'm here to help! You can ask me about: 📊 Features, ✅ Habits, 🗺️ Roadmap, 📅 Timetable, ⏱️ Timer, 📈 Analytics, 📝 Notes, 🔐 Account, 💬 Feedback, or 📞 Contact info."
};

// ============ DEFAULT DATA ============
function getDefaultData() {
    return {
        schedule: [],
        habits: [
            { id: 1, name: 'Study Coding', icon: '💻', completed: [] },
            { id: 2, name: 'Practice English', icon: '🎤', completed: [] },
            { id: 3, name: 'Tongue Twisters', icon: '👅', completed: [] },
            { id: 4, name: 'Exercise', icon: '🏃', completed: [] },
            { id: 5, name: 'Read 30min', icon: '📖', completed: [] }
        ],
        roadmapCompleted: {},
        twisters: { streak: 0, easy: [], medium: [], hard: [] },
        english: { speeds: [] },
        notes: [],
        journals: [],
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
        if (sidebar.style.transform === 'translateX(0px)') {
            sidebar.style.transform = 'translateX(-100%)';
        } else {
            sidebar.style.transform = 'translateX(0)';
        }
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
    if (pageId === 'english') newReadingPassage();
    if (pageId === 'tonguetwisters') {
        renderCurrentTwister();
        updateTwisterStats();
        renderTwisterList();
    }
    if (pageId === 'notes') {
        renderNotes();
        renderJournals();
    }
    if (pageId === 'feedback') {
        renderFeedbackList();
    }
    
    if (window.innerWidth <= 1024) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.style.transform = 'translateX(-100%)';
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
function sendFeedback() {
    const text = document.getElementById('feedbackText').value.trim();
    const name = document.getElementById('feedbackName').value.trim();
    const email = document.getElementById('feedbackEmail').value.trim();
    
    if (!text) {
        showToast('Please enter your feedback', 'error');
        return;
    }
    
    if (!appData.feedbacks) appData.feedbacks = [];
    appData.feedbacks.unshift({
        id: Date.now().toString(),
        text: text,
        name: name || 'Anonymous',
        email: email || 'Not provided',
        date: new Date().toISOString()
    });
    saveDataImmediately();
    renderFeedbackList();
    document.getElementById('feedbackText').value = '';
    document.getElementById('feedbackName').value = '';
    document.getElementById('feedbackEmail').value = '';
    showToast('Thank you for your feedback! 🙏');
}

function renderFeedbackList() {
    const container = document.getElementById('feedbackList');
    if (!container) return;
    if (!appData.feedbacks?.length) {
        container.innerHTML = '<div class="text-center py-8 text-gray-500">No feedback yet. Be the first to share!</div>';
        return;
    }
    container.innerHTML = appData.feedbacks.slice(0, 10).map(f => `
        <div class="bg-gray-50 rounded-lg p-3">
            <div class="flex justify-between items-start">
                <div>
                    <div class="font-semibold text-gray-800">${escapeHtml(f.name)}</div>
                    <div class="text-gray-600 text-sm mt-1">${escapeHtml(f.text)}</div>
                </div>
                <div class="text-xs text-gray-400">${new Date(f.date).toLocaleDateString()}</div>
            </div>
            ${f.email !== 'Not provided' ? `<div class="text-xs text-gray-400 mt-1">📧 ${escapeHtml(f.email)}</div>` : ''}
        </div>
    `).join('');
}

// ============ LOGOUT DROPDOWN ============
function toggleLogoutDropdown() {
    const dropdown = document.getElementById('logoutDropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
}

document.addEventListener('click', function(event) {
    const profileBtn = document.getElementById('userProfileBtn');
    const dropdown = document.getElementById('logoutDropdown');
    if (profileBtn && dropdown && !profileBtn.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});

// ============ GOOGLE LOGIN ============
function handleGoogleLogin() {
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
        const email = prompt("Enter your Gmail address:", "yourname@gmail.com");
        if (!email) return;
        if (!email.endsWith('@gmail.com')) {
            showToast('Please enter a valid Gmail address', 'error');
            return;
        }
        const name = prompt("Enter your name:", email.split('@')[0]);
        if (!name) return;
        
        let users = JSON.parse(localStorage.getItem('growthpilot_users') || '{}');
        users[email] = { name, email, password: 'google_' + Date.now() };
        localStorage.setItem('growthpilot_users', JSON.stringify(users));
        
        currentUser = { email, name };
        localStorage.setItem('growthpilot_current_user', JSON.stringify(currentUser));
        
        showToast(`Welcome ${name}! 🎉`);
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
        renderJournals();
        newReadingPassage();
        renderCurrentTwister();
        updateTwisterStats();
        renderTwisterList();
        initAnalytics();
        renderFeedbackList();
    } else {
        window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}&response_type=token&scope=email profile`;
    }
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
    renderJournals();
    newReadingPassage();
    renderCurrentTwister();
    updateTwisterStats();
    renderTwisterList();
    initAnalytics();
    renderFeedbackList();
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
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';
        showLoginForm();
    }
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
    renderJournals();
    newReadingPassage();
    renderCurrentTwister();
    updateTwisterStats();
    renderTwisterList();
    initAnalytics();
    renderFeedbackList();
}

function updateUserUI() {
    if (!currentUser) return;
    document.getElementById('userName').innerText = currentUser.name;
    document.getElementById('userAvatar').innerText = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('welcomeName').innerHTML = `${currentUser.name} 👋`;
}

// ============ READING PASSAGES FUNCTION ============
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
    if (!seconds) {
        showToast('Enter seconds', 'error');
        return;
    }
    const passage = READING_PASSAGES[currentPassageIdx];
    const wordCount = passage.text.split(' ').length;
    const wpm = Math.round(wordCount / (seconds / 60));
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
                    data: [0, 0, 0, 0, 0, 0, 0],
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
        const today = getTodayKey();
        const todayMins = (appData.studyMinutes?.[today] || 0) / 60;
        insights.innerHTML = `
            <div class="bg-indigo-50 rounded-lg p-4"><p class="text-indigo-800 font-semibold mb-2">📊 Today's Activity</p><p class="text-gray-600">You studied ${todayMins.toFixed(1)} hours today. ${todayMins < 1 ? 'Try to study at least 1 hour daily!' : 'Great job! Keep it up!'}</p></div>
            <div class="bg-indigo-50 rounded-lg p-4"><p class="text-indigo-800 font-semibold mb-2">💡 Pro Tip</p><p class="text-gray-600">Complete your daily habits and roadmap topics to unlock achievements and increase your streak!</p></div>
            <div class="bg-indigo-50 rounded-lg p-4"><p class="text-indigo-800 font-semibold mb-2">🎯 Reading Challenge</p><p class="text-gray-600">We have ${READING_PASSAGES.length} reading passages from Easy to Hard. Practice daily to improve your English fluency!</p></div>
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
            <div class="flex-1 px-3 py-2 rounded-lg cursor-pointer ${i.completed ? 'bg-green-50 line-through text-gray-400' : 'bg-indigo-50'}" onclick="toggleTask('${i.id}')">${escapeHtml(i.activity)}</div>
        </div>
    `).join('') : '<p class="text-gray-500 text-center py-8">No blocks scheduled</p>';
    
    if (container) container.innerHTML = html;
    if (fullContainer) fullContainer.innerHTML = html;
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
            appData.studyMinutes[today] = (appData.studyMinutes[today] || 0) + mins;
        }
        saveDataImmediately();
        renderScheduleUI();
        updateDashboard();
        showToast(task.completed ? 'Task completed! 🎉' : 'Task unmarked');
    }
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
    
    appData.schedule.push({
        id: Date.now().toString(),
        date: getTodayKey(),
        start, end, activity, category, completed: false
    });
    saveDataImmediately();
    closeModal('scheduleModal');
    renderScheduleUI();
    updateDashboard();
    showToast('Block added!');
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
            { start: '09:00', end: '11:00', activity: 'Frontend Study', category: 'coding' },
            { start: '11:00', end: '11:30', activity: 'Break', category: 'break' },
            { start: '11:30', end: '13:30', activity: 'Backend Study', category: 'coding' },
            { start: '14:00', end: '15:30', activity: 'AI/ML', category: 'ai' },
            { start: '15:30', end: '16:30', activity: 'English', category: 'english' }
        ],
        student: [
            { start: '09:00', end: '11:00', activity: 'Core Study', category: 'study' },
            { start: '11:30', end: '13:30', activity: 'Web Dev', category: 'coding' },
            { start: '14:00', end: '15:30', activity: 'AI Concepts', category: 'ai' }
        ],
        balanced: [
            { start: '08:00', end: '09:00', activity: 'Exercise', category: 'exercise' },
            { start: '09:30', end: '11:30', activity: 'Learning', category: 'study' },
            { start: '13:00', end: '15:00', activity: 'Coding', category: 'coding' },
            { start: '15:00', end: '16:00', activity: 'English', category: 'english' }
        ]
    };
    const blocks = (templates[type] || []).map(t => ({
        id: Date.now().toString() + Math.random(),
        date: today, ...t, completed: false
    }));
    appData.schedule = (appData.schedule || []).filter(s => s.date !== today).concat(blocks);
    saveDataImmediately();
    renderScheduleUI();
    updateDashboard();
    showToast(type + ' template applied!');
}

// ============ ROADMAP ============
function renderRoadmap() {
    const container = document.getElementById('roadmapContainer');
    if (!container) return;
    let total = 0, done = 0;
    container.innerHTML = ROADMAP_DATA.map((month, mi) => `
        <div class="min-w-[320px] bg-indigo-50 rounded-xl overflow-hidden">
            <div class="p-4 bg-gradient-to-r from-indigo-200 to-purple-200 border-b border-indigo-200">
                <h3 class="font-semibold text-gray-800">${month.month}</h3>
            </div>
            <div class="p-2 space-y-1">
                ${month.topics.map((topic, ti) => {
                    const key = mi + '-' + ti;
                    const completed = appData.roadmapCompleted?.[key];
                    total++; if (completed) done++;
                    return `
                        <div class="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-indigo-100 transition ${completed ? 'opacity-60' : ''}" onclick="toggleRoadmapTopic('${key}')">
                            <div class="w-5 h-5 rounded-full border-2 ${completed ? 'bg-green-500 border-green-500' : 'border-gray-300'} flex items-center justify-center text-xs text-white">${completed ? '✓' : ''}</div>
                            <div><div class="text-gray-800 text-sm">${escapeHtml(topic.name)}</div><div class="text-gray-400 text-xs">${topic.duration}</div></div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

function toggleRoadmapTopic(key) {
    if (!appData.roadmapCompleted) appData.roadmapCompleted = {};
    appData.roadmapCompleted[key] = !appData.roadmapCompleted[key];
    saveDataImmediately();
    renderRoadmap();
    updateDashboard();
    showToast(appData.roadmapCompleted[key] ? 'Topic completed! 🎉' : 'Topic unmarked');
}

function resetRoadmap() {
    if (confirm('Reset all roadmap progress?')) {
        appData.roadmapCompleted = {};
        saveDataImmediately();
        renderRoadmap();
        updateDashboard();
        showToast('Roadmap reset');
    }
}

// ============ HABITS ============
function renderHabits() {
    const container = document.getElementById('habitTrackerContainer');
    if (!container) return;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekDates = (() => {
        let today = new Date(), day = today.getDay(), diff = today.getDate() - day + (day === 0 ? -6 : 1);
        let monday = new Date(today);
        monday.setDate(diff);
        return Array.from({ length: 7 }, (_, i) => {
            let d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d;
        });
    })();
    
    if (!appData.habits?.length) {
        container.innerHTML = '<div class="text-center py-8 text-gray-500">Add habits to start</div>';
        return;
    }
    
    let html = '<div class="overflow-x-auto"><div class="grid grid-cols-8 gap-2 min-w-[600px]"><div></div>' +
        days.map(d => `<div class="text-center text-xs text-gray-500 font-semibold py-2">${d}</div>`).join('');
    
    appData.habits.forEach(habit => {
        html += `<div class="flex items-center gap-2 col-span-8 py-2"><span class="text-xl">${habit.icon}</span><span class="text-sm text-gray-700">${escapeHtml(habit.name)}</span></div>`;
        weekDates.forEach(date => {
            const key = date.toISOString().split('T')[0];
            const isToday = key === getTodayKey();
            const isDone = habit.completed?.includes(key);
            html += `<div class="aspect-square bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-indigo-100 transition ${isDone ? 'bg-indigo-200' : ''} ${isToday ? 'ring-2 ring-indigo-500' : ''}" onclick="toggleHabit(${habit.id},'${key}')">${isDone ? '✓' : ''}</div>`;
        });
    });
    html += '</div></div>';
    container.innerHTML = html;
    updateAchievements();
}

function toggleHabit(id, date) {
    const habit = appData.habits.find(h => h.id == id);
    if (habit) {
        if (!habit.completed) habit.completed = [];
        const idx = habit.completed.indexOf(date);
        idx >= 0 ? habit.completed.splice(idx, 1) : habit.completed.push(date);
        saveDataImmediately();
        renderHabits();
        updateDashboard();
    }
}

function addHabit() {
    const name = document.getElementById('habitName').value.trim();
    const icon = document.getElementById('habitIcon').value.trim() || '📌';
    if (!name) {
        showToast('Enter habit name', 'error');
        return;
    }
    appData.habits.push({ id: Date.now(), name: name, icon: icon, completed: [] });
    saveDataImmediately();
    closeModal('habitModal');
    renderHabits();
    showToast('Habit added!');
}

function openAddHabitModal() {
    openModal('habitModal');
}

function updateAchievements() {
    const container = document.getElementById('achievementsContainer');
    if (!container) return;
    
    let aiDone = false;
    ROADMAP_DATA.forEach((m, i) => {
        m.topics.forEach((t, j) => {
            if (t.cat === 'ai' && appData.roadmapCompleted?.[i + '-' + j]) aiDone = true;
        });
    });
    
    const achievements = [
        { name: 'First Step', desc: 'Complete first habit', icon: '🌱', check: appData.habits.some(h => h.completed?.length > 0) },
        { name: 'Streak Master', desc: '3 day streak', icon: '🔥', check: appData.streak >= 3 },
        { name: 'Language Lover', desc: '5 twisters', icon: '🗣️', check: (appData.twisters?.easy?.length + appData.twisters?.medium?.length + appData.twisters?.hard?.length) >= 5 },
        { name: 'Code Warrior', desc: '5 topics', icon: '💻', check: Object.values(appData.roadmapCompleted || {}).filter(Boolean).length >= 5 },
        { name: 'AI Explorer', desc: 'First AI topic', icon: '🤖', check: aiDone }
    ];
    
    container.innerHTML = achievements.map(a => `
        <div class="flex items-center gap-3 p-3 ${a.check ? 'bg-indigo-50' : 'bg-gray-50'} rounded-lg">
            <div class="text-2xl">${a.icon}</div>
            <div class="flex-1">
                <div class="font-semibold text-gray-800">${a.check ? '🏆 ' : '🔒 '}${a.name}</div>
                <div class="text-xs text-gray-500">${a.desc}</div>
            </div>
            ${a.check ? '<div class="text-green-500">✓</div>' : '<div class="text-gray-400">⚡</div>'}
        </div>
    `).join('');
}

// ============ NOTES ============
function renderNotes() {
    const container = document.getElementById('notesList');
    if (!container) return;
    if (!appData.notes?.length) {
        container.innerHTML = '<div class="text-center py-8 text-gray-500">No notes yet</div>';
        return;
    }
    container.innerHTML = appData.notes.map(n => `
        <div class="bg-white rounded-lg p-3 flex justify-between items-center shadow-sm border border-gray-100">
            <div><div class="text-gray-800 text-sm">${escapeHtml(n.text)}</div><div class="text-gray-400 text-xs">${new Date(n.date).toLocaleDateString()}</div></div>
            <button class="text-red-400 hover:text-red-500" onclick="deleteNote('${n.id}')">🗑️</button>
        </div>
    `).join('');
}

function addNote() {
    const input = document.getElementById('noteInput');
    if (!input.value.trim()) {
        showToast('Write something', 'error');
        return;
    }
    if (!appData.notes) appData.notes = [];
    appData.notes.unshift({
        id: Date.now().toString(),
        text: input.value.trim(),
        date: new Date().toISOString()
    });
    saveDataImmediately();
    input.value = '';
    renderNotes();
    showToast('Note added!');
}

function deleteNote(id) {
    appData.notes = appData.notes.filter(n => n.id !== id);
    saveDataImmediately();
    renderNotes();
}

// ============ JOURNAL ============
function saveJournal() {
    const text = document.getElementById('journalInput').value.trim();
    if (!text) {
        showToast('Write something', 'error');
        return;
    }
    if (!appData.journals) appData.journals = [];
    appData.journals.unshift({
        id: Date.now().toString(),
        text: text,
        mood: selectedMood || '😐',
        date: new Date().toISOString()
    });
    saveDataImmediately();
    document.getElementById('journalInput').value = '';
    renderJournals();
    showToast('Journal saved!');
}

function renderJournals() {
    const container = document.getElementById('journalHistory');
    if (!container) return;
    if (!appData.journals?.length) {
        container.innerHTML = '<div class="text-center py-8 text-gray-500">No journal entries</div>';
        return;
    }
    container.innerHTML = appData.journals.slice(0, 5).map(j => `
        <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div class="text-gray-800 text-sm">${j.mood} ${escapeHtml(j.text.substring(0, 70))}</div>
            <div class="text-gray-400 text-xs mt-1">${new Date(j.date).toLocaleDateString()}</div>
        </div>
    `).join('');
}

function selectMood(el, mood) {
    document.querySelectorAll('#moodSelector span').forEach(s => s.style.transform = 'scale(1)');
    el.style.transform = 'scale(1.2)';
    selectedMood = mood;
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

function markTwisterComplete() {
    const twister = TONGUE_TWISTERS[currentTwisterIdx];
    if (!appData.twisters) appData.twisters = { streak: 0, easy: [], medium: [], hard: [] };
    
    if (twister.difficulty === 'easy' && !appData.twisters.easy.includes(twister.text)) {
        appData.twisters.easy.push(twister.text);
    } else if (twister.difficulty === 'medium' && !appData.twisters.medium.includes(twister.text)) {
        appData.twisters.medium.push(twister.text);
    } else if (twister.difficulty === 'hard' && !appData.twisters.hard.includes(twister.text)) {
        appData.twisters.hard.push(twister.text);
    }
    appData.twisters.streak++;
    saveDataImmediately();
    updateTwisterStats();
    renderTwisterList();
    showToast('Twister mastered! 🎤');
    nextTwister();
}

function updateTwisterStats() {
    if (!appData.twisters) appData.twisters = { streak: 0, easy: [], medium: [], hard: [] };
    document.getElementById('twisterStreak').innerText = appData.twisters.streak;
    document.getElementById('easyCount').innerText = appData.twisters.easy.length;
    document.getElementById('mediumCount').innerText = appData.twisters.medium.length;
    document.getElementById('hardCount').innerText = appData.twisters.hard.length;
    
    const easyTotal = TONGUE_TWISTERS.filter(t => t.difficulty === 'easy').length;
    const mediumTotal = TONGUE_TWISTERS.filter(t => t.difficulty === 'medium').length;
    const hardTotal = TONGUE_TWISTERS.filter(t => t.difficulty === 'hard').length;
    
    document.getElementById('easyBar').style.width = Math.min((appData.twisters.easy.length / easyTotal) * 100, 100) + '%';
    document.getElementById('mediumBar').style.width = Math.min((appData.twisters.medium.length / mediumTotal) * 100, 100) + '%';
    document.getElementById('hardBar').style.width = Math.min((appData.twisters.hard.length / hardTotal) * 100, 100) + '%';
}

function renderTwisterList() {
    const container = document.getElementById('twisterList');
    if (!container) return;
    container.innerHTML = TONGUE_TWISTERS.map((t, i) => {
        const done = appData.twisters?.easy?.includes(t.text) ||
                     appData.twisters?.medium?.includes(t.text) ||
                     appData.twisters?.hard?.includes(t.text);
        return `
            <div class="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:bg-indigo-50 transition shadow-sm border border-gray-100" onclick="currentTwisterIdx=${i};renderCurrentTwister();">
                <span class="text-gray-700">${done ? '✅' : '⬜'} ${t.text}</span>
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
    document.getElementById('timerStartBtn').innerHTML = '▶ Start';
}

function toggleTimer() {
    const btn = document.getElementById('timerStartBtn');
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        btn.innerHTML = '▶ Resume';
    } else {
        timerRunning = true;
        btn.innerHTML = '⏸ Pause';
        timerInterval = setInterval(() => {
            timerSeconds--;
            document.getElementById('timerDisplay').innerText = formatTime(timerSeconds);
            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                showToast('Timer done! ☕');
                const today = getTodayKey();
                appData.studyMinutes[today] = (appData.studyMinutes[today] || 0) + 25;
                saveDataImmediately();
                updateDashboard();
                btn.innerHTML = '▶ Start';
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerSeconds = 25 * 60;
    document.getElementById('timerDisplay').innerText = formatTime(timerSeconds);
    document.getElementById('timerStartBtn').innerHTML = '▶ Start';
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
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

// ============ EXPOSE FUNCTIONS ============
window.toggleSidebar = toggleSidebar;
window.navigateTo = navigateTo;
window.showLoginForm = showLoginForm;
window.showSignupForm = showSignupForm;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleGoogleLogin = handleGoogleLogin;
window.logout = logout;
window.openModal = openModal;
window.closeModal = closeModal;
window.toggleTask = toggleTask;
window.addScheduleBlock = addScheduleBlock;
window.openAddScheduleModal = openAddScheduleModal;
window.applyTemplate = applyTemplate;
window.toggleRoadmapTopic = toggleRoadmapTopic;
window.resetRoadmap = resetRoadmap;
window.toggleHabit = toggleHabit;
window.addHabit = addHabit;
window.openAddHabitModal = openAddHabitModal;
window.addNote = addNote;
window.deleteNote = deleteNote;
window.saveJournal = saveJournal;
window.selectMood = selectMood;
window.setTimer = setTimer;
window.toggleTimer = toggleTimer;
window.resetTimer = resetTimer;
window.nextTwister = nextTwister;
window.markTwisterComplete = markTwisterComplete;
window.newReadingPassage = newReadingPassage;
window.speakText = speakText;
window.recordReadingSpeed = recordReadingSpeed;
window.toggleChat = toggleChat;
window.sendChatMessage = sendChatMessage;
window.sendFeedback = sendFeedback;