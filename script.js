// ✅ Firebase imports (MODULAR SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQw63fhm4CUuxkQBzendZrr7mf1YSiDaA",
  authDomain: "leaders-question-app.firebaseapp.com",
  projectId: "leaders-question-app",
  storageBucket: "leaders-question-app.firebasestorage.app",
  messagingSenderId: "828044191577",
  appId: "1:828044191577:web:fb565c4ec3e4ab51590e48",
  measurementId: "G-G018NWDGGY"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Create 16 leaders
const leaders = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: `Leader ${i + 1}`
}));

// ✅ Test images for all 16 leaders
const leaderImages = {
  1: "https://via.placeholder.com/150?text=Leader+1",
  2: "https://via.placeholder.com/150?text=Leader+2",
  3: "https://via.placeholder.com/150?text=Leader+3",
  4: "https://via.placeholder.com/150?text=Leader+4",
  5: "https://via.placeholder.com/150?text=Leader+5",
  6: "https://via.placeholder.com/150?text=Leader+6",
  7: "https://via.placeholder.com/150?text=Leader+7",
  8: "https://via.placeholder.com/150?text=Leader+8",
  9: "https://via.placeholder.com/150?text=Leader+9",
  10: "https://via.placeholder.com/150?text=Leader+10",
  11: "https://via.placeholder.com/150?text=Leader+11",
  12: "https://via.placeholder.com/150?text=Leader+12",
  13: "https://via.placeholder.com/150?text=Leader+13",
  14: "https://via.placeholder.com/150?text=Leader+14",
  15: "https://via.placeholder.com/150?text=Leader+15",
  16: "https://via.placeholder.com/150?text=Leader+16"
};

let currentLeaderId = null;

// ✅ DOM references
const leadersContainer = document.getElementById("leaders-container");
const selectedLeader = document.getElementById("selected-leader");
const leaderImageEl = document.getElementById("leader-image");
const questionsContainer = document.getElementById("questions-container");
const questionInputArea = document.getElementById("question-input-area");
const questionInput = document.getElementById("question-input");
const addBtn = document.getElementById("add-question-btn");
const limitMsg = document.getElementById("question-limit-msg");

// ✅ Render leader buttons
leaders.forEach(leader => {
  const btn = document.createElement("button");
  btn.textContent = leader.name;
  btn.onclick = () => selectLeader(leader);
  leadersContainer.appendChild(btn);
});

// ✅ Select leader & listen for shared questions
function selectLeader(leader) {
  currentLeaderId = leader.id;
  selectedLeader.textContent = `Questions for ${leader.name}`;
  questionInputArea.style.display = "block";
  limitMsg.textContent = "";

  // ✅ Show leader image
  if (leaderImages[leader.id]) {
    leaderImageEl.src = leaderImages[leader.id];
    leaderImageEl.style.display = "block";
  } else {
    leaderImageEl.style.display = "none";
  }

  const q = query(
    collection(db, "questions"),
    where("leaderId", "==", currentLeaderId)
  );

  onSnapshot(q, snapshot => {
    questionsContainer.innerHTML = "";
    snapshot.forEach(doc => {
      const li = document.createElement("li");
      li.textContent = doc.data().text;
      questionsContainer.appendChild(li);
    });
  });
}

// ✅ Add shared question (MAX 15 PER LEADER)
addBtn.onclick = async () => {
  const text = questionInput.value.trim();
  if (!text || !currentLeaderId) return;

  const q = query(
    collection(db, "questions"),
    where("leaderId", "==", currentLeaderId)
  );

  const snap = await getDocs(q);
  if (snap.size >= 15) {
    limitMsg.textContent = "Maximum of 15 questions reached.";
    limitMsg.style.color = "red";
    return;
  }

  await addDoc(collection(db, "questions"), {
    leaderId: currentLeaderId,
    text
  });

  questionInput.value = "";
};
