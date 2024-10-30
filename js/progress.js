// Function to add or update a habit
// In progress.js

let selectedHabit = '';

function addHabit(habitName) {
    selectedHabit = habitName;
    document.getElementById('selected-habit').textContent = `Selected Habit: ${habitName}`;
    document.getElementById('habit-modal').style.display = 'block';
    
    // Set default date and time
    const now = new Date();
    document.getElementById('habit-date').value = now.toISOString().split('T')[0];
    document.getElementById('habit-time').value = now.toTimeString().slice(0,5);
}

function confirmAddHabit() {
    const habitDate = document.getElementById('habit-date').value;
    const habitTime = document.getElementById('habit-time').value;
    
    if (!habitDate || !habitTime) {
        showNotification('Please select both date and time');
        return;
    }

    const selectedDateTime = new Date(`${habitDate}T${habitTime}`);
    
    // Get existing habits from localStorage
    let habits = JSON.parse(localStorage.getItem('habits')) || {};
    
    // Initialize or update the habit
    if (habits[selectedHabit]) {
        habits[selectedHabit].count += 1;
        habits[selectedHabit].lastUpdated = selectedDateTime.toISOString();
        habits[selectedHabit].dateTimes.push(selectedDateTime.toISOString());
    } else {
        habits[selectedHabit] = {
            count: 1,
            firstAdded: selectedDateTime.toISOString(),
            lastUpdated: selectedDateTime.toISOString(),
            dateTimes: [selectedDateTime.toISOString()]
        };
    }
    
    // Save back to localStorage
    localStorage.setItem('habits', JSON.stringify(habits));
    
    // Show feedback to user
    showNotification(`Added ${selectedHabit} to your habits!`);
    
    // Close the modal
    closeModal();
}

function closeModal() {
    document.getElementById('habit-modal').style.display = 'none';
}

// Function to display notification
function showNotification(message) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create and show new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Function to reset all habits (for dashboard)
function resetHabits() {
    if (confirm('Are you sure you want to reset all habit tracking data?')) {
        localStorage.removeItem('habits');
        updateDashboard();
    }
}
function getMoodStats() {
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const moodCounts = moodHistory.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
    }, {});
    
    return {
        totalEntries: moodHistory.length,
        moodCounts: moodCounts,
        mostFrequentMood: Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
    };
}
// Function to update dashboard displays
// Function to update dashboard displays
// Function to update dashboard displays
function updateDashboard() {
    const habits = JSON.parse(localStorage.getItem('habits')) || {};
    const calendarEvents = JSON.parse(localStorage.getItem('events')) || [];
    const habitsList = document.getElementById('habits-list');
    const statsContainer = document.getElementById('stats-container');
    const moodStats = getMoodStats();
    
    // Update stats
    const totalActivities = Object.values(habits).reduce((sum, habit) => sum + habit.count, 0);
    const uniqueHabits = Object.keys(habits).length;
    const calendarHabits = calendarEvents.reduce((sum, day) => sum + day.events.length, 0);
    
    // Update stats container
    statsContainer.innerHTML = `
        <div class="stat-box">
            <h3>Total Activities</h3>
            <p>${totalActivities + calendarHabits}</p>
        </div>
        <div class="stat-box">
            <h3>Unique Habits</h3>
            <p>${uniqueHabits}</p>
        </div>
        <div class="stat-box">
            <h3>Scheduled Habits</h3>
            <p>${calendarHabits}</p>
        </div>
        <div class="stat-box mood-stats">
            <h3>Mood Tracking</h3>
            <p>${moodStats.totalEntries}</p>
            <small>Total mood entries</small>
            <p class="most-frequent">Most frequent: ${moodStats.mostFrequentMood}</p>
        </div>
    `;
    
    // Update habits list
    if (Object.keys(habits).length === 0 && calendarEvents.length === 0) {
        habitsList.innerHTML = `
            <div class="no-habits">
                <h3>No habits tracked yet</h3>
                <p>Go to the activities page or calendar to start tracking your habits!</p>
            </div>
        `;
    } else {
        habitsList.innerHTML = '';
        
        // Add regular habits
        const sortedHabits = Object.entries(habits)
            .sort(([,a], [,b]) => b.count - a.count);
        
        for (const [habit, data] of sortedHabits) {
            const habitElement = document.createElement('div');
            habitElement.className = 'habit-item';
            habitElement.innerHTML = `
                <h3>${habit}</h3>
                <p>Times practiced: ${data.count}</p>
                <p>First added: ${new Date(data.firstAdded).toLocaleDateString()}</p>
                <p>Last practiced: ${new Date(data.lastUpdated).toLocaleDateString()}</p>
            `;
            habitsList.appendChild(habitElement);
        }
        
        // Add calendar events
        calendarEvents.forEach(dayEvent => {
            dayEvent.events.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'habit-item calendar-event';
                eventElement.innerHTML = `
                    <h3>${event.title}</h3>
                    <p>Scheduled Time: ${event.time}</p>
                    <p>Date: ${dayEvent.month}/${dayEvent.day}/${dayEvent.year}</p>
                `;
                habitsList.appendChild(eventElement);
            });
        });

        // Add mood history
        const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
        if (moodHistory.length > 0) {
            const moodSection = document.createElement('div');
            moodSection.className = 'mood-section';
            moodSection.innerHTML = `
                <h2>Recent Mood Entries</h2>
                <div class="mood-entries">
                    ${moodHistory.slice(-5).reverse().map(entry => `
                        <div class="habit-item mood-entry">
                            <h3>${entry.date}</h3>
                            <p>Mood: ${entry.mood}</p>
                            <p>Journal: ${entry.journal || 'No entry'}</p>
                        </div>
                    `).join('')}
                </div>
            `;
            habitsList.appendChild(moodSection);
        }
    }

    // Create calendar if the element exists
    const calendarElement = document.getElementById('calendar');
    if (calendarElement) {
        createCalendar();
    }
}

