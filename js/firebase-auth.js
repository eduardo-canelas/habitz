// js/firebase-auth.js

import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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
