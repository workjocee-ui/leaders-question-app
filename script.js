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

const firebaseConfig = {
  apiKey: "AIzaSyDQw63fhm4CUuxkQBzendZrr7mf1YSiDaA",
  authDomain: "leaders-question-app.firebaseapp.com",
  projectId: "leaders-question-app",
  storageBucket: "leaders-question-app.firebasestorage.app",
  messagingSenderId: "828044191577",
  appId: "1:828044191577:web:fb565c4ec3e4ab51590e48",
  measurementId: "G-G018NWDGGY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const leaders = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: `Leader ${i + 1}`
}));

const leaderImages = {
  1: "https://via.placeholder.com/300?text=Leader+1",
  2: "https://via.placeholder.com/300?text=Leader+2",
  3: "https://via.placeholder.com/300?text=Leader+3",
  4: "https://via.placeholder.com/300?text=Leader+4",
  5: "https://via.placeholder.com/300?text=Leader+5",
  6: "https://via.placeholder.com/300?text=Leader+6",
  7: "https://via.placeholder.com/300?text=Leader+7",
  8: "https://via.placeholder.com/300?text=Leader+8",
  9: "https://via.placeholder.com/300?text=Leader+9",
  10: "https://via.placeholder.com/300?text=Leader+10",
  11: "https://via.placeholder.com/300?text=Leader+11",
  12: "https://via.placeholder.com/300?text=Leader+12",
  13: "https://via.placeholder.com/300?text=Leader+13",
  14: "https://via.placeholder.com/300?text=Leader+14",
  15: "https://via.placeholder.com/300?text=Leader+15",
  16: "https://via.placeholder.com/300?text=Leader+16"
};

let currentLeaderId = null;
let currentSnapshotUnsubscribe = null;
let activeCard = null;

const leadersContainer = document.getElementById("leaders-container");
const selectedLeader = document.getElementById("selected-leader");
const selectedDescription = document.getElementById("selected-description");
const leaderImageEl = document.getElementById("leader-image");
const questionsContainer = document.getElementById("questions-container");
const questionInputArea = document.getElementById("question-input-area");
const questionInput = document.getElementById("question-input");
const addBtn = document.getElementById("add-question-btn");
const limitMsg = document.getElementById("question-limit-msg");

// Check for URL parameter to select a leader
const urlParams = new URLSearchParams(window.location.search);
const leaderIdParam = urlParams.get('leaderId');
let autoSelect = false;
if (leaderIdParam) {
  const leader = leaders.find(l => l.id == parseInt(leaderIdParam));
  if (leader) {
    autoSelect = true;
    // Will select after creating cards
  }
}

function createLeaderCards() {
  leaders.forEach(leader => {
    const card = document.createElement("div");
    card.className = "leader-card";
    card.dataset.leaderId = leader.id;

    const img = document.createElement("img");
    img.src = leaderImages[leader.id];
    img.alt = `${leader.name} portrait`;

    const button = document.createElement("button");
    button.className = "leader-card-button";
    button.textContent = leader.name;
    button.addEventListener("click", () => selectLeader(leader, card));

    card.append(img, button);
    leadersContainer.appendChild(card);
  });
}

function selectLeader(leader, card) {
  currentLeaderId = leader.id;

  if (activeCard) {
    activeCard.classList.remove("active");
  }
  card.classList.add("active");
  activeCard = card;

  selectedLeader.textContent = `Questions for ${leader.name}`;
  selectedDescription.textContent = "Add your question below and it will be saved to the leader's shared list.";
  questionInputArea.style.display = "block";
  limitMsg.textContent = "";
  leaderImageEl.src = leaderImages[leader.id];
  leaderImageEl.style.display = "block";

  // Scroll to the selected panel
  document.getElementById("selected-panel").scrollIntoView({ behavior: 'smooth' });

  if (currentSnapshotUnsubscribe) {
    currentSnapshotUnsubscribe();
    currentSnapshotUnsubscribe = null;
  }

  const q = query(collection(db, "questions"), where("leaderId", "==", currentLeaderId));
  currentSnapshotUnsubscribe = onSnapshot(q, snapshot => {
    console.log("Snapshot received, docs count:", snapshot.size);
    questionsContainer.innerHTML = "";

    if (snapshot.empty) {
      const emptyMessage = document.createElement("li");
      emptyMessage.className = "no-questions";
      emptyMessage.textContent = "No questions have been added for this leader yet.";
      questionsContainer.appendChild(emptyMessage);
      return;
    }

    snapshot.forEach(doc => {
      const li = document.createElement("li");
      li.textContent = doc.data().text;
      questionsContainer.appendChild(li);
    });
  }, error => {
    console.error("Snapshot error:", error);
  });
}

addBtn.addEventListener("click", async () => {
  const text = questionInput.value.trim();
  if (!text || !currentLeaderId) return;

  const q = query(collection(db, "questions"), where("leaderId", "==", currentLeaderId));
  const snap = await getDocs(q);

  if (snap.size >= 15) {
    limitMsg.textContent = "Maximum of 15 questions reached.";
    return;
  }

  try {
    await addDoc(collection(db, "questions"), {
      leaderId: currentLeaderId,
      text
    });
    console.log("Question added successfully");
    questionInput.value = "";
    limitMsg.textContent = "";
  } catch (error) {
    console.error("Error adding question:", error);
    limitMsg.textContent = "Failed to add question. Check console for details.";
  }
});

createLeaderCards();

if (autoSelect) {
  const leader = leaders.find(l => l.id == parseInt(leaderIdParam));
  const card = document.querySelector(`[data-leader-id="${leader.id}"]`);
  if (card) {
    selectLeader(leader, card);
  }
} else {
  const firstCard = leadersContainer.querySelector(".leader-card");
  if (firstCard) {
    selectLeader(leaders[0], firstCard);
  }
}

