import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Function to add a habit with a specified name and category
async function addHabit(habitName) {
  const userId = localStorage.getItem('userId'); // Get user ID from local storage

  if (!userId) {
    console.error("User ID not found. Please log in.");
    return;
  }

  // Define a mapping between habit names and categories
  const categoryMap = {
    "Running": "Cardiovascular Exercises",
    "Swimming": "Cardiovascular Exercises",
    "Cycling": "Cardiovascular Exercises",
    "Brisk Walking": "Cardiovascular Exercises",
    "Dancing": "Cardiovascular Exercises",
    "HIIT": "Cardiovascular Exercises",
    "Squats": "Strength Training Exercises",
    "Lunges": "Strength Training Exercises",
    "Push-ups": "Strength Training Exercises",
    "Hamstring Stretch": "Flexibility and Stretching Exercises",
    "Calf Stretch": "Flexibility and Stretching Exercises",
    "Pilates": "Flexibility and Stretching Exercises",
    "Step-Ups": "Functional Training Exercises",
    "Box Jumps": "Functional Training Exercises",
    "Burpees": "Functional Training Exercises",
    "Mountain Climbers": "Functional Training Exercises",
    "Kettlebell Swings": "Functional Training Exercises",
    "Planks": "Core Strengthening Exercises",
    "Russian Twists": "Core Strengthening Exercises",
    "Leg Raises": "Core Strengthening Exercises",
    "Bicycle Crunches": "Core Strengthening Exercises",
    "Cognitive Restructuring": "Cognitive-Behavioral Therapy Exercises",
    "Journaling": "Cognitive-Behavioral Therapy Exercises",
    "Gratitude Log": "Cognitive-Behavioral Therapy Exercises",
    "Grounding Techniques": "Emotional Regulation Exercises",
    "Self-Compassion Exercises": "Emotional Regulation Exercises",
    "Creative Expression": "Emotional Regulation Exercises",
    "Boundary Setting": "Self-Care Exercises",
    "Prioritization": "Self-Care Exercises",
    "Effective Time Management": "Self-Care Exercises",
    "Relaxation Techniques": "Self-Care Exercises",
    "Active Listening": "Social Connection Exercises",
    "Empathy Building": "Social Connection Exercises",
    "Conflict Resolution": "Social Connection Exercises",
    "Joining a Social Group": "Social Connection Exercises",
    "Positive Self-Talk": "Self-Esteem and Confidence Exercises",
    "Goal Setting": "Self-Esteem and Confidence Exercises",
    "Self-reflection": "Self-Esteem and Confidence Exercises"
  };

  // Look up the category based on the habit name
  const category = categoryMap[habitName];

  try {
    const habitRef = collection(db, "users", userId, "habits");

    // Add the habit along with its category and timestamp
    await addDoc(habitRef, {
      name: habitName,
      category: category,
      createdAt: serverTimestamp(),
    });

    console.log(`${habitName} added to Firestore under ${category}.`);
  } catch (error) {
    console.error("Error adding habit:", error);
  }
}

// Step 1 functions
async function getTotalHabits(userId) {
  const habitsRef = collection(db, "users", userId, "habits");
  const snapshot = await getDocs(habitsRef);
  return snapshot.size;
}

async function getHabitCountByCategory(userId) {
  const habitsRef = collection(db, "users", userId, "habits");
  const snapshot = await getDocs(habitsRef);
  const categoryCounts = {};

  snapshot.forEach((doc) => {
    const habit = doc.data();
    const category = habit.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  return categoryCounts;
}

async function getRecentHabits(userId, limitCount = 5) {
  const habitsRef = collection(db, "users", userId, "habits");
  const recentHabitsQuery = query(habitsRef, orderBy("createdAt", "desc"), limit(limitCount));
  const snapshot = await getDocs(recentHabitsQuery);
  return snapshot.docs.map(doc => doc.data());
}

// Make addHabit and the new functions available globally
window.addHabit = addHabit;
window.getTotalHabits = getTotalHabits;
window.getHabitCountByCategory = getHabitCountByCategory;
window.getRecentHabits = getRecentHabits;
