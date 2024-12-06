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
    
    // Save unique habits only
    const existingHabits = JSON.parse(localStorage.getItem('checkedCommonHabits')) || [];
    const combinedHabits = [...new Map([...existingHabits, ...checkedHabits].map(item => [item.name, item])).values()];
    
    localStorage.setItem('checkedCommonHabits', JSON.stringify(combinedHabits));
    console.log('Saved common habits:', combinedHabits); // Debug log
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
        const isChecked = checkedHabits.some(habit => habit.name === habitName);
        checkbox.checked = isChecked;
        console.log(`Checkbox ${habitName}: ${isChecked ? 'checked' : 'unchecked'}`); // Debug log
    });
}

// Function to create and display the modal with checked habits
function showCheckedHabitsModal() {
    const checkedHabits = JSON.parse(localStorage.getItem('checkedCommonHabits')) || [];
    
    // Create modal elements
    const modal = document.createElement('div');
    modal.classList.add('modal');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.innerHTML = '<h2>Checked Habits</h2><span class="close-modal">&times;</span>';
    
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    
    if (checkedHabits.length > 0) {
        const habitList = document.createElement('ul');
        checkedHabits.forEach(habit => {
            const listItem = document.createElement('li');
            listItem.textContent = `${habit.name} (Completed on: ${habit.completedDate})`;
            habitList.appendChild(listItem);
        });
        modalBody.appendChild(habitList);
    } else {
        modalBody.innerHTML = '<p>No habits completed yet.</p>';
    }
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal on click of close button
    modalHeader.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close modal on click outside of modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Add event listener to stat-box to show modal on click
document.addEventListener('DOMContentLoaded', () => {
    const statBox = document.querySelector('.stat-box');
    if (statBox) {
        statBox.addEventListener('click', showCheckedHabitsModal);
    }
});

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