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

// Function to update dashboard displays
// Function to update dashboard displays
function updateDashboard() {
    const habits = JSON.parse(localStorage.getItem('habits')) || {};
    const calendarEvents = JSON.parse(localStorage.getItem('events')) || [];
    const habitsList = document.getElementById('habits-list');
    const statsContainer = document.getElementById('stats-container');
    
    // Update stats - now including both regular habits and calendar events
    const totalActivities = Object.values(habits).reduce((sum, habit) => sum + habit.count, 0);
    const uniqueHabits = Object.keys(habits).length;
    const calendarHabits = calendarEvents.reduce((sum, day) => sum + day.events.length, 0);
    
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
    `;
    
    // Update habits list - combining both regular habits and calendar events
    if (Object.keys(habits).length === 0 && calendarEvents.length === 0) {
        habitsList.innerHTML = `
            <div class="no-habits">
                <h3>No habits tracked yet</h3>
                <p>Go to the activities page or calendar to start tracking your habits!</p>
            </div>
        `;
        return;
    }
    
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
}

// Test function to verify JavaScript is working
function testFunction() {
    console.log("JavaScript is working!");
    showNotification("Test notification");
}