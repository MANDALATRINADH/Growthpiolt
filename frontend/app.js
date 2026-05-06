// ==============================================
// GROWTH PILOT - COMPLETE JAVASCRIPT
// Enhanced: Roadmap (20+ topics), Tongue Twisters (20), English (15+ passages)
// Premium Monthly ₹99 & Yearly ₹999, Notes + Journal, Feedback with Contact
// Razorpay Payment Integration Ready
// ==============================================

const GOOGLE_CLIENT_ID = '956139573371-kk1o33j2kcfrri7mgmh4p64ojh3jkfjd.apps.googleusercontent.com';
const BACKEND_URL = 'http://localhost:5003';
let currentUser = null, appData = null;
let weeklyChartInst = null, distributionChart = null, categoryChart = null;
let timerInterval = null, timerSeconds = 25 * 60, timerRunning = false;
let currentTwisterIdx = 0, currentPassageIdx = 0;
let selectedMood = '😐';

// ============ ENHANCED READING PASSAGES (15+ passages) ============
const READING_PASSAGES = [
    { text: "The sun is shining brightly today. Birds are singing in the trees. It's a beautiful day to go outside and play.", level: "Easy", words: 20 },
    { text: "I like to read books. Reading helps me learn new things. My favorite books are about animals and nature.", level: "Easy", words: 18 },
    { text: "My family likes to eat dinner together every evening. We talk about our day and share happy moments.", level: "Easy", words: 18 },
    { text: "Water is essential for life. We should drink plenty of water every day to stay healthy and active.", level: "Easy", words: 17 },
    { text: "Exercise is good for your body. Running, swimming, and cycling keep you fit and strong.", level: "Easy", words: 15 },
    { text: "Technology has transformed the way we communicate with each other. Smartphones allow us to connect with people across the globe instantly.", level: "Medium", words: 22 },
    { text: "Artificial intelligence is revolutionizing various industries. AI systems are helping doctors diagnose diseases and enabling self-driving cars.", level: "Medium", words: 20 },
    { text: "Climate change is one of the most pressing challenges facing humanity. Rising temperatures demand immediate action.", level: "Medium", words: 18 },
    { text: "Effective communication is a vital skill in both personal and professional life. It involves speaking clearly and listening actively.", level: "Medium", words: 19 },
    { text: "Meditation and mindfulness practices reduce stress, improve focus, and enhance overall well-being.", level: "Medium", words: 16 },
    { text: "The rapid advancement of quantum computing promises to revolutionize cryptography, drug discovery, and climate modeling.", level: "Hard", words: 18 },
    { text: "Neuroscience reveals that neuroplasticity—the brain's ability to reorganize itself—continues throughout life.", level: "Hard", words: 16 },
    { text: "Blockchain technology extends beyond cryptocurrency, offering solutions for supply chain transparency and digital identity.", level: "Hard", words: 17 },
    { text: "Epigenetics reveals how environmental factors influence gene expression without changing DNA sequences.", level: "Hard", words: 16 },
    { text: "The theory of evolution explains the diversity of life through variation, inheritance, and differential survival.", level: "Hard", words: 17 }
];

// ============ ENHANCED TONGUE TWISTERS (20 twisters) ============
const TONGUE_TWISTERS = [
    { text: "She sells seashells by the seashore", difficulty: 'easy' },
    { text: "Peter Piper picked a peck of pickled peppers", difficulty: 'easy' },
    { text: "How much wood would a woodchuck chuck", difficulty: 'easy' },
    { text: "I scream you scream we all scream for ice cream", difficulty: 'easy' },
    { text: "Fuzzy Wuzzy was a bear", difficulty: 'easy' },
    { text: "Betty Botter bought some butter", difficulty: 'easy' },
    { text: "A big black bug bit a big black bear", difficulty: 'medium' },
    { text: "Red lorry yellow lorry red lorry yellow lorry", difficulty: 'medium' },
    { text: "Unique New York you know you need unique New York", difficulty: 'medium' },
    { text: "Six slippery snails slid slowly seaward", difficulty: 'medium' },
    { text: "Through three cheese trees three free fleas flew", difficulty: 'medium' },
    { text: "I saw Susie sitting in a shoeshine shop", difficulty: 'medium' },
    { text: "Pad kid poured curd pulled cod", difficulty: 'hard' },
    { text: "Irish wristwatch Swiss wristwatch", difficulty: 'hard' },
    { text: "Specific Pacific Pacific specific specific Pacific", difficulty: 'hard' },
    { text: "Six sick hicks nick six slick bricks with picks", difficulty: 'hard' },
    { text: "Luke Luck likes lakes. Luke's duck likes lakes", difficulty: 'hard' },
    { text: "Fresh fried fish, fish fresh fried, fried fish fresh", difficulty: 'hard' },
    { text: "Black bug's blood, black bug's blood, black bug's blood", difficulty: 'hard' },
    { text: "Which wristwatches are Swiss wristwatches", difficulty: 'hard' }
];

