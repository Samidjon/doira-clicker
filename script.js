"use strict";

/* Telegram Mini App initialisation */

const telegramApp = window.Telegram?.WebApp;

if (telegramApp) {
    telegramApp.ready();
    telegramApp.expand();
}

/* Storage keys */

const STORAGE_KEYS = {
    username: "doira_username",
    score: "doira_score",
    currentDoira: "current_doira",
    currentDoiraName: "current_doira_name",
    goldUnlocked: "doira_gold_unlocked",
    ancientUnlocked: "doira_ancient_unlocked"
};

/* Game data */

const DOIRA_FACTS = [
    {
        points: 50,
        text:
            "The Doira is a traditional frame drum commonly used in Uzbek music."
    },
    {
        points: 100,
        text:
            "The Doira is often played during weddings, festivals, dances, and national celebrations."
    },
    {
        points: 200,
        text:
            "Small metal rings inside the wooden frame create the Doira's distinctive jingling sound."
    },
    {
        points: 300,
        text:
            "Musicians use their fingers, palms, and wrists to create different Doira rhythms."
    },
    {
        points: 500,
        text:
            "The Doira is an important symbol of Uzbek cultural and musical heritage."
    }
];

const RANDOM_FACTS = [
    "The Doira has been used in Central Asian music for centuries.",
    "Professional Doira players can create complex rhythms using both hands.",
    "The Doira may be performed alone or together with singers and dancers.",
    "Different areas of the Doira surface produce different tones.",
    "The Doira combines drum sounds with the jingling sound of metal rings."
];

/* General helpers */

function getStoredScore() {
    return Number(localStorage.getItem(STORAGE_KEYS.score)) || 0;
}

function getStoredUsername() {
    return localStorage.getItem(STORAGE_KEYS.username);
}

function getCurrentDoira() {
    return localStorage.getItem(STORAGE_KEYS.currentDoira) || "doira.png";
}

function getCurrentDoiraName() {
    return localStorage.getItem(STORAGE_KEYS.currentDoiraName) || "Classic";
}

function saveScore(score) {
    localStorage.setItem(STORAGE_KEYS.score, String(score));
}

function redirectWithoutUser() {
    const isLoginPage =
        window.location.pathname.endsWith("login.html") ||
        window.location.pathname.endsWith("/");

    if (!getStoredUsername() && !isLoginPage) {
        window.location.href = "login.html";
    }
}

function getRank(score) {
    if (score >= 500) {
        return "🥁 Doira Master";
    }

    if (score >= 200) {
        return "⭐ Skilled Musician";
    }

    if (score >= 100) {
        return "🎵 Beginner Performer";
    }

    return "🌱 New Learner";
}

function getProgressData(score) {
    if (score < 100) {
        return {
            current: score,
            start: 0,
            target: 100,
            label: "Progress to Beginner Performer"
        };
    }

    if (score < 200) {
        return {
            current: score,
            start: 100,
            target: 200,
            label: "Progress to Skilled Musician"
        };
    }

    if (score < 500) {
        return {
            current: score,
            start: 200,
            target: 500,
            label: "Progress to Doira Master"
        };
    }

    return {
        current: 500,
        start: 0,
        target: 500,
        label: "Maximum rank achieved"
    };
}

function countUnlockedFacts(score) {
    return DOIRA_FACTS.filter(
        (fact) => score >= fact.points
    ).length;
}

function unlockCollections(score) {
    if (score >= 100) {
        localStorage.setItem(
            STORAGE_KEYS.goldUnlocked,
            "true"
        );
    }

    if (score >= 300) {
        localStorage.setItem(
            STORAGE_KEYS.ancientUnlocked,
            "true"
        );
    }
}

function navigateTo(path) {
    window.location.href = path;
}

/* Login page */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    const existingUsername = getStoredUsername();
    const usernameInput = document.getElementById("username");

    if (existingUsername) {
        usernameInput.value = existingUsername;
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();

        if (!username) {
            alert("Please enter your name.");
            return;
        }

        localStorage.setItem(
            STORAGE_KEYS.username,
            username
        );

        if (
            localStorage.getItem(STORAGE_KEYS.score) === null
        ) {
            saveScore(0);
        }

        if (
            localStorage.getItem(STORAGE_KEYS.currentDoira) === null
        ) {
            localStorage.setItem(
                STORAGE_KEYS.currentDoira,
                "doira.png"
            );

            localStorage.setItem(
                STORAGE_KEYS.currentDoiraName,
                "Classic"
            );
        }

        navigateTo("profile.html");
    });
}

redirectWithoutUser();

/* Navigation */

document
    .querySelectorAll("[data-link]")
    .forEach((button) => {
        button.addEventListener("click", () => {
            navigateTo(button.dataset.link);
        });
    });

