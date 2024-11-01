// common-habits.js

// Function to save checked habits with completion dates
function saveCheckedHabits() {
    const checkboxes = document.querySelectorAll('.habit-item input[type="checkbox"]');
    const checkedHabits = [];
    const currentDate = new Date().toISOString().split('T')[0];
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkedHabits.push({
                name: checkbox.parentElement.textContent.trim(),
                completedDate: currentDate
            });
        }
    });
    
    localStorage.setItem('checkedCommonHabits', JSON.stringify(checkedHabits));
    console.log('Saved common habits:', checkedHabits); // Debug log
}

// Add event listeners to checkboxes
function addCheckboxListeners() {
    const checkboxes = document.querySelectorAll('.habit-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', saveCheckedHabits);
    });
}

// Load checked habits and add listeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCheckedHabits();
    addCheckboxListeners();
});

// Load checked habits when the page loads
function loadCheckedHabits() {
    const checkedHabits = JSON.parse(localStorage.getItem('checkedCommonHabits')) || [];
    console.log('Loaded common habits:', checkedHabits); // Debug log
    
    const checkboxes = document.querySelectorAll('.habit-item input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        const habitName = checkbox.parentElement.textContent.trim();
        const isChecked = checkedHabits.includes(habitName);
        checkbox.checked = isChecked;
        console.log(`Checkbox ${habitName}: ${isChecked ? 'checked' : 'unchecked'}`); // Debug log
    });
}

// Event listener for checkbox changes
document.addEventListener('change', function(e) {
    if (e.target.matches('.habit-item input[type="checkbox"]')) {
        console.log('Checkbox changed'); // Add this line
        saveCheckedHabits();
    }
});

// Load checked habits when the page loads
document.addEventListener('DOMContentLoaded', loadCheckedHabits);

// Function to display habit count on dashboard
function displayHabitCount() {
    const checkedHabits = JSON.parse(localStorage.getItem('checkedCommonHabits')) || [];
    const statsContainer = document.getElementById('common-habits-stats');
    
    console.log('Displaying habit count:', checkedHabits.length); // Debug log
    
    if (!statsContainer) {
        console.error('Common habits stats container not found');
        return;
    }
    
    statsContainer.innerHTML = `
        <div class="stat-box">
            <h3>Common Habits Completed</h3>
            <p>${checkedHabits.length}</p>
        </div>
    `;
}

// Function to reset habits
function resetHabits() {
    localStorage.removeItem('checkedCommonHabits');
    location.reload();
}

// Call these functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCheckedHabits();
    addCheckboxListeners();
});
// If on dashboard page, display habit count
if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', displayHabitCount);
}