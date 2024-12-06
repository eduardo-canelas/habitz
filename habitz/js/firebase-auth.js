// js/firebase-auth.js

import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Sign Up new users
window.signUpUser = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Sign up successful!");
      window.location.href = "home.html"; // Redirect to home.html
    })
    .catch((error) => {
      alert(error.message);
    });
};

// Log In existing users
window.loginUser = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login successful!");
      window.location.href = "home.html"; // Redirect to home.html
    })
    .catch((error) => {
      alert(error.message);
    });
};

// Global variable to hold the current user's ID
window.currentUserId = null;

// Listen for changes in the authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, set the currentUserId
    window.currentUserId = user.uid;
    console.log("User is signed in:", user.uid);
  } else {
    // User is signed out, reset the currentUserId
    window.currentUserId = null;
    console.log("No user is signed in.");
  }
});

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, you can retrieve the user ID here
    window.currentUserId = user.uid; // Store the user ID in a global variable
    console.log("User ID: ", window.currentUserId);
  } else {
    // User is signed out
    console.log("No user is signed in.");
    window.currentUserId = null; // Reset the user ID when signed out
  }
});