function createCalendar() {
    const calendar = document.getElementById('calendar');
    if (!calendar) {
        console.log('Calendar element not found');
        return;
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    calendar.innerHTML = '';

    // Display month and year
    const monthYearDisplay = document.createElement('div');
    monthYearDisplay.className = 'month-year';
    monthYearDisplay.innerHTML = `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`;
    calendar.appendChild(monthYearDisplay);

    // Create header for days of the week
    const headers = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    headers.forEach(header => {
        const headerCell = document.createElement('div');
        headerCell.className = 'header';
        headerCell.innerText = header;
        calendar.appendChild(headerCell);
    });

    // Create empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'day empty';
        calendar.appendChild(emptyCell);
    }

    const habits = JSON.parse(localStorage.getItem('habits')) || {};
    const calendarEvents = JSON.parse(localStorage.getItem('events')) || [];
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];

    // Create calendar days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'day';
        
        // Highlight today's date
        if (day === today.getDate() && currentMonth === today.getMonth()) {
            dayCell.classList.add('today');
        }

        const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        // Get habits for this day
        const habitsForDay = getHabitsForDay(habits, dateString);
        
        // Get events for this day
        const eventsForDay = calendarEvents.filter(event => 
            event.year === currentYear && 
            event.month === currentMonth + 1 && 
            event.day === day
        ).flatMap(event => event.events);
        
        // Get mood for this day
        const moodForDay = moodHistory.find(mood => mood.date === dateString);

        // Populate day cell with data
        dayCell.innerHTML = `
            <span class="day-number">${day}</span>
            <div class="entry-list">
                ${habitsForDay.map(habit => `<div class="entry-item habit">${habit}</div>`).join('')}
                ${eventsForDay.map(event => `<div class="entry-item event">${event.title}</div>`).join('')}
                ${moodForDay ? `<div class="entry-item mood">${getMoodEmoji(moodForDay.mood)}</div>` : ''}
            </div>
        `;

        // Add click event to show details for the selected day
        dayCell.onclick = () => showDayDetails(day, currentMonth, currentYear);
        
        calendar.appendChild(dayCell);
    }
}

// Helper function to get habits for a specific day
function getHabitsForDay(habits, dateString) {
    return Object.entries(habits)
        .filter(([_, habitData]) => 
            habitData.dateTimes.some(dateTime => dateTime.startsWith(dateString))
        )
        .map(([habitName, _]) => habitName);
}

// Function to get emoji based on mood
function getMoodEmoji(mood) {
    const moodEmojis = {
        'Happy': '😊',
        'Sad': '😢',
        'Angry': '😠',
        'Excited': '😃',
        'Neutral': '😐',
        // Add more moods and emojis as needed
    };
    return moodEmojis[mood] || mood;
}

// Function to display details for the selected day
function showDayDetails(day, month, year) {
    const habits = JSON.parse(localStorage.getItem('habits')) || {};
    const calendarEvents = JSON.parse(localStorage.getItem('events')) || [];
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];

    const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    // Get habits for this day
    const habitsForDay = getHabitsForDay(habits, dateString);
    
    // Get events for this day
    const eventsForDay = calendarEvents.filter(event => 
        event.year === year && 
        event.month === month + 1 && 
        event.day === day
    ).flatMap(event => event.events);
    
    // Get mood for this day
    const moodForDay = moodHistory.find(mood => mood.date === dateString);

    // Display details in a modal or a separate section
    // For this example, we'll just log the details to the console
    console.log(`Day: ${day} ${new Date(year, month, day).toLocaleString('default', { month: 'long' })} ${year}`);
    console.log(`Habits: ${habitsForDay.join(', ')}`);
    console.log(`Events: ${eventsForDay.join(', ')}`);
    console.log(`Mood: ${moodForDay ? moodForDay.mood : 'None'}`);
}
// Test function to verify JavaScript is working
function testFunction() {
    console.log("JavaScript is working!");
    showNotification("Test notification");
}