// ============ ENHANCED ROADMAP DATA (20+ topics) ============
const ROADMAP_DATA = [
    { month: 'Month 1: Foundations', topics: [
        { name: 'HTML & CSS Fundamentals', duration: '5 days', cat: 'fs' },
        { name: 'JavaScript Basics (ES6+)', duration: '7 days', cat: 'fs' },
        { name: 'DOM Manipulation & Events', duration: '4 days', cat: 'fs' },
        { name: 'Git & GitHub Workflow', duration: '3 days', cat: 'fs' },
        { name: 'Responsive Design (Flex/Grid)', duration: '4 days', cat: 'fs' },
        { name: 'Python Basics', duration: '5 days', cat: 'ai' },
        { name: 'English Grammar Essentials', duration: 'ongoing', cat: 'en' },
        { name: 'Daily Vocabulary Builder', duration: 'ongoing', cat: 'en' }
    ]},
    { month: 'Month 2: Intermediate', topics: [
        { name: 'React.js Core Concepts', duration: '6 days', cat: 'fs' },
        { name: 'React Hooks (useState, useEffect)', duration: '5 days', cat: 'fs' },
        { name: 'Node.js & Express.js', duration: '6 days', cat: 'fs' },
        { name: 'MongoDB & Mongoose', duration: '5 days', cat: 'fs' },
        { name: 'RESTful APIs Design', duration: '5 days', cat: 'fs' },
        { name: 'Authentication (JWT)', duration: '4 days', cat: 'fs' },
        { name: 'Python Data Science', duration: '5 days', cat: 'ai' },
        { name: 'Machine Learning Basics', duration: '5 days', cat: 'ai' },
        { name: 'Conversation Practice', duration: 'ongoing', cat: 'en' },
        { name: 'Pronunciation Training', duration: 'ongoing', cat: 'en' }
    ]},
    { month: 'Month 3: Advanced', topics: [
        { name: 'Advanced React Patterns', duration: '5 days', cat: 'fs' },
        { name: 'TypeScript Integration', duration: '4 days', cat: 'fs' },
        { name: 'Next.js Framework', duration: '5 days', cat: 'fs' },
        { name: 'DevOps Basics (Docker)', duration: '4 days', cat: 'fs' },
        { name: 'Full Stack Project #1', duration: '7 days', cat: 'fs' },
        { name: 'Full Stack Project #2', duration: '7 days', cat: 'fs' },
        { name: 'Deep Learning Intro', duration: '5 days', cat: 'ai' },
        { name: 'AI-Powered Applications', duration: '5 days', cat: 'ai' },
        { name: 'Fluency Challenge', duration: 'ongoing', cat: 'en' },
        { name: 'Presentation Skills', duration: 'ongoing', cat: 'en' }
    ]}
];

// ============ CHATBOT SMART RESPONSES ============
const CHAT_RESPONSES = {
    'how to use': 'Navigate using the sidebar! Start with Dashboard, then explore Timetable, Roadmap, Habits, English Fluency, Twisters, Notes, and Premium.',
    'features': 'GrowthPilot offers: 📊 Dashboard analytics, 📅 Timetable planner, 🗺️ 3-Month Roadmap (20+ topics), ✅ Daily Habits tracker, 🎤 English Fluency (15+ passages), 👅 20 Tongue Twisters, 📝 Notes & Journal, 💬 Feedback & Support, ⭐ Premium Plans (₹99/month, ₹999/year)!',
    'habit': 'Click "Daily Habits" in sidebar, then "+ Add Habit" to create new habits. Click the day circles to mark them complete! Each habit gives +10 XP.',
    'roadmap': 'The 3-Month Roadmap has 20+ topics across Full Stack, AI, and English. Click any topic to mark as complete and earn +50 XP!',
    'timetable': 'Go to Timetable page, click "+ Add Block" to schedule your day. Use Quick Templates for Developer, Student, or Balanced schedules!',
    'timer': 'The Focus Timer helps you study effectively. Choose 5, 25, or 50 minutes. Complete a session to earn +25 XP for study hours!',
    'analytics': 'Analytics page shows your study distribution, category progress, and personalized insights based on your activity!',
    'note': 'Notes & Journal page lets you save quick notes and daily journal entries with mood tracking! All data is saved locally.',
    'premium': 'Premium plans: Monthly ₹99 or Yearly ₹999 (save 16% + 2 months free). Unlock unlimited notes, advanced analytics, priority support, and exclusive features!',
    'contact': 'Contact us at: 📧 mandalatrinadh2005@gmail.com, 📱 +91 6304248659, 📍 Visakhapatnam, Andhra Pradesh, India.',
    'feedback': 'Go to Feedback & Support page to share your thoughts. We respond within 24 hours!',
    'streak': 'Your streak counts consecutive days of activity. Complete habits and tasks daily to increase your streak!',
    'english': 'English Fluency Lab has 15+ reading passages from Easy to Hard. Practice reading and track your WPM speed!',
    'twisters': 'Tongue Twisters section has 20 challenges from Easy to Hard. Master them all to earn XP and increase your streak!',
    'help': 'I can help with: features, habits, roadmap, timetable, timer, analytics, notes, premium plans, contact info, and troubleshooting. What do you need?',
    'payment': 'We use Razorpay for secure payments. Monthly plan ₹99, Yearly plan ₹999. Your payment is 100% secure!',
    'default': "I'm your GrowthPilot AI assistant! Ask me about: 📊 Dashboard • 🗺️ Roadmap • ✅ Habits • 🎤 English • 👅 Twisters • 📝 Notes • ⭐ Premium • 📞 Contact • 💬 Feedback"
};

// ============ DEFAULT DATA ============
function getDefaultData() {
    return {
        schedule: [],
        habits: [
            { id: 1, name: 'Study Coding', icon: '💻', completed: [] },
            { id: 2, name: 'Practice English', icon: '🎤', completed: [] },
            { id: 3, name: 'Exercise', icon: '🏃', completed: [] },
            { id: 4, name: 'Read 30 mins', icon: '📖', completed: [] },
            { id: 5, name: 'Meditation', icon: '🧘', completed: [] }
        ],
        roadmapCompleted: {},
        twisters: { streak: 0, easy: [], medium: [], hard: [] },
        english: { speeds: [] },
        notes: [],
        journals: [],
        feedbacks: [],
        streak: 0,
        lastActiveDate: null,
        studyMinutes: {},
        isPremium: false,
        premiumPlan: null,
        premiumExpiry: null,
        premiumPaymentId: null
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

// ============ SIDEBAR & MODALS ============
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('-translate-x-full'); }
function openModal(id) { document.getElementById(id).classList.remove('hidden'); document.getElementById(id).classList.add('flex'); }
function closeModal(id) { document.getElementById(id).classList.remove('flex'); document.getElementById(id).classList.add('hidden'); }
function getTodayKey() { return new Date().toISOString().split('T')[0]; }
function escapeHtml(str) { if (!str) return ''; const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }

function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    const nav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (nav) nav.classList.add('active');
    if (pageId === 'dashboard') updateDashboard();
    if (pageId === 'roadmap') renderRoadmap();
    if (pageId === 'habits') renderHabits();
    if (pageId === 'timetable') renderScheduleUI();
    if (pageId === 'analytics') initAnalytics();
    if (pageId === 'notes') { renderNotes(); renderJournals(); }
    if (pageId === 'tonguetwisters') { renderCurrentTwister(); updateTwisterStats(); renderTwisterList(); }
    if (pageId === 'feedback') renderFeedbackList();
    if (window.innerWidth <= 1024) document.getElementById('sidebar').classList.add('-translate-x-full');
}