const headerProfileButton =
    document.getElementById("headerProfileButton");

if (headerProfileButton) {
    headerProfileButton.addEventListener("click", () => {
        navigateTo("profile.html");
    });
}

const profileFeatureCard =
    document.getElementById("profileFeatureCard");

if (profileFeatureCard) {
    profileFeatureCard.addEventListener("click", () => {
        navigateTo("profile.html");
    });
}

const collectionFeatureCard =
    document.getElementById("collectionFeatureCard");

if (collectionFeatureCard) {
    collectionFeatureCard.addEventListener("click", () => {
        navigateTo("profile.html");
    });
}

/* Game page */

const doira = document.getElementById("doira");
const scoreElement = document.getElementById("score");
const rankElement = document.getElementById("rank");
const drumSound = document.getElementById("drumSound");
const factBox = document.getElementById("factBox");
const factProgressText =
    document.getElementById("factProgressText");
const floatingPointsContainer =
    document.getElementById("floatingPointsContainer");
const progressFill =
    document.getElementById("progressFill");
const progressRankName =
    document.getElementById("progressRankName");
const progressNumbers =
    document.getElementById("progressNumbers");
const currentDoiraTitle =
    document.getElementById("currentDoiraTitle");
const headerUsername =
    document.getElementById("headerUsername");

let score = getStoredScore();

if (headerUsername && getStoredUsername()) {
    headerUsername.textContent = getStoredUsername();
}

function updateGameInterface() {
    if (!scoreElement) {
        return;
    }

    unlockCollections(score);

    scoreElement.textContent = String(score);
    rankElement.textContent = getRank(score);

    if (doira) {
        doira.src = getCurrentDoira();
    }

    if (currentDoiraTitle) {
        currentDoiraTitle.textContent =
            `${getCurrentDoiraName()} Doira`;
    }

    updateProgressBar();
    updateUnlockedFact();
}

function updateProgressBar() {
    if (
        !progressFill ||
        !progressRankName ||
        !progressNumbers
    ) {
        return;
    }

    const progress = getProgressData(score);

    const completed =
        progress.current - progress.start;

    const required =
        progress.target - progress.start;

    const percentage =
        required === 0
            ? 100
            : Math.min(
                100,
                Math.max(0, (completed / required) * 100)
            );

    progressFill.style.width = `${percentage}%`;
    progressRankName.textContent = progress.label;

    if (score >= 500) {
        progressNumbers.textContent = "500 / 500";
    } else {
        progressNumbers.textContent =
            `${score} / ${progress.target}`;
    }
}

function updateUnlockedFact() {
    if (!factBox || !factProgressText) {
        return;
    }

    let currentFact = null;

    for (const fact of DOIRA_FACTS) {
        if (score >= fact.points) {
            currentFact = fact;
        }
    }

    const unlockedCount = countUnlockedFacts(score);

    factProgressText.textContent =
        `${unlockedCount} of ${DOIRA_FACTS.length} facts unlocked`;

    if (currentFact) {
        factBox.textContent = currentFact.text;
        return;
    }

    factBox.textContent =
        "Earn 50 points to unlock your first Doira fact.";
}

function createFloatingPoint(points) {
    if (!floatingPointsContainer) {
        return;
    }

    const pointElement = document.createElement("span");

    pointElement.className =
        points === 10
            ? "floating-point bonus-point"
            : "floating-point normal-point";

    pointElement.textContent =
        points === 10 ? "✨ +10" : "+1";

    const randomHorizontal =
        Math.floor(Math.random() * 50) - 25;

    pointElement.style.left =
        `calc(50% + ${randomHorizontal}px)`;

    floatingPointsContainer.appendChild(pointElement);

    window.setTimeout(() => {
        pointElement.remove();
    }, 850);
}

function playDrumSound() {
    if (!drumSound) {
        return;
    }

    drumSound.currentTime = 0;

    const playPromise = drumSound.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {
            console.log(
                "The browser blocked automatic audio playback."
            );
        });
    }
}

if (doira) {
    updateGameInterface();

    doira.addEventListener("click", () => {
        const isBonus = Math.random() < 0.1;
        const earnedPoints = isBonus ? 10 : 1;

        score += earnedPoints;
        saveScore(score);

        createFloatingPoint(earnedPoints);
        playDrumSound();

        doira.classList.add("click-animation");

        window.setTimeout(() => {
            doira.classList.remove("click-animation");
        }, 140);

        updateGameInterface();
    });
}

/* Profile page */

const profileName =
    document.getElementById("profileName");
const profileInitial =
    document.getElementById("profileInitial");
const profileScore =
    document.getElementById("profileScore");
const profileRank =
    document.getElementById("profileRank");
const selectedDoiraName =
    document.getElementById("selectedDoiraName");
const factsUnlocked =
    document.getElementById("factsUnlocked");
