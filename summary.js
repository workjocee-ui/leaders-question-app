import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
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

const leaders = [
  { id: 1, name: "Christian Lim" },
  { id: 2, name: "Michelle Tay" },
  { id: 3, name: "Emisukri Abdul Rahman" },
  { id: 4, name: "Danny Boey" },
  { id: 5, name: "Steven Er" },
  { id: 6, name: "Judy Loh" },
  { id: 7, name: "Chee Wee Tan" },
  { id: 8, name: "Francis Tan" },
  { id: 9, name: "Vince Tan" },
  { id: 10, name: "Ajith Thadiyil Vidyadharan" },
  { id: 11, name: "Yung Yeow Wong" },
  { id: 12, name: "Hong Eng Yap" },
  { id: 13, name: "Hendra Setiawan" },
  { id: 14, name: "Ming Wen Yang" },
  { id: 15, name: "Lawrence Ong" },
  { id: 16, name: "Shaofeng Zhu" }
];

const leaderImages = {
  1: "Images for Leaders/Christian Lim.jpg",
  2: "Images for Leaders/Michelle Tay.jpg",
  3: "Images for Leaders/Emisukri Abdul Rahman.jpg",
  4: "Images for Leaders/Danny Boey.jpg",
  5: "Images for Leaders/Steven Er.jpg",
  6: "https://via.placeholder.com/300?text=Judy+Loh",
  7: "Images for Leaders/Chee Wee Tan.jpg",
  8: "Images for Leaders/Francis Tan.jpg",
  9: "Images for Leaders/Vince Tan.jpg",
  10: "Images for Leaders/Ajith Thadiyil Vidyadharan.jpg",
  11: "Images for Leaders/Yung Yeow Wong.jpg",
  12: "Images for Leaders/Hong Eng Yap.jpg",
  13: "Images for Leaders/Hendra Setiawan.jpg",
  14: "Images for Leaders/Ming Wen Yang.jpg",
  15: "https://via.placeholder.com/300?text=Lawrence+Ong",
  16: "Images for Leaders/Shaofeng Zhu.jpg"
};

const summaryContainer = document.getElementById("summary-container");
const leaderDetails = document.getElementById("leader-details");
const summaryTitle = document.getElementById("summary-selected-title");
const summaryDescription = document.getElementById("summary-selected-description");
const summaryQuestionsList = document.getElementById("summary-questions-list");
let activeSummaryCard = null;

function renderCards(summaryData) {
  summaryContainer.innerHTML = "";

  leaders.forEach(leader => {
    const card = document.createElement("div");
    card.className = "summary-card";

    const img = document.createElement("img");
    img.src = leaderImages[leader.id];
    img.alt = `${leader.name} portrait`;

    const count = summaryData[leader.id]?.length || 0;
    const text = document.createElement("p");
    text.textContent = `${count} question${count === 1 ? "" : "s"}`;
    text.className = "empty-card";

    const link = document.createElement("a");
    link.className = "summary-action-button";
    link.href = `index.html?leaderId=${leader.id}`;
    link.textContent = `View ${leader.name}`;

    card.append(img, text, link);
    summaryContainer.appendChild(card);
  });
}

function showLeaderQuestions(leader, questions) {
  leaderDetails.classList.remove("hidden");
  summaryTitle.textContent = `${leader.name} Questions`;
  summaryDescription.textContent = questions.length
    ? `${questions.length} question${questions.length === 1 ? "" : "s"} have been submitted for this leader.`
    : "No questions have been submitted yet. Select a leader in the main app to add one.";

  summaryQuestionsList.innerHTML = "";
  if (questions.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "no-questions";
    emptyMessage.textContent = "No questions available for this leader.";
    summaryQuestionsList.appendChild(emptyMessage);
    return;
  }

  questions.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    summaryQuestionsList.appendChild(li);
  });
}

async function loadSummary() {
  const snapshot = await getDocs(collection(db, "questions"));
  const summaryData = {};

  snapshot.forEach(doc => {
    const { leaderId, text } = doc.data();
    summaryData[leaderId] = summaryData[leaderId] || [];
    summaryData[leaderId].push(text);
  });

  renderCards(summaryData);
}

loadSummary();
