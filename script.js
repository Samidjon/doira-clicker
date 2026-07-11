let score = Number(localStorage.getItem("doira_score")) || 0;
let currentDoira = localStorage.getItem("current_doira") || "doira.png";

const scoreText = document.getElementById("score");
const rankText = document.getElementById("rank");
const doira = document.getElementById("doira");
const drumSound = document.getElementById("drumSound");
const bonusText = document.getElementById("bonusText");
const factBox = document.getElementById("factBox");

const facts = [
    { points: 50, text: "Fact unlocked: The Doira is a traditional Uzbek percussion instrument." },
    { points: 100, text: "Fact unlocked: The Doira is often used in Uzbek weddings and celebrations." },
    { points: 200, text: "Fact unlocked: Metal rings inside the Doira create a jingling sound." },
    { points: 300, text: "Fact unlocked: Doira players use fingers, palms, and wrists to create rhythm." },
    { points: 500, text: "Fact unlocked: The Doira is an important symbol of Uzbek musical culture." }
];

scoreText.textContent = score;
doira.src = currentDoira;
updateRank();
updateFact();

doira.addEventListener("click", () => {
    let points = 1;

    // 10% chance for bonus +10
    if (Math.random() < 0.1) {
        points = 10;
        showBonus();
    }

    score += points;

    scoreText.textContent = score;
    localStorage.setItem("doira_score", score);

    unlockDoiraCollection();
    updateRank();
    updateFact();

    drumSound.currentTime = 0;
    drumSound.play();

    doira.classList.add("click-animation");

    setTimeout(() => {
        doira.classList.remove("click-animation");
    }, 150);
});

function showBonus() {
    bonusText.classList.add("show-bonus");

    setTimeout(() => {
        bonusText.classList.remove("show-bonus");
    }, 700);
}

function updateRank() {
    if (score >= 500) {
        rankText.textContent = "🥁 Doira Master";
    } else if (score >= 200) {
        rankText.textContent = "⭐ Skilled Musician";
    } else if (score >= 100) {
        rankText.textContent = "🎵 Beginner Performer";
    } else {
        rankText.textContent = "🌱 New Learner";
    }
}

function updateFact() {
    let unlockedFact = "Unlock facts by earning more points!";

    for (let fact of facts) {
        if (score >= fact.points) {
            unlockedFact = fact.text;
        }
    }

    factBox.textContent = unlockedFact;
}

function unlockDoiraCollection() {
    if (score >= 300) {
        localStorage.setItem("doira_ancient_unlocked", "true");
    }

    if (score >= 100) {
        localStorage.setItem("doira_gold_unlocked", "true");
    }
}

function goProfile() {
    window.location.href = "profile.html";
}


const chatButton = document.getElementById("chatButton");
const chatWindow = document.getElementById("chatWindow");
const closeChat = document.getElementById("closeChat");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const quickQuestionButtons = document.querySelectorAll(
    ".quick-questions button"
);

chatButton.addEventListener("click", () => {
    chatWindow.classList.toggle("hidden");

    if (!chatWindow.classList.contains("hidden")) {
        chatInput.focus();
    }
});

closeChat.addEventListener("click", () => {
    chatWindow.classList.add("hidden");
});

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const question = chatInput.value.trim();

    if (!question) {
        return;
    }

    sendQuestion(question);
    chatInput.value = "";
});

quickQuestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        sendQuestion(button.dataset.question);
    });
});

function sendQuestion(question) {
    addChatMessage(question, "user-message");

    setTimeout(() => {
        const answer = getBotAnswer(question);
        addChatMessage(answer, "bot-message");
    }, 400);
}

function addChatMessage(text, messageClass) {
    const message = document.createElement("div");

    message.classList.add("message", messageClass);
    message.textContent = text;

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotAnswer(question) {
    const text = question.toLowerCase().trim();

    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
    ) {
        const username =
            localStorage.getItem("doira_username") || "player";

        return `Hello, ${username}! How can I help you learn about the Doira?`;
    }

    if (
        text.includes("what is doira") ||
        text.includes("what is a doira") ||
        text.includes("что такое дойра") ||
        text.includes("что такое доира")
    ) {
        return "The Doira is a traditional Central Asian frame drum. It is especially important in Uzbek music and culture.";
    }

    if (
        text.includes("history") ||
        text.includes("история")
    ) {
        return "The Doira has been used in Central Asia for centuries. It is traditionally played at weddings, festivals, dances, and cultural performances.";
    }

    if (
        text.includes("structure") ||
        text.includes("made of") ||
        text.includes("сделана") ||
        text.includes("строение")
    ) {
        return "The Doira has a round wooden frame covered with skin or synthetic material. Small metal rings inside the frame create its jingling sound.";
    }

    if (
        text.includes("played") ||
        text.includes("play doira") ||
        text.includes("how to play") ||
        text.includes("играют")
    ) {
        return "The Doira is played with the fingers and palms. Musicians strike different parts of the surface to create high, low, soft, and powerful sounds.";
    }

    if (
        text.includes("culture") ||
        text.includes("important") ||
        text.includes("культура") ||
        text.includes("важна")
    ) {
        return "The Doira is an important part of Uzbek cultural heritage. It accompanies traditional music, dance, weddings, and national celebrations.";
    }

    if (
        text.includes("score") ||
        text.includes("points") ||
        text.includes("балл") ||
        text.includes("очки")
    ) {
        const currentScore =
            Number(localStorage.getItem("doira_score")) || 0;

        return `You currently have ${currentScore} points. Keep playing to unlock more facts and Doira designs!`;
    }

    if (
        text.includes("bonus") ||
        text.includes("+10")
    ) {
        return "There is a 10% chance to receive a +10 bonus when you click the Doira.";
    }

    if (
        text.includes("collection") ||
        text.includes("unlock") ||
        text.includes("коллекция")
    ) {
        return "You can unlock the Golden Doira at 100 points and the Ancient Doira at 300 points.";
    }

    if (
        text.includes("bye") ||
        text.includes("goodbye") ||
        text.includes("пока")
    ) {
        return "Goodbye! Enjoy the Doira Clicker and come back soon 😊";
    }

    if (text.includes("help")) {
        return "You can learn about the Doira, play the clicker game, unlock new Doira designs, discover interesting facts, complete quizzes, and increase your score.";
    }

    if (
        text.includes("achievement") ||
        text.includes("achievements")
    ) {
        return "Achievements are unlocked as you earn more points. Keep clicking to become a Doira Master!";
    }

    if (
        text.includes("interesting fact") ||
        text.includes("fun fact")
    ) {
        const facts = [
            "The Doira has been used in Central Asia for hundreds of years.",
            "Some professional musicians can perform over 20 different rhythmic techniques.",
            "The Doira is one of Uzbekistan's best-known traditional instruments.",
            "Metal rings inside the Doira create its unique jingling sound.",
            "The Doira is commonly played during weddings and national celebrations."
        ];

        return facts[Math.floor(Math.random() * facts.length)];
    }

    if (
        text.includes("golden")
    ) {
        return "The Golden Doira is unlocked when you reach 100 points.";
    }

    return "I am not sure about that question yet. Try asking about the Doira's history, structure, playing techniques, culture, score, or collection.";
}