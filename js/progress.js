const habitsUl = document.getElementById('habits-ul');
const newHabitInput = document.getElementById('new-habit');
const addHabitButton = document.getElementById('add-habit-button');
const addLibraryHabitButton = document.getElementById('add-library-habit');
const habitLibrarySelect = document.getElementById('habit-library');
const journalText = document.getElementById('journal-text');
const saveProgressButton = document.getElementById('save-progress');
const calendarDisplay = document.getElementById('calendar-display');
const ctx = document.getElementById('progressCanvas').getContext('2d');

let habits = []; // To store habits as objects
let journalEntries = {}; // To store journal entries by date

// Initialize the progress chart
const progressChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Completed', 'Pending'],
        datasets: [{
            label: 'Habit Progress',
            data: [0, 0], // Placeholder for data
            backgroundColor: ['#4caf50', '#f44336']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    }
});

// Function to update the chart based on checked habits
function updateChart() {
    const completedHabits = habits.filter(habit => habit.completed).length;
    progressChart.data.datasets[0].data = [completedHabits, habits.length - completedHabits];
    progressChart.update();
}

// Function to render the habit list
function renderHabits() {
    habitsUl.innerHTML = ''; // Clear the list
    habits.forEach((habit, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" id="habit-${index}" ${habit.completed ? 'checked' : ''} />
            <label for="habit-${index}">${habit.name}</label>
        `;
        habitsUl.appendChild(li);

        // Add event listener to update completion status
        li.querySelector('input[type="checkbox"]').addEventListener('change', () => {
            habit.completed = !habit.completed;
            updateChart();
        });
    });
}

// Add new habit from input
addHabitButton.addEventListener('click', () => {
    const newHabit = newHabitInput.value.trim();
    if (newHabit) {
        habits.push({ name: newHabit, completed: false });
        newHabitInput.value = ''; // Clear input field
        renderHabits();
        updateChart();
    }
});

// Add habit from library
addLibraryHabitButton.addEventListener('click', () => {
    const selectedHabit = habitLibrarySelect.value;
    if (selectedHabit && !habits.some(h => h.name === selectedHabit)) {
        habits.push({ name: selectedHabit, completed: false });
        habitLibrarySelect.value = ''; // Clear selection
        renderHabits();
        updateChart();
    }
});

// Save progress and journal entry
saveProgressButton.addEventListener('click', () => {
    const today = new Date().toLocaleDateString();
    
    // Save journal entry
    const journalEntry = journalText.value.trim();
    if (journalEntry) {
        journalEntries[today] = journalEntry;
        journalText.value = ''; // Clear journal text area
    }

    // Save habit progress
    const progressData = {
        date: today,
        habits: habits.map(habit => ({ name: habit.name, completed: habit.completed }))
    };

    // Store progress in localStorage
    localStorage.setItem(today, JSON.stringify(progressData));

    // Update calendar display
    displayCalendar();

    // Reset habit states for the next day
    habits.forEach(habit => habit.completed = false);
    renderHabits();
    updateChart();
});

// Display calendar with saved habit progress
function displayCalendar() {
    calendarDisplay.innerHTML = ''; // Clear previous entries
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toLocaleDateString();

        const entry = localStorage.getItem(dateString);
        const journalEntry = journalEntries[dateString] || '';
        
        const div = document.createElement('div');
        div.innerHTML = `<strong>${dateString}</strong>: ${entry ? JSON.parse(entry).habits.map(h => `${h.name}: ${h.completed ? '✔️' : '❌'}`).join(', ') : 'No progress recorded.'} <br> Journal: ${journalEntry}`;
        calendarDisplay.appendChild(div);
    }
}

// Initialize chart and calendar display on page load
updateChart();
displayCalendar();