const nextGoal =
    document.getElementById("nextGoal");
const playFromProfile =
    document.getElementById("playFromProfile");
const logoutButton =
    document.getElementById("logoutButton");

function getNextGoal(scoreValue) {
    if (scoreValue < 100) {
        return "100 points";
    }

    if (scoreValue < 200) {
        return "200 points";
    }

    if (scoreValue < 300) {
        return "300 points";
    }

    if (scoreValue < 500) {
        return "500 points";
    }

    return "All goals reached";
}

function updateProfileInterface() {
    if (!profileName) {
        return;
    }

    const username = getStoredUsername() || "Player";
    const currentScore = getStoredScore();

    unlockCollections(currentScore);

    profileName.textContent = username;
    profileInitial.textContent =
        username.charAt(0).toUpperCase();

    profileScore.textContent = String(currentScore);
    profileRank.textContent = getRank(currentScore);

    selectedDoiraName.textContent =
        getCurrentDoiraName();

    factsUnlocked.textContent =
        `${countUnlockedFacts(currentScore)} / ${DOIRA_FACTS.length}`;

    nextGoal.textContent = getNextGoal(currentScore);

    updateCollectionCards(currentScore);
    updateAchievements(currentScore);
}

function updateCollectionCards(currentScore) {
    const goldUnlocked =
        currentScore >= 100 ||
        localStorage.getItem(
            STORAGE_KEYS.goldUnlocked
        ) === "true";

    const ancientUnlocked =
        currentScore >= 300 ||
        localStorage.getItem(
            STORAGE_KEYS.ancientUnlocked
        ) === "true";

    setCollectionLockState(
        "goldDoiraImage",
        "goldDoiraButton",
        "goldLock",
        goldUnlocked
    );

    setCollectionLockState(
        "ancientDoiraImage",
        "ancientDoiraButton",
        "ancientLock",
        ancientUnlocked
    );

    const currentImage = getCurrentDoira();

    document
        .querySelectorAll("[data-doira-card]")
        .forEach((card) => {
            card.classList.toggle(
                "selected",
                card.dataset.doiraCard === currentImage
            );
        });
}

function setCollectionLockState(
    imageId,
    buttonId,
    lockId,
    unlocked
) {
    const image = document.getElementById(imageId);
    const button = document.getElementById(buttonId);
    const lock = document.getElementById(lockId);

    if (!image || !button || !lock) {
        return;
    }

    image.classList.toggle(
        "locked-image",
        !unlocked
    );

    button.disabled = !unlocked;

    if (unlocked) {
        lock.classList.add("hidden");
        button.textContent = "Select";
    }
}

document
    .querySelectorAll(".select-doira-button")
    .forEach((button) => {
        button.addEventListener("click", () => {
            if (button.disabled) {
                return;
            }

            const imageName = button.dataset.image;
            const doiraName = button.dataset.name;

            localStorage.setItem(
                STORAGE_KEYS.currentDoira,
                imageName
            );

            localStorage.setItem(
                STORAGE_KEYS.currentDoiraName,
                doiraName
            );

            updateProfileInterface();

            alert(`${doiraName} Doira selected!`);
        });
    });

function updateAchievements(currentScore) {
    updateAchievement(
        "achievementFirstBeat",
        currentScore >= 10
    );

    updateAchievement(
        "achievementYoungMusician",
        currentScore >= 100
    );

    updateAchievement(
        "achievementDoiraMaster",
        currentScore >= 500
    );
}

function updateAchievement(elementId, unlocked) {
    const achievement =
        document.getElementById(elementId);

    if (!achievement) {
        return;
    }

    achievement.classList.toggle(
        "unlocked",
        unlocked
    );

    const status =
        achievement.querySelector(".achievement-status");

    status.textContent =
        unlocked ? "Unlocked ✓" : "Locked";
}

if (profileName) {
    updateProfileInterface();
}

if (playFromProfile) {
    playFromProfile.addEventListener("click", () => {
        navigateTo("index.html");
    });
}

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        const confirmed = window.confirm(
            "Do you want to log out? Your score will remain saved on this device."
        );

        if (!confirmed) {
            return;
        }

        localStorage.removeItem(STORAGE_KEYS.username);
        navigateTo("login.html");
    });
}

/* Daniel chat assistant */

const chatButton =
    document.getElementById("chatButton");
const chatWindow =
    document.getElementById("chatWindow");
const closeChat =
    document.getElementById("closeChat");
const chatForm =
    document.getElementById("chatForm");
const chatInput =
    document.getElementById("chatInput");
const chatMessages =
    document.getElementById("chatMessages");
const chatNotification =
    document.querySelector(".chat-notification");

