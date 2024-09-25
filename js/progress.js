// script.js

// Function to add habit
document.getElementById('add-habit-button').addEventListener('click', function() {
    const selectedHabit = document.getElementById('habit-selector').value;
    const customHabit = document.getElementById('custom-habit').value;
    const habitDate = document.getElementById('habit-date').value;

    // Ensure that a habit and a date are added
    if ((selectedHabit === "" && customHabit.trim() === "") || habitDate === "") {
        alert("Please select a habit or enter a custom habit, and select a date.");
        return;
    }

    // Create a habit object
    const habit = {
        habit: selectedHabit || customHabit,
        date: habitDate
    };

    // Use local storage to save habits
    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    habits.push(habit);
    localStorage.setItem('habits', JSON.stringify(habits));

    // Redirect to My Habit Progress page
    window.location.href = 'my-habits.html';
});

// Function to display habits in a calendar format on My Habit Progress page
window.onload = function() {
    const habits = JSON.parse(localStorage.getItem('habits')) || [];
    const calendar = document.getElementById('calendar');

    // Group habits by date
    const habitsByDate = habits.reduce((acc, habit) => {
        acc[habit.date] = acc[habit.date] || [];
        acc[habit.date].push(habit.habit);
        return acc;
    }, {});

    // Create a simple calendar for the current month
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        
        dayDiv.innerHTML = `<h4>${day}</h4>`;
        if (habitsByDate[dateString]) {
            const ul = document.createElement('ul');
            habitsByDate[dateString].forEach(habit => {
                const li = document.createElement('li');
                li.textContent = habit;
                ul.appendChild(li);
            });
            dayDiv.appendChild(ul);
        } else {
            dayDiv.innerHTML += '<p>No habits logged</p>';
        }

        calendar.appendChild(dayDiv);
    }
};