// ============ DATA PERSISTENCE ============
function saveDataImmediately() { if (currentUser && appData) localStorage.setItem(`gp_data_${currentUser.email}`, JSON.stringify(appData)); }
function loadUserData() {
    const saved = localStorage.getItem('gp_current_user');
    if (!saved) return;
    currentUser = JSON.parse(saved);
    document.getElementById('userName').innerText = currentUser.name;
    document.getElementById('userAvatar').innerText = currentUser.name[0].toUpperCase();
    document.getElementById('welcomeName').innerHTML = ` ${currentUser.name.split(' ')[0]}! 👋`;
    const savedData = localStorage.getItem(`gp_data_${currentUser.email}`);
    appData = savedData ? { ...getDefaultData(), ...JSON.parse(savedData) } : getDefaultData();
    if (appData.isPremium) document.getElementById('userLevel').innerHTML = '⭐ Premium Member';
    updateDashboard(); renderRoadmap(); renderHabits(); renderScheduleUI(); renderNotes(); renderJournals();
    renderCurrentTwister(); updateTwisterStats(); renderTwisterList(); initAnalytics(); renderFeedbackList();
    // Check premium status with backend
    checkPremiumStatus();
}

// ============ DASHBOARD ============
function updateDashboard() {
    if (!appData) return;
    const today = getTodayKey();
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    if (appData.lastActiveDate !== today) {
        if (appData.lastActiveDate === yesterdayKey) appData.streak = (appData.streak || 0) + 1;
        else if (appData.lastActiveDate && appData.lastActiveDate !== today) appData.streak = 0;
        if (!appData.lastActiveDate) appData.streak = 1;
        appData.lastActiveDate = today;
        saveDataImmediately();
    }
    document.getElementById('streakValue').innerText = appData.streak || 0;
    document.getElementById('studyHours').innerText = ((appData.studyMinutes?.[today] || 0) / 60).toFixed(1);
    document.getElementById('tasksCompleted').innerText = (appData.schedule || []).filter(s => s.completed && s.date === today).length;
    let total = 0, done = 0;
    ROADMAP_DATA.forEach((m, i) => { m.topics.forEach((t, j) => { total++; if (appData.roadmapCompleted?.[i + '-' + j]) done++; }); });
    const pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById('overallProgress').innerText = pct + '%';
    document.getElementById('progressPercent').innerText = pct + '%';
    const circ = 2 * Math.PI * 50;
    const prog = document.getElementById('mainProgress');
    if (prog) prog.style.strokeDashoffset = circ - (pct / 100) * circ;
    let fsC = 0, fsT = 0, enC = 0, enT = 0, aiC = 0, aiT = 0;
    ROADMAP_DATA.forEach((m, i) => { m.topics.forEach((t, j) => { const key = i + '-' + j; const comp = appData.roadmapCompleted?.[key]; if (t.cat === 'fs') { fsT++; if (comp) fsC++; } if (t.cat === 'en') { enT++; if (comp) enC++; } if (t.cat === 'ai') { aiT++; if (comp) aiC++; } }); });
    document.getElementById('fullstackPercent').innerText = fsT ? Math.round((fsC / fsT) * 100) + '%' : '0%';
    document.getElementById('fullstackBar').style.width = fsT ? ((fsC / fsT) * 100) + '%' : '0%';
    document.getElementById('englishPercent').innerText = enT ? Math.round((enC / enT) * 100) + '%' : '0%';
    document.getElementById('englishBar').style.width = enT ? ((enC / enT) * 100) + '%' : '0%';
    document.getElementById('aiPercent').innerText = aiT ? Math.round((aiC / aiT) * 100) + '%' : '0%';
    document.getElementById('aiBar').style.width = aiT ? ((aiC / aiT) * 100) + '%' : '0%';
    renderScheduleUI();
    if (weeklyChartInst) weeklyChartInst.destroy();
    const ctx = document.getElementById('weeklyChart');
    if (ctx) weeklyChartInst = new Chart(ctx, { type: 'bar', data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Hours', data: [2, 3, 4, 3, 5, 4, 2], backgroundColor: '#6366f1' }] }, options: { responsive: true, maintainAspectRatio: false } });
}

function initAnalytics() {
    const dCtx = document.getElementById('distributionChart');
    if (dCtx) { if (distributionChart) distributionChart.destroy(); distributionChart = new Chart(dCtx, { type: 'doughnut', data: { labels: ['Coding', 'AI/ML', 'English', 'Study'], datasets: [{ data: [35, 25, 20, 20], backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#3b82f6'] }] } }); }
    const insights = document.getElementById('insightsContainer');
    if (insights) insights.innerHTML = '<div class="bg-indigo-50 p-4 rounded-lg">💡 Keep up the great work! Complete daily habits and roadmap topics to boost XP and unlock achievements.</div><div class="bg-purple-50 p-4 rounded-lg mt-2">🎯 Tip: Use the Focus Timer to track your study hours and earn XP!</div>';
}

// ============ SCHEDULE FUNCTIONS ============
function renderScheduleUI() {
    const today = getTodayKey(); const items = (appData.schedule || []).filter(s => s.date === today);
    const html = items.length ? items.map(i => `<div class="flex justify-between items-center p-2 border-b"><span class="font-mono">${i.start}</span><span>${escapeHtml(i.activity)}</span><div><button onclick="toggleTask('${i.id}')" class="text-green-600 mr-2">${i.completed ? '✅' : '⬜'}</button><button onclick="deleteTask('${i.id}')" class="text-red-500">🗑️</button></div></div>`).join('') : '<p class="text-gray-400 text-center">No tasks. Add a block!</p>';
    document.getElementById('todaySchedule').innerHTML = html; document.getElementById('fullSchedule').innerHTML = html;
    document.getElementById('studyBlocks').innerText = items.length; document.getElementById('totalPlanned').innerText = items.length + 'h';
}
function toggleTask(id) { const task = appData.schedule.find(s => s.id === id); if (task) { task.completed = !task.completed; saveDataImmediately(); renderScheduleUI(); updateDashboard(); showToast(task.completed ? '✅ Task done!' : 'Task reopened'); } }
function deleteTask(id) { appData.schedule = appData.schedule.filter(s => s.id !== id); saveDataImmediately(); renderScheduleUI(); updateDashboard(); showToast('Deleted'); }
function addScheduleBlock() { const start = document.getElementById('scheduleStart').value, end = document.getElementById('scheduleEnd').value, act = document.getElementById('scheduleActivity').value.trim(); if (!start || !end || !act) { showToast('Fill all fields', 'error'); return; } appData.schedule.push({ id: Date.now().toString(), date: getTodayKey(), start, end, activity: act, completed: false }); saveDataImmediately(); closeModal('scheduleModal'); renderScheduleUI(); updateDashboard(); showToast('Block added!'); }
function openAddScheduleModal() { openModal('scheduleModal'); }
function applyTemplate(type) { const today = getTodayKey(); const templates = { developer: [{ start: '09:00', end: '11:00', activity: 'Frontend' }, { start: '13:00', end: '15:00', activity: 'Backend' }], student: [{ start: '10:00', end: '12:00', activity: 'Study' }, { start: '14:00', end: '16:00', activity: 'Practice' }], balanced: [{ start: '08:00', end: '09:00', activity: 'Exercise' }, { start: '10:00', end: '12:00', activity: 'Deep Work' }, { start: '14:00', end: '16:00', activity: 'Learning' }] }; const blocks = templates[type].map(t => ({ id: Date.now() + Math.random(), date: today, ...t, completed: false })); appData.schedule = [...(appData.schedule || []).filter(s => s.date !== today), ...blocks]; saveDataImmediately(); renderScheduleUI(); updateDashboard(); showToast(`${type} template applied!`); }

// ============ ROADMAP ============
function renderRoadmap() { const container = document.getElementById('roadmapContainer'); if (!container) return; container.innerHTML = ROADMAP_DATA.map((m, mi) => `<div class="bg-indigo-50 rounded-xl overflow-hidden"><div class="p-3 bg-gradient-to-r from-indigo-200 to-purple-200 font-bold">${m.month}</div><div class="p-2 space-y-1 max-h-80 overflow-y-auto">${m.topics.map((t, ti) => { const key = mi + '-' + ti; const done = appData.roadmapCompleted?.[key]; return `<div class="flex items-center gap-2 p-2 cursor-pointer hover:bg-indigo-100 rounded" onclick="toggleRoadmapTopic('${key}')"><div class="w-5 h-5 rounded-full border flex items-center justify-center ${done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400'}">${done ? '✓' : ''}</div><span class="text-sm">${t.name}</span><span class="text-xs text-gray-400 ml-auto">${t.duration}</span></div>`; }).join('')}</div></div>`).join(''); }
function toggleRoadmapTopic(key) { if (!appData.roadmapCompleted) appData.roadmapCompleted = {}; appData.roadmapCompleted[key] = !appData.roadmapCompleted[key]; saveDataImmediately(); renderRoadmap(); updateDashboard(); showToast(appData.roadmapCompleted[key] ? '🎉 Topic mastered! +50 XP' : 'Topic unmarked'); }
function resetRoadmap() { if (confirm('Reset all progress?')) { appData.roadmapCompleted = {}; saveDataImmediately(); renderRoadmap(); updateDashboard(); showToast('Roadmap reset'); } }

// ============ HABITS ============
function renderHabits() { const container = document.getElementById('habitTrackerContainer'); if (!container) return; let html = '<div class="overflow-x-auto"><table class="min-w-[800px] w-full"><thead><tr><th>Habit</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr></thead><tbody>'; appData.habits.forEach(h => { html += `<tr class="border-b"><td class="py-2">${h.icon} ${h.name}</td>`; for (let i = 0; i < 7; i++) { let d = new Date(); d.setDate(d.getDate() - d.getDay() + 1 + i); const key = d.toISOString().split('T')[0]; const done = h.completed?.includes(key); html += `<td class="text-center"><div class="inline-block w-8 h-8 rounded-full cursor-pointer ${done ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-indigo-100'} flex items-center justify-center" onclick="toggleHabitDay(${h.id},'${key}')">${done ? '✓' : ''}</div></td>`; } html += `</td>`; }); html += '</tbody></table></div>'; container.innerHTML = html; updateAchievements(); }
function toggleHabitDay(id, date) { const habit = appData.habits.find(h => h.id == id); if (habit) { if (!habit.completed) habit.completed = []; const idx = habit.completed.indexOf(date); idx >= 0 ? habit.completed.splice(idx, 1) : habit.completed.push(date); saveDataImmediately(); renderHabits(); updateDashboard(); showToast(idx >= 0 ? `Unmarked ${habit.name}` : `✅ ${habit.name} done! +10 XP`); } }
function addHabit() { const name = document.getElementById('habitName').value.trim(); const icon = document.getElementById('habitIcon').value.trim() || '📌'; if (!name) { showToast('Enter habit name', 'error'); return; } appData.habits.push({ id: Date.now(), name, icon, completed: [] }); saveDataImmediately(); closeModal('habitModal'); renderHabits(); showToast(`Habit "${name}" added!`); }
function openAddHabitModal() { openModal('habitModal'); }
function updateAchievements() { const c = document.getElementById('achievementsContainer'); if (c) c.innerHTML = `<div class="p-3 bg-indigo-50 rounded-xl">🏆 Completed ${appData.habits.filter(h => h.completed?.length > 0).length} habits this week! 🔥 Streak: ${appData.streak} days</div>`; }

// ============ NOTES & JOURNAL ============
function renderNotes() { const container = document.getElementById('notesContainer'); if (!container) return; if (!appData.notes?.length) { container.innerHTML = '<div class="text-center text-gray-400 col-span-2">No notes yet</div>'; return; } container.innerHTML = appData.notes.map(n => `<div class="bg-white p-3 rounded-xl border shadow-sm"><div class="flex justify-between"><h3 class="font-bold text-sm">${escapeHtml(n.title)}</h3><button onclick="deleteNote('${n.id}')" class="text-red-500 text-xs">🗑️</button></div><p class="text-xs text-gray-600 mt-1">${escapeHtml(n.content).substring(0, 80)}</p><div class="text-gray-400 text-xs mt-1">${new Date(n.date).toLocaleDateString()}</div></div>`).join(''); }
function openAddNoteModal() { const title = prompt('Title:'); if (!title) return; const content = prompt('Content:'); if (!content) return; appData.notes = appData.notes || []; appData.notes.unshift({ id: Date.now().toString(), title, content, date: new Date().toISOString() }); saveDataImmediately(); renderNotes(); showToast('Note saved'); }
function deleteNote(id) { if (confirm('Delete?')) { appData.notes = appData.notes.filter(n => n.id !== id); saveDataImmediately(); renderNotes(); showToast('Deleted'); } }
function selectMood(mood) { selectedMood = mood; showToast(`Mood selected: ${mood}`); }
function saveJournal() { const text = document.getElementById('journalInput').value.trim(); if (!text) { showToast('Write something', 'error'); return; } appData.journals = appData.journals || []; appData.journals.unshift({ id: Date.now().toString(), text, mood: selectedMood, date: new Date().toISOString() }); saveDataImmediately(); document.getElementById('journalInput').value = ''; renderJournals(); showToast('Journal saved!'); }
function renderJournals() { const container = document.getElementById('journalHistory'); if (!container) return; if (!appData.journals?.length) { container.innerHTML = '<div class="text-center text-gray-400">No journal entries yet</div>'; return; } container.innerHTML = appData.journals.slice(0, 10).map(j => `<div class="bg-white p-2 rounded-lg border"><div class="flex justify-between"><span>${j.mood} ${escapeHtml(j.text.substring(0, 60))}</span><span class="text-xs text-gray-400">${new Date(j.date).toLocaleDateString()}</span></div></div>`).join(''); }

// ============ READING PASSAGES ============
function newReadingPassage() { currentPassageIdx = (currentPassageIdx + 1) % READING_PASSAGES.length; const p = READING_PASSAGES[currentPassageIdx]; document.getElementById('readingPassage').innerText = p.text; document.getElementById('currentLevel').innerText = p.level; }
function speakText() { const text = document.getElementById('readingPassage').innerText; const utterance = new SpeechSynthesisUtterance(text); window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); }
function recordReadingSpeed() { const sec = parseInt(document.getElementById('readTimeInput').value); if (!sec) { showToast('Enter seconds', 'error'); return; } const passage = READING_PASSAGES[currentPassageIdx]; const wpm = Math.round((passage.words / sec) * 60); document.getElementById('wpmDisplay').innerText = wpm; showToast(`${wpm} WPM! ${wpm >= 150 ? 'Excellent!' : wpm >= 100 ? 'Great!' : 'Keep practicing!'}`); }

// ============ TONGUE TWISTERS ============
function renderCurrentTwister() { const t = TONGUE_TWISTERS[currentTwisterIdx]; document.getElementById('twisterText').innerText = t.text; document.getElementById('twisterDifficulty').innerText = t.difficulty.toUpperCase(); }
function nextTwister() { currentTwisterIdx = (currentTwisterIdx + 1) % TONGUE_TWISTERS.length; renderCurrentTwister(); }
function speakTwister() { const u = new SpeechSynthesisUtterance(TONGUE_TWISTERS[currentTwisterIdx].text); window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }
function markTwisterComplete() { const tw = TONGUE_TWISTERS[currentTwisterIdx]; if (!appData.twisters) appData.twisters = { streak: 0, easy: [], medium: [], hard: [] }; let arr = appData.twisters[tw.difficulty + 's']; if (!arr.includes(tw.text)) { arr.push(tw.text); appData.twisters.streak++; saveDataImmediately(); updateTwisterStats(); renderTwisterList(); showToast(`🎉 Mastered "${tw.text.substring(0, 30)}..."! +50 XP`); nextTwister(); } else { showToast('Already mastered this twister!'); } }
function updateTwisterStats() { const total = appData.twisters.easy.length + appData.twisters.medium.length + appData.twisters.hard.length; document.getElementById('masteredCount').innerText = total; document.getElementById('bestTwisterStreak').innerText = appData.twisters.streak; document.getElementById('totalTwisterAttempts').innerText = total; document.getElementById('masteryBar').style.width = (total / TONGUE_TWISTERS.length) * 100 + '%'; }
function renderTwisterList() { const container = document.getElementById('twisterList'); if (!container) return; container.innerHTML = TONGUE_TWISTERS.map((t, i) => { const done = appData.twisters?.[t.difficulty + 's']?.includes(t.text); return `<div class="flex justify-between p-2 border rounded cursor-pointer hover:bg-indigo-50" onclick="currentTwisterIdx=${i};renderCurrentTwister();"><span class="text-sm">${done ? '✅' : '⬜'} ${t.text.substring(0, 35)}</span><span class="text-xs px-2 rounded-full ${t.difficulty === 'easy' ? 'bg-green-100' : t.difficulty === 'medium' ? 'bg-yellow-100' : 'bg-red-100'}">${t.difficulty}</span></div>`; }).join(''); }

// ============ TIMER ============
function setTimer(m) { clearInterval(timerInterval); timerRunning = false; timerSeconds = m * 60; document.getElementById('timerDisplay').innerText = formatTime(timerSeconds); document.getElementById('timerStartBtn').innerHTML = '▶ Start'; }
function formatTime(s) { const m = Math.floor(s / 60); const sec = s % 60; return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`; }
function toggleTimer() { const btn = document.getElementById('timerStartBtn'); if (timerRunning) { clearInterval(timerInterval); timerRunning = false; btn.innerHTML = '▶ Resume'; } else { timerRunning = true; btn.innerHTML = '⏸ Pause'; timerInterval = setInterval(() => { if (timerSeconds <= 0) { clearInterval(timerInterval); timerRunning = false; showToast('🎉 Timer done! Great work! +25 XP'); const today = getTodayKey(); appData.studyMinutes[today] = (appData.studyMinutes[today] || 0) + 25; saveDataImmediately(); updateDashboard(); timerSeconds = 25 * 60; document.getElementById('timerDisplay').innerText = formatTime(timerSeconds); btn.innerHTML = '▶ Start'; } else { timerSeconds--; document.getElementById('timerDisplay').innerText = formatTime(timerSeconds); } }, 1000); } }
function resetTimer() { clearInterval(timerInterval); timerRunning = false; timerSeconds = 25 * 60; document.getElementById('timerDisplay').innerText = formatTime(timerSeconds); document.getElementById('timerStartBtn').innerHTML = '▶ Start'; showToast('Timer reset to 25 minutes'); }

// ============ RAZORPAY PAYMENT INTEGRATION ============
async function initiateMonthlyPayment() {
    if (!currentUser) {
        showToast('Please login first', 'error');
        return;
    }
    
    showToast('Creating payment order...', 'info');
    
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            showToast('Please login again', 'error');
            return;
        }
        
        const response = await fetch(`${BACKEND_URL}/api/create-order/monthly`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to create order');
        }
        
        const options = {
            key: data.key_id,
            amount: data.amount,
            currency: data.currency,
            name: 'GrowthPilot',
            description: 'Monthly Premium Plan - ₹99',
            image: 'https://growthpiolt-a24j.vercel.app/logo.png',
            order_id: data.order_id,
            prefill: {
                name: currentUser.name,
                email: currentUser.email,
                contact: ''
            },
            notes: {
                planType: 'monthly'
            },
            theme: {
                color: '#4f46e5'
            },
            modal: {
                ondismiss: function() {
                    showToast('Payment cancelled', 'info');
                }
            },
            handler: function(response) {
                verifyPayment(
                    response.razorpay_payment_id,
                    response.razorpay_order_id,
                    response.razorpay_signature,
                    'monthly'
                );
            }
        };
        
        const rzp = new Razorpay(options);
        rzp.open();
        
    } catch (error) {
        console.error('Payment error:', error);
        showToast(error.message || 'Payment failed. Please try again.', 'error');
    }
}

async function initiateYearlyPayment() {
    if (!currentUser) {
        showToast('Please login first', 'error');
        return;
    }
    
    showToast('Creating payment order...', 'info');
    
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            showToast('Please login again', 'error');
            return;
        }
        
        const response = await fetch(`${BACKEND_URL}/api/create-order/yearly`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to create order');
        }
        
        const options = {
            key: data.key_id,
            amount: data.amount,
            currency: data.currency,
            name: 'GrowthPilot',
            description: 'Yearly Premium Plan - ₹999 (Save 16%)',
            image: 'https://growthpiolt-a24j.vercel.app/logo.png',
            order_id: data.order_id,
            prefill: {
                name: currentUser.name,
                email: currentUser.email,
                contact: ''
            },
            notes: {
                planType: 'yearly'
            },
            theme: {
                color: '#4f46e5'
            },
            modal: {
                ondismiss: function() {
                    showToast('Payment cancelled', 'info');
                }
            },
            handler: function(response) {
                verifyPayment(
                    response.razorpay_payment_id,
                    response.razorpay_order_id,
                    response.razorpay_signature,
                    'yearly'
                );
            }
        };
        
        const rzp = new Razorpay(options);
        rzp.open();
        
    } catch (error) {
        console.error('Payment error:', error);
        showToast(error.message || 'Payment failed. Please try again.', 'error');
    }
}

async function verifyPayment(paymentId, orderId, signature, planType) {
    showToast('Verifying payment...', 'info');
    
    try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${BACKEND_URL}/api/verify-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                razorpay_payment_id: paymentId,
                razorpay_order_id: orderId,
                razorpay_signature: signature,
                planType: planType
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            if (appData) {
                appData.isPremium = true;
                appData.premiumPlan = planType;
                appData.premiumExpiry = data.premiumExpiry;
                appData.premiumPaymentId = paymentId;
                saveDataImmediately();
            }
            
            document.getElementById('userLevel').innerHTML = '⭐ Premium Member';
            
            const planName = planType === 'monthly' ? 'Monthly' : 'Yearly';
            showToast(`🎉 Payment successful! ${planName} Premium activated!`, 'success');
            
            setTimeout(() => location.reload(), 2000);
        } else {
            showToast('Payment verification failed. Please contact support.', 'error');
        }
    } catch (error) {
        console.error('Verification error:', error);
        showToast('Verification error. Please contact support.', 'error');
    }
}

async function checkPremiumStatus() {
    const token = localStorage.getItem('authToken');
    if (!token || !currentUser) return false;
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/premium/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success && data.premium.isActive) {
            if (appData) {
                appData.isPremium = true;
                appData.premiumPlan = data.premium.plan;
                appData.premiumExpiry = data.premium.expiry;
                saveDataImmediately();
            }
            document.getElementById('userLevel').innerHTML = '⭐ Premium Member';
            return true;
        }
        return false;
    } catch (error) {
        console.error('Premium check error:', error);
        return false;
    }
}

// ============ FEEDBACK & SUPPORT ============
function sendFeedback() { const text = document.getElementById('feedbackInput').value.trim(); const name = document.getElementById('feedbackName').value.trim(); const email = document.getElementById('feedbackEmail').value.trim(); if (!text) { showToast('Please enter feedback', 'error'); return; } appData.feedbacks = appData.feedbacks || []; appData.feedbacks.unshift({ id: Date.now().toString(), text, name: name || 'Anonymous', email: email || 'Not provided', date: new Date().toISOString() }); saveDataImmediately(); renderFeedbackList(); document.getElementById('feedbackInput').value = ''; document.getElementById('feedbackName').value = ''; document.getElementById('feedbackEmail').value = ''; showToast('Thank you for your feedback! 🙏'); }
function renderFeedbackList() { const container = document.getElementById('feedbackList'); if (!container) return; if (!appData.feedbacks?.length) { container.innerHTML = '<div class="text-center text-gray-400 py-4">No feedback yet. Be the first to share!</div>'; return; } container.innerHTML = appData.feedbacks.slice(0, 5).map(f => `<div class="bg-gray-50 p-2 rounded-lg"><div class="flex justify-between"><span class="font-semibold text-sm">${escapeHtml(f.name)}</span><span class="text-xs text-gray-400">${new Date(f.date).toLocaleDateString()}</span></div><p class="text-sm text-gray-600">${escapeHtml(f.text)}</p></div>`).join(''); }

// ============ CHATBOT ============
function toggleChat() { document.getElementById('chatWindow').classList.toggle('hidden'); }
function sendChatMessage() { const inp = document.getElementById('chatInput'); const msg = inp.value.trim().toLowerCase(); if (!msg) return; const chatDiv = document.getElementById('chatMessages'); chatDiv.innerHTML += `<div class="flex justify-end"><div class="bg-indigo-600 text-white rounded-lg p-2 text-sm max-w-[80%]">${escapeHtml(inp.value)}</div></div>`; let response = CHAT_RESPONSES.default; for (const [key, value] of Object.entries(CHAT_RESPONSES)) { if (msg.includes(key)) { response = value; break; } } setTimeout(() => { chatDiv.innerHTML += `<div class="flex justify-start"><div class="bg-gray-200 rounded-lg p-2 text-sm max-w-[80%]">🤖 ${response}</div></div>`; chatDiv.scrollTop = chatDiv.scrollHeight; }, 300); inp.value = ''; chatDiv.scrollTop = chatDiv.scrollHeight; }

// ============ AUTHENTICATION ============
function showLoginForm() { document.getElementById('loginFormContainer').style.display = 'block'; document.getElementById('signupFormContainer').style.display = 'none'; }
function showSignupForm() { document.getElementById('loginFormContainer').style.display = 'none'; document.getElementById('signupFormContainer').style.display = 'block'; }

function handleSignup() { 
    const name = document.getElementById('signupName').value.trim(), 
          email = document.getElementById('signupEmail').value.trim(), 
          pass = document.getElementById('signupPassword').value; 
    if (!name || !email || !pass) { showToast('Fill all fields', 'error'); return; } 
    if (pass.length < 6) { showToast('Password must be 6+ chars', 'error'); return; } 
    
    // Call backend signup
    fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            currentUser = data.user;
            localStorage.setItem('gp_current_user', JSON.stringify(currentUser));
            showToast('Account created! 🎉');
            document.getElementById('authPage').style.display = 'none';
            document.getElementById('dashboardPage').style.display = 'block';
            document.getElementById('mainFooter').style.display = 'block';
            appData = getDefaultData();
            saveDataImmediately();
            loadUserData();
        } else {
            // Fallback to local storage
            let users = JSON.parse(localStorage.getItem('gp_users') || '{}');
            if (users[email]) { showToast('User exists', 'error'); return; }
            users[email] = { name, email, password: pass };
            localStorage.setItem('gp_users', JSON.stringify(users));
            currentUser = { email, name };
            localStorage.setItem('gp_current_user', JSON.stringify(currentUser));
            showToast('Account created! 🎉');
            document.getElementById('authPage').style.display = 'none';
            document.getElementById('dashboardPage').style.display = 'block';
            document.getElementById('mainFooter').style.display = 'block';
            appData = getDefaultData();
            saveDataImmediately();
            loadUserData();
        }
    })
    .catch(() => {
        // Fallback to local storage
        let users = JSON.parse(localStorage.getItem('gp_users') || '{}');
        if (users[email]) { showToast('User exists', 'error'); return; }
        users[email] = { name, email, password: pass };
        localStorage.setItem('gp_users', JSON.stringify(users));
        currentUser = { email, name };
        localStorage.setItem('gp_current_user', JSON.stringify(currentUser));
        showToast('Account created! 🎉');
        document.getElementById('authPage').style.display = 'none';
        document.getElementById('dashboardPage').style.display = 'block';
        document.getElementById('mainFooter').style.display = 'block';
        appData = getDefaultData();
        saveDataImmediately();
        loadUserData();
    });
}

function handleLogin() { 
    const email = document.getElementById('loginEmail').value.trim(), 
          pass = document.getElementById('loginPassword').value; 
    
    fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            currentUser = data.user;
            localStorage.setItem('gp_current_user', JSON.stringify(currentUser));
            showToast(`Welcome back ${currentUser.name}!`);
            document.getElementById('authPage').style.display = 'none';
            document.getElementById('dashboardPage').style.display = 'block';
            document.getElementById('mainFooter').style.display = 'block';
            loadUserData();
        } else {
            // Fallback to local storage
            const users = JSON.parse(localStorage.getItem('gp_users') || '{}');
            const user = users[email];
            if (user && user.password === pass) {
                currentUser = { email, name: user.name };
                localStorage.setItem('gp_current_user', JSON.stringify(currentUser));
                showToast(`Welcome back ${user.name}!`);
                document.getElementById('authPage').style.display = 'none';
                document.getElementById('dashboardPage').style.display = 'block';
                document.getElementById('mainFooter').style.display = 'block';
                loadUserData();
            } else {
                showToast('Invalid credentials', 'error');
            }
        }
    })
    .catch(() => {
        const users = JSON.parse(localStorage.getItem('gp_users') || '{}');
        const user = users[email];
        if (user && user.password === pass) {
            currentUser = { email, name: user.name };
            localStorage.setItem('gp_current_user', JSON.stringify(currentUser));
            showToast(`Welcome back ${user.name}!`);
            document.getElementById('authPage').style.display = 'none';
            document.getElementById('dashboardPage').style.display = 'block';
            document.getElementById('mainFooter').style.display = 'block';
            loadUserData();
        } else {
            showToast('Invalid credentials', 'error');
        }
    });
}

function logout() { 
    if (confirm('Logout?')) { 
        localStorage.removeItem('gp_current_user');
        localStorage.removeItem('authToken');
        currentUser = null; 
        appData = null; 
        document.getElementById('authPage').style.display = 'flex'; 
        document.getElementById('dashboardPage').style.display = 'none'; 
        document.getElementById('mainFooter').style.display = 'none'; 
        showToast('Logged out'); 
    } 
}

function initializeGoogleSignIn() { 
    if (typeof google !== 'undefined' && google.accounts) { 
        google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleCredential }); 
        google.accounts.id.renderButton(document.getElementById('googleLoginBtn'), { theme: 'outline', size: 'large' }); 
        google.accounts.id.renderButton(document.getElementById('googleSignupBtn'), { theme: 'outline', size: 'large' }); 
    } else { setTimeout(initializeGoogleSignIn, 500); } 
}

function handleGoogleCredential(res) { 
    const payload = JSON.parse(atob(res.credential.split('.')[1])); 
    
    fetch(`${BACKEND_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: payload.name, email: payload.email, picture: payload.picture, googleId: payload.sub })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            currentUser = data.user;
            localStorage.setItem('gp_current_user', JSON.stringify(currentUser));
            showToast(`Welcome ${payload.name}!`);
            document.getElementById('authPage').style.display = 'none';
            document.getElementById('dashboardPage').style.display = 'block';
            document.getElementById('mainFooter').style.display = 'block';
            loadUserData();
        } else {
            // Fallback to local storage
            let users = JSON.parse(localStorage.getItem('gp_users') || '{}');
            if (!users[payload.email]) users[payload.email] = { name: payload.name, email: payload.email };
            localStorage.setItem('gp_users', JSON.stringify(users));
            currentUser = { email: payload.email, name: payload.name };
            localStorage.setItem('gp_current_user', JSON.stringify(currentUser));
            showToast(`Welcome ${payload.name}!`);
            document.getElementById('authPage').style.display = 'none';
            document.getElementById('dashboardPage').style.display = 'block';
            document.getElementById('mainFooter').style.display = 'block';
            loadUserData();
        }
    })
    .catch(() => {
        let users = JSON.parse(localStorage.getItem('gp_users') || '{}');
        if (!users[payload.email]) users[payload.email] = { name: payload.name, email: payload.email };
        localStorage.setItem('gp_users', JSON.stringify(users));
        currentUser = { email: payload.email, name: payload.name };
        localStorage.setItem('gp_current_user', JSON.stringify(currentUser));
        showToast(`Welcome ${payload.name}!`);
        document.getElementById('authPage').style.display = 'none';
        document.getElementById('dashboardPage').style.display = 'block';
        document.getElementById('mainFooter').style.display = 'block';
        loadUserData();
    });
}

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    initializeGoogleSignIn();
    const saved = localStorage.getItem('gp_current_user');
    if (saved) { 
        currentUser = JSON.parse(saved); 
        document.getElementById('authPage').style.display = 'none'; 
        document.getElementById('dashboardPage').style.display = 'block'; 
        document.getElementById('mainFooter').style.display = 'block'; 
        loadUserData(); 
    } else { 
        document.getElementById('authPage').style.display = 'flex'; 
        document.getElementById('dashboardPage').style.display = 'none'; 
        document.getElementById('mainFooter').style.display = 'none'; 
    }
    newReadingPassage(); 
    renderCurrentTwister();
    document.getElementById('userProfileBtn')?.addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('logoutDropdown').classList.toggle('hidden'); });
    document.addEventListener('click', (e) => { const btn = document.getElementById('userProfileBtn'); const drop = document.getElementById('logoutDropdown'); if (btn && drop && !btn.contains(e.target)) drop.classList.add('hidden'); });
    document.getElementById('chatToggle')?.addEventListener('click', toggleChat);
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
window.saveJournal = saveJournal; 
window.selectMood = selectMood; 
window.sendFeedback = sendFeedback;
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
window.initiateMonthlyPayment = initiateMonthlyPayment; 
window.initiateYearlyPayment = initiateYearlyPayment;