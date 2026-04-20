import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// SAME Firebase config as script.js
const firebaseConfig = {
  apiKey: "AIzaSyDQw63fhm4CUuxkQBzendZrr7mf1YSiDaA",
  authDomain: "leaders-question-app.firebaseapp.com",
  projectId: "leaders-question-app",
  storageBucket: "leaders-question-app.firebasestorage.app",
  messagingSenderId: "828044191577",
  appId: "1:828044191577:web:fb565c4ec3e4ab51590e48"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.getElementById("summary-container");

async function loadSummary() {
  const snapshot = await getDocs(collection(db, "questions"));
  const counts = {};

  snapshot.forEach(doc => {
    const { leaderId } = doc.data();
    counts[leaderId] = (counts[leaderId] || 0) + 1;
  });

  container.innerHTML = "";
  Object.keys(counts).forEach(leaderId => {
    const p = document.createElement("p");
    p.textContent = `Leader ${leaderId}: ${counts[leaderId]} questions`;
    container.appendChild(p);
  });
}

loadSummary();