if (chatButton && chatWindow) {
    chatButton.addEventListener("click", () => {
        chatWindow.classList.toggle("hidden");

        if (chatNotification) {
            chatNotification.classList.add("hidden");
        }

        if (!chatWindow.classList.contains("hidden")) {
            chatInput?.focus();
        }
    });
}

if (closeChat && chatWindow) {
    closeChat.addEventListener("click", () => {
        chatWindow.classList.add("hidden");
    });
}

document
    .querySelectorAll(".quick-questions button")
    .forEach((button) => {
        button.addEventListener("click", () => {
            sendQuestion(button.dataset.question);
        });
    });

if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const question = chatInput.value.trim();

        if (!question) {
            return;
        }

        sendQuestion(question);
        chatInput.value = "";
    });
}

function sendQuestion(question) {
    addChatMessage(question, "user-message");

    window.setTimeout(() => {
        const answer = getBotAnswer(question);

        addChatMessage(answer, "bot-message");
    }, 350);
}

function addChatMessage(text, messageClass) {
    if (!chatMessages) {
        return;
    }

    const message = document.createElement("div");

    message.classList.add(
        "message",
        messageClass
    );

    message.textContent = text;

    chatMessages.appendChild(message);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}

function getBotAnswer(question) {
    const text = question.toLowerCase().trim();
    const username = getStoredUsername() || "player";
    const currentScore = getStoredScore();

    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
    ) {
        return (
            `Hello, ${username}! ` +
            "How can I help you learn about the Doira?"
        );
    }

    if (
        text.includes("what is doira") ||
        text.includes("what is a doira") ||
        text.includes("что такое дойра") ||
        text.includes("что такое доира")
    ) {
        return (
            "The Doira is a traditional Central Asian frame drum. " +
            "It is especially important in Uzbek music and culture."
        );
    }

    if (
        text.includes("history") ||
        text.includes("история")
    ) {
        return (
            "The Doira has been used in Central Asia for centuries. " +
            "It is traditionally played at weddings, festivals, dances, " +
            "and cultural performances."
        );
    }

    if (
        text.includes("structure") ||
        text.includes("made of") ||
        text.includes("строение") ||
        text.includes("сделана")
    ) {
        return (
            "The Doira has a round wooden frame covered with skin or " +
            "synthetic material. Metal rings inside the frame create " +
            "its jingling sound."
        );
    }

    if (
        text.includes("played") ||
        text.includes("how to play") ||
        text.includes("playing") ||
        text.includes("играют")
    ) {
        return (
            "The Doira is played with the fingers, palms, and wrists. " +
            "Musicians strike different parts of the surface to create " +
            "high, low, soft, and powerful sounds."
        );
    }

    if (
        text.includes("culture") ||
        text.includes("important") ||
        text.includes("культура") ||
        text.includes("важна")
    ) {
        return (
            "The Doira is an important part of Uzbek cultural heritage. " +
            "It accompanies traditional music, dance, weddings, and " +
            "national celebrations."
        );
    }

    if (
        text.includes("score") ||
        text.includes("points") ||
        text.includes("балл") ||
        text.includes("очки")
    ) {
        return (
            `You currently have ${currentScore} points and your rank is ` +
            `${getRank(currentScore)}.`
        );
    }

    if (
        text.includes("golden")
    ) {
        return (
            "The Golden Doira is unlocked when you reach 100 points."
        );
    }

    if (
        text.includes("ancient")
    ) {
        return (
            "The Ancient Doira is unlocked when you reach 300 points."
        );
    }

    if (
        text.includes("bonus") ||
        text.includes("+10")
    ) {
        return (
            "Every click normally gives you 1 point. There is a 10% " +
            "chance to receive a special +10 bonus with a golden animation."
        );
    }

    if (
        text.includes("interesting fact") ||
        text.includes("fun fact") ||
        text.includes("fact")
    ) {
        const randomIndex = Math.floor(
            Math.random() * RANDOM_FACTS.length
        );

        return RANDOM_FACTS[randomIndex];
    }

    if (
        text.includes("achievement")
    ) {
        return (
            "You can unlock First Beat at 10 points, Young Musician at " +
            "100 points, and Doira Master at 500 points."
        );
    }

    if (
        text.includes("help") ||
        text.includes("what can i do")
    ) {
        return (
            "You can play the Doira Clicker, earn points, unlock facts, " +
            "collect new Doira designs, view your profile, increase your " +
            "rank, and ask me questions about Uzbek Doira culture."
        );
    }

    if (
        text.includes("bye") ||
        text.includes("goodbye") ||
        text.includes("пока")
    ) {
        return (
            "Goodbye! Keep learning and enjoy playing the Doira 😊"
        );
    }

    return (
        "I am not sure about that question yet. Try asking about the " +
        "Doira's history, structure, playing techniques, culture, score, " +
        "bonus, facts, achievements, or collection."
    );
}