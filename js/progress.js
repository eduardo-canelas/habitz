// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQsFjMkH4TR5vI74NH57PHicbl2GxtyYE",
  authDomain: "habitz-c2226.firebaseapp.com",
  databaseURL: "https://habitz-c2226-default-rtdb.firebaseio.com",
  projectId: "habitz-c2226",
  storageBucket: "habitz-c2226.appspot.com",
  messagingSenderId: "1367064140",
  appId: "1:1367064140:web:21512c177abc7e3523fee9",
  measurementId: "G-FFDHF8QTNN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    loadHabits('common-habits.html', 'common-habits');
    loadHabits('activities.html', 'activities');
    loadCustomHabits();
});

function loadHabits(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            addClickListeners(elementId);
        })
        .catch(error => console.error('Error loading habits:', error));
}

function addClickListeners(elementId) {
    const items = document.querySelectorAll(`#${elementId} li`);
    items.forEach(item => {
        item.addEventListener('click', () => {
            addHabitToList(item.textContent);
        });
    });
}

function addHabitToList(habit) {
    const habitList = document.getElementById('habit-list');
    const newHabit = document.createElement('li');
    newHabit.textContent = habit;
    habitList.appendChild(newHabit);
    saveHabitToFirebase(habit);
}

function addCustomHabit() {
    const customHabit = document.getElementById('custom-habit').value;
    if (customHabit) {
        addHabitToList(customHabit);
        document.getElementById('custom-habit').value = '';
    }
}

function saveHabitToFirebase(habit) {
    db.collection('habits').add({
        name: habit,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log('Habit added to Firebase!');
    })
    .catch(error => {
        console.error('Error adding habit to Firebase: ', error);
    });
}

function loadCustomHabits() {
    db.collection('habits').orderBy('createdAt').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            addHabitToList(doc.data().name);
        });
    });
}
