// js/mood-tracker.js

function initMoodTracker() {
    const moodItems = document.querySelectorAll(".mood-item");
    const moodHistoryList = document.getElementById("mood-history-list");
    const moodJournal = document.getElementById("mood-journal");
    const saveMoodButton = document.getElementById("save-mood");
    const dateInput = document.getElementById("mood-date");

    const savedMoods = JSON.parse(localStorage.getItem("moodHistory")) || [];
    updateMoodHistory(savedMoods);

    // Initialize FullCalendar
    const calendarEl = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        events: savedMoods.map((mood) => ({
            title: mood.mood,
            start: mood.date,
            color: getMoodColor(mood.mood),
        })),
        dateClick: function (info) {
            dateInput.value = info.dateStr;
            const dayMoods = savedMoods.filter(
                (mood) => mood.date === info.dateStr
            );
            if (dayMoods.length) {
                moodJournal.value = dayMoods[0].journal;
                document
                    .querySelector(`[data-mood="${dayMoods[0].mood}"]`)
                    .classList.add("selected");
            } else {
                moodJournal.value = "";
                document
                    .querySelectorAll(".mood-item")
                    .forEach((i) => i.classList.remove("selected"));
            }
        },
    });
    calendar.render();

    // Save Mood and Journal Entry
    saveMoodButton.addEventListener("click", function () {
        saveMoodEntry(savedMoods, dateInput, moodJournal, calendar);
    });

    // Handle Mood Item Click
    moodItems.forEach((item) => {
        item.addEventListener("click", function () {
            document
                .querySelectorAll(".mood-item")
                .forEach((i) => i.classList.remove("selected"));
            this.classList.add("selected");
        });
    });
}

function saveMoodEntry(savedMoods, dateInput, moodJournal, calendar) {
    const selectedDate = dateInput.value;
    const selectedMood = document.querySelector(".mood-item.selected");
    if (!selectedDate || !selectedMood) {
        alert("Please select a date and mood!");
        return;
    }

    const moodValue = selectedMood.getAttribute("data-mood");
    const journalEntry = moodJournal.value;
    const existingMoodIndex = savedMoods.findIndex(
        (mood) => mood.date === selectedDate
    );

    if (existingMoodIndex !== -1) {
        savedMoods[existingMoodIndex] = {
            mood: moodValue,
            journal: journalEntry,
            date: selectedDate,
        };
    } else {
        savedMoods.push({
            mood: moodValue,
            journal: journalEntry,
            date: selectedDate,
        });
    }

    localStorage.setItem("moodHistory", JSON.stringify(savedMoods));
    updateMoodHistory(savedMoods);

    calendar.addEvent({
        title: moodValue,
        start: selectedDate,
        color: getMoodColor(moodValue),
    });

    moodJournal.value = "";
    document.querySelector(".mood-item.selected").classList.remove("selected");
}

function updateMoodHistory(moods) {
    const moodHistoryList = document.getElementById("mood-history-list");
    moodHistoryList.innerHTML = "";
    moods.forEach((entry, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `${entry.date} - ${entry.mood} - Journal: ${
            entry.journal || ""
        } 
        <button class="edit-btn" onclick="editMood(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteMood(${index})">Delete</button>`;
        moodHistoryList.appendChild(listItem);
    });
}

function getMoodColor(mood) {
    const colors = {
        Happy: "green",
        Neutral: "yellow",
        Sad: "blue",
        Angry: "red",
        Excited: "orange",
    };
    return colors[mood] || "gray";
}

window.editMood = function (index) {
    const savedMoods = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const moodEntry = savedMoods[index];
    document.getElementById("mood-journal").value = moodEntry.journal;
    document.getElementById("mood-date").value = moodEntry.date;
    document
        .querySelector(`[data-mood="${moodEntry.mood}"]`)
        .classList.add("selected");
    deleteMood(index);
};

window.deleteMood = function (index) {
    const savedMoods = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const removedMood = savedMoods[index];
    savedMoods.splice(index, 1);
    localStorage.setItem("moodHistory", JSON.stringify(savedMoods));
    updateMoodHistory(savedMoods);
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initMoodTracker);