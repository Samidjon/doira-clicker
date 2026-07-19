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

const CHAT_QUIZ_QUESTIONS = [
    {
        question: "What type of instrument is the Doira?",
        options: [
            "String instrument",
            "Percussion instrument",
            "Wind instrument"
        ],
        correct: 1
    },
    {
        question: "Which country is strongly associated with the Doira?",
        options: [
            "Uzbekistan",
            "Canada",
            "Brazil"
        ],
        correct: 0
    },
    {
        question: "What shape is the Doira usually?",
        options: [
            "Square",
            "Round",
            "Triangle"
        ],
        correct: 1
    },
    {
        question: "How is the Doira mainly played?",
        options: [
            "By blowing air",
            "With fingers and palms",
            "With a bow"
        ],
        correct: 1
    },
    {
        question: "What is the frame of the Doira commonly made from?",
        options: [
            "Wood",
            "Glass",
            "Plastic only"
        ],
        correct: 0
    },
    {
        question: "What creates the jingling sound inside the Doira?",
        options: [
            "Metal rings",
            "Strings",
            "Water"
        ],
        correct: 0
    },
    {
        question: "Where is the Doira often performed?",
        options: [
            "Weddings and celebrations",
            "Only in hospitals",
            "Only in offices"
        ],
        correct: 0
    },
    {
        question: "Which parts of the hands are used to play the Doira?",
        options: [
            "Fingers and palms",
            "Only elbows",
            "Only fingernails"
        ],
        correct: 0
    },
    {
        question: "The Doira belongs to which musical family?",
        options: [
            "Frame drums",
            "Flutes",
            "Violins"
        ],
        correct: 0
    },
    {
        question: "What can skilled Doira players create?",
        options: [
            "Complex rhythms",
            "Only one sound",
            "No rhythm"
        ],
        correct: 0
    },
    {
        question: "The Doira is important to which cultural heritage?",
        options: [
            "Uzbek cultural heritage",
            "Only American culture",
            "Only Australian culture"
        ],
        correct: 0
    },
    {
        question: "Can the Doira accompany singers and dancers?",
        options: [
            "Yes",
            "No",
            "Only once a year"
        ],
        correct: 0
    },
    {
        question: "What covers the wooden frame of a traditional Doira?",
        options: [
            "Skin or synthetic material",
            "Paper only",
            "Metal plates"
        ],
        correct: 0
    },
    {
        question: "What kind of sounds can different playing techniques create?",
        options: [
            "Different tones and rhythms",
            "Only silence",
            "Only one identical sound"
        ],
        correct: 0
    },
    {
        question: "Why is the Doira chatbot educational?",
        options: [
            "It teaches users about the instrument and Uzbek culture",
            "It only displays advertisements",
            "It has no learning content"
        ],
        correct: 0
    }
];

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

const CHAT_HISTORY_KEY = "doira_chat_history";

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

const clearChatHistoryButton =
    document.getElementById("clearChatHistory");

const isFullChatPage =
    document.body.classList.contains("assistant-page");


function initialiseChatPage() {
    const username = getStoredUsername() || "Player";
    const currentScore = getStoredScore();

    const headerUsername =
        document.getElementById("chatHeaderUsername");

    const chatPageScore =
        document.getElementById("chatPageScore");

    const chatPageRank =
        document.getElementById("chatPageRank");

    const chatPageDoira =
        document.getElementById("chatPageDoira");

    if (headerUsername) {
        headerUsername.textContent = username;
    }

    if (chatPageScore) {
        chatPageScore.textContent = String(currentScore);
    }

    if (chatPageRank) {
        chatPageRank.textContent = getRank(currentScore);
    }

    if (chatPageDoira) {
        chatPageDoira.textContent =
            getCurrentDoiraName();
    }

    loadChatHistory();
}


if (isFullChatPage) {
    initialiseChatPage();
}


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
    .querySelectorAll(
        ".quick-questions button, " +
        ".assistant-topic-list button, " +
        ".assistant-suggestion-grid button"
    )
    .forEach((button) => {
        button.addEventListener("click", () => {
            const question = button.dataset.question;

            if (question) {
                sendQuestion(question);
            }
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


if (clearChatHistoryButton) {
    clearChatHistoryButton.addEventListener(
        "click",
        () => {
            const confirmed = window.confirm(
                "Do you want to clear the conversation?"
            );

            if (!confirmed) {
                return;
            }

            localStorage.removeItem(CHAT_HISTORY_KEY);

            chatMessages.innerHTML = "";

            addChatMessage(
                "Conversation cleared. How can I help you?",
                "bot-message"
            );
        }
    );
}


function sendQuestion(question) {
    const normalizedQuestion =
        question.toLowerCase().trim();

    if (
        normalizedQuestion === "/clear" ||
        normalizedQuestion === "clear chat"
    ) {
        localStorage.removeItem(CHAT_HISTORY_KEY);

        if (chatMessages) {
            chatMessages.innerHTML = "";
        }

        addChatMessage(
            "Conversation cleared. How can I help you?",
            "bot-message"
        );

        return;
    }

    if (
        normalizedQuestion === "/quiz" ||
        normalizedQuestion === "start quiz" ||
        normalizedQuestion === "start the quiz"
    ) {
        addChatMessage(
            "Start the 15-question Doira quiz.",
            "user-message"
        );

        showTypingIndicator();

        window.setTimeout(() => {
            removeTypingIndicator();
            startChatQuiz();
        }, 450);

        return;
    }

    addChatMessage(
        question,
        "user-message"
    );

    showTypingIndicator();

    window.setTimeout(() => {
        removeTypingIndicator();

        const answer = getBotAnswer(question);

        addChatMessage(
            answer,
            "bot-message"
        );
    }, 500);
}


function addChatMessage(
    text,
    messageClass,
    saveToHistory = true
) {
    if (!chatMessages) {
        return;
    }

    const message =
        document.createElement("div");

    message.classList.add(
        "message",
        messageClass
    );

    message.textContent = text;

    chatMessages.appendChild(message);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

    if (saveToHistory) {
        saveChatMessage(text, messageClass);
    }

    if (isFullChatPage) {
        updateAssistantPageStats();
    }
}


function showTypingIndicator() {
    if (
        !chatMessages ||
        document.getElementById("chatTypingIndicator")
    ) {
        return;
    }

    const indicator =
        document.createElement("div");

    indicator.id = "chatTypingIndicator";
    indicator.className = "chat-typing-indicator";

    indicator.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    chatMessages.appendChild(indicator);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


function removeTypingIndicator() {
    document
        .getElementById("chatTypingIndicator")
        ?.remove();
}


function saveChatMessage(text, messageClass) {
    const history = getChatHistory();

    history.push({
        text: text,
        messageClass: messageClass
    });

    const limitedHistory =
        history.slice(-60);

    localStorage.setItem(
        CHAT_HISTORY_KEY,
        JSON.stringify(limitedHistory)
    );
}


function getChatHistory() {
    try {
        const saved =
            localStorage.getItem(CHAT_HISTORY_KEY);

        if (!saved) {
            return [];
        }

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch (error) {
        console.error(
            "Unable to read chat history:",
            error
        );

        return [];
    }
}


function loadChatHistory() {
    if (!chatMessages) {
        return;
    }

    const history = getChatHistory();

    if (history.length === 0) {
        return;
    }

    chatMessages.innerHTML = "";

    history.forEach((item) => {
        addChatMessage(
            item.text,
            item.messageClass,
            false
        );
    });
}


function updateAssistantPageStats() {
    if (!isFullChatPage) {
        return;
    }

    const currentScore = getStoredScore();

    const chatPageScore =
        document.getElementById("chatPageScore");

    const chatPageRank =
        document.getElementById("chatPageRank");

    const chatPageDoira =
        document.getElementById("chatPageDoira");

    if (chatPageScore) {
        chatPageScore.textContent =
            String(currentScore);
    }

    if (chatPageRank) {
        chatPageRank.textContent =
            getRank(currentScore);
    }

    if (chatPageDoira) {
        chatPageDoira.textContent =
            getCurrentDoiraName();
    }
}


function getNextRankInformation(currentScore) {
    if (currentScore < 100) {
        return (
            `${100 - currentScore} more points are required ` +
            "to become a Beginner Performer."
        );
    }

    if (currentScore < 200) {
        return (
            `${200 - currentScore} more points are required ` +
            "to become a Skilled Musician."
        );
    }

    if (currentScore < 500) {
        return (
            `${500 - currentScore} more points are required ` +
            "to become a Doira Master."
        );
    }

    return "You have already reached the highest rank!";
}


function getUnlockedAchievementText(currentScore) {
    const unlocked = [];

    if (currentScore >= 10) {
        unlocked.push("First Beat");
    }

    if (currentScore >= 100) {
        unlocked.push("Young Musician");
    }

    if (currentScore >= 500) {
        unlocked.push("Doira Master");
    }

    if (unlocked.length === 0) {
        return (
            "You have not unlocked an achievement yet. " +
            "Reach 10 points to unlock First Beat."
        );
    }

    return (
        `Your unlocked achievements are: ${unlocked.join(", ")}.`
    );
}


function getBotAnswer(question) {
    const text =
        question.toLowerCase().trim();

    const username =
        getStoredUsername() || "player";

    const currentScore =
        getStoredScore();

    const currentRank =
        getRank(currentScore);

    /*
     * Greeting and assistant information
     */

    if (
        text.includes("hello") ||
        text === "hi" ||
        text.includes("hey") ||
        text.includes("привет")
    ) {
        return (
            `Hello, ${username}! I am Daniel, your Doira ` +
            "cultural guide. What would you like to learn today?"
        );
    }

    if (
        text.includes("who are you") ||
        text.includes("your name") ||
        text.includes("кто ты")
    ) {
        return (
            "My name is Daniel. I am an educational assistant " +
            "created to teach users about the Uzbek Doira and " +
            "support them while playing Doira Adventure."
        );
    }

    if (
        text.includes("what can you do") ||
        text.includes("your functions") ||
        text === "help" ||
        text === "/help"
    ) {
        return (
            "I can explain the Doira's history, structure, sounds, " +
            "playing techniques, and cultural importance. I can also " +
            "show your score, rank, achievements, collection, next goal, " +
            "explain game mechanics, and start the 15-question quiz."
        );
    }

    /*
     * Doira knowledge
     */

    if (
        text.includes("what is doira") ||
        text.includes("what is a doira") ||
        text.includes("что такое дойра") ||
        text.includes("что такое доира")
    ) {
        return (
            "The Doira is a traditional Central Asian percussion " +
            "instrument. It is a round frame drum that is especially " +
            "important in Uzbek music, dance, celebrations, and culture."
        );
    }

    if (
        text.includes("history") ||
        text.includes("origin") ||
        text.includes("история")
    ) {
        return (
            "The Doira has been used in Central Asia for centuries. " +
            "It became an important part of Uzbek folk music and has " +
            "traditionally accompanied celebrations, singers, dancers, " +
            "weddings, and public cultural performances."
        );
    }

    if (
        text.includes("structure") ||
        text.includes("made of") ||
        text.includes("material") ||
        text.includes("строение") ||
        text.includes("сделана")
    ) {
        return (
            "A Doira normally consists of a circular wooden frame " +
            "covered with skin or a synthetic membrane. Small metal " +
            "rings are attached inside the frame and create an " +
            "additional jingling sound."
        );
    }

    if (
        text.includes("metal ring") ||
        text.includes("jingling") ||
        text.includes("jingle") ||
        text.includes("звен")
    ) {
        return (
            "The jingling sound comes from small metal rings attached " +
            "inside the wooden frame. They move when the musician strikes " +
            "or shakes the instrument."
        );
    }

    if (
        text.includes("sound") ||
        text.includes("tone") ||
        text.includes("звук")
    ) {
        return (
            "The Doira can produce deep palm sounds, sharp finger taps, " +
            "light rhythmic tones, and metallic jingling sounds. Different " +
            "areas of the membrane create different tones."
        );
    }

    if (
        text.includes("how is doira played") ||
        text.includes("how to play") ||
        text.includes("playing technique") ||
        text.includes("играют")
    ) {
        return (
            "The Doira is played with the fingers, palms, and wrists. " +
            "Players strike different parts of the surface and combine " +
            "soft taps, strong palm hits, finger rolls, and controlled " +
            "movements to create rhythms."
        );
    }

    if (
        text.includes("where") &&
        (
            text.includes("played") ||
            text.includes("used")
        )
    ) {
        return (
            "The Doira is commonly played at Uzbek weddings, festivals, " +
            "national celebrations, concerts, traditional dances, and " +
            "folk music performances."
        );
    }

    if (
        text.includes("culture") ||
        text.includes("important") ||
        text.includes("heritage") ||
        text.includes("культура")
    ) {
        return (
            "The Doira is an important part of Uzbek cultural heritage. " +
            "It connects music, dance, community celebrations, and national " +
            "traditions, helping preserve cultural identity for future generations."
        );
    }

    if (
        text.includes("uzbekistan") ||
        text.includes("uzbek")
    ) {
        return (
            "In Uzbekistan, the Doira is one of the best-known traditional " +
            "percussion instruments. It is widely associated with national " +
            "music, celebrations, dance, and cultural performances."
        );
    }

    if (
        text.includes("interesting fact") ||
        text.includes("random fact") ||
        text.includes("fun fact") ||
        text === "fact"
    ) {
        const randomIndex =
            Math.floor(
                Math.random() * RANDOM_FACTS.length
            );

        return RANDOM_FACTS[randomIndex];
    }

    /*
     * Game score and progress
     */

    if (
        text.includes("score") ||
        text.includes("how many points") ||
        text.includes("my points") ||
        text.includes("очки") ||
        text.includes("балл")
    ) {
        return (
            `You currently have ${currentScore} points. ` +
            `Your current rank is ${currentRank}.`
        );
    }

    if (
        text.includes("my rank") ||
        text.includes("current rank") ||
        text === "rank"
    ) {
        return (
            `Your current rank is ${currentRank}. ` +
            getNextRankInformation(currentScore)
        );
    }

    if (
        text.includes("next goal") ||
        text.includes("next rank") ||
        text.includes("progress")
    ) {
        return getNextRankInformation(currentScore);
    }

    if (
        text.includes("achievement")
    ) {
        return getUnlockedAchievementText(currentScore);
    }

    /*
     * Doira collection
     */

    if (
        text.includes("which doira") ||
        text.includes("current doira") ||
        text.includes("selected doira")
    ) {
        return (
            `You are currently using the ` +
            `${getCurrentDoiraName()} Doira.`
        );
    }

    if (
        text.includes("collection") ||
        text.includes("available doira")
    ) {
        return (
            "The collection contains the Classic Doira, Golden Doira, " +
            "and Ancient Doira. The Classic Doira is available immediately, " +
            "Golden unlocks at 100 points, and Ancient unlocks at 300 points."
        );
    }

    if (
        text.includes("golden")
    ) {
        if (currentScore >= 100) {
            return (
                "You have unlocked the Golden Doira! Open your profile " +
                "and select it from the collection."
            );
        }

        return (
            `The Golden Doira unlocks at 100 points. ` +
            `You need ${100 - currentScore} more points.`
        );
    }

    if (
        text.includes("ancient")
    ) {
        if (currentScore >= 300) {
            return (
                "You have unlocked the Ancient Doira! Open your profile " +
                "and select it from the collection."
            );
        }

        return (
            `The Ancient Doira unlocks at 300 points. ` +
            `You need ${300 - currentScore} more points.`
        );
    }

    if (
        text.includes("classic doira")
    ) {
        return (
            "The Classic Doira is the first instrument in your collection. " +
            "It is available to every player from the beginning."
        );
    }

    /*
     * Game mechanics
     */

    if (
        text.includes("bonus") ||
        text.includes("+10") ||
        text.includes("special click")
    ) {
        return (
            "A normal click gives 1 point. Each click also has a 10% chance " +
            "of giving a special +10 bonus with a golden floating animation."
        );
    }

    if (
        text.includes("save") ||
        text.includes("local storage") ||
        text.includes("progress saved")
    ) {
        return (
            "Your username, score, selected Doira, unlocked collection, " +
            "achievements, quiz completion, and chat history are saved in " +
            "your browser using Local Storage."
        );
    }

    if (
        text.includes("quiz")
    ) {
        return (
            "The educational quiz contains 15 questions. Each correct " +
            "answer gives 1 point during the first completed attempt. " +
            "Type /quiz or press Start Quiz to begin."
        );
    }

    if (
        text.includes("game") ||
        text.includes("how to play")
    ) {
        return (
            "Open the Game page and tap the Doira to earn points. " +
            "As your score increases, you unlock facts, ranks, achievements, " +
            "and new Doira designs."
        );
    }

    if (
        text.includes("profile")
    ) {
        return (
            "The Profile page shows your username, score, rank, unlocked " +
            "facts, achievements, current instrument, and Doira collection."
        );
    }

    /*
     * Conversation endings
     */

    if (
        text.includes("thank") ||
        text.includes("спасибо")
    ) {
        return (
            `You are welcome, ${username}! I am always here to help you ` +
            "learn more about the Doira."
        );
    }

    if (
        text.includes("bye") ||
        text.includes("goodbye") ||
        text.includes("see you") ||
        text.includes("пока")
    ) {
        return (
            "Goodbye! Keep learning, playing, and discovering Uzbek culture 😊"
        );
    }

    return (
        "I do not have a prepared answer for that question yet. " +
        "Try asking about Doira history, structure, sounds, playing " +
        "techniques, Uzbek culture, your score, rank, collection, " +
        "achievements, progress, bonus, quiz, or game instructions."
    );
}


/* =====================================================
   DANIEL CHAT QUIZ
===================================================== */

const CHAT_QUIZ_COMPLETED_KEY =
    "doira_chat_quiz_completed";

const CHAT_QUIZ_BEST_SCORE_KEY =
    "doira_chat_quiz_best_score";


const CHAT_QUIZ_QUESTIONS = [
    {
        question: "What type of instrument is the Doira?",
        options: [
            "String instrument",
            "Percussion instrument",
            "Wind instrument"
        ],
        correct: 1
    },
    {
        question: "Which country is strongly associated with the Doira?",
        options: [
            "Uzbekistan",
            "Canada",
            "Brazil"
        ],
        correct: 0
    },
    {
        question: "What shape is the Doira usually?",
        options: [
            "Square",
            "Round",
            "Triangle"
        ],
        correct: 1
    },
    {
        question: "How is the Doira mainly played?",
        options: [
            "By blowing into it",
            "With fingers and palms",
            "With a violin bow"
        ],
        correct: 1
    },
    {
        question: "What is the Doira frame commonly made from?",
        options: [
            "Wood",
            "Glass",
            "Stone"
        ],
        correct: 0
    },
    {
        question: "What creates the jingling sound of the Doira?",
        options: [
            "Strings",
            "Air holes",
            "Metal rings"
        ],
        correct: 2
    },
    {
        question: "Where is the Doira commonly performed?",
        options: [
            "Only in offices",
            "Weddings and cultural celebrations",
            "Only in hospitals"
        ],
        correct: 1
    },
    {
        question: "Which parts of the hand are used to play the Doira?",
        options: [
            "Fingers and palms",
            "Only the elbows",
            "Only the fingernails"
        ],
        correct: 0
    },
    {
        question: "Which musical instrument family does the Doira belong to?",
        options: [
            "String instruments",
            "Frame drums",
            "Wind instruments"
        ],
        correct: 1
    },
    {
        question: "What can experienced Doira players produce?",
        options: [
            "Only one sound",
            "Complex rhythms and different tones",
            "No rhythm"
        ],
        correct: 1
    },
    {
        question: "The Doira is an important part of which cultural heritage?",
        options: [
            "Uzbek cultural heritage",
            "Only Australian culture",
            "Only Canadian culture"
        ],
        correct: 0
    },
    {
        question: "Can the Doira accompany singers and dancers?",
        options: [
            "No",
            "Yes",
            "Only once a year"
        ],
        correct: 1
    },
    {
        question: "What covers the frame of a traditional Doira?",
        options: [
            "Paper only",
            "Skin or synthetic material",
            "Metal plates"
        ],
        correct: 1
    },
    {
        question: "Why do players strike different parts of the Doira?",
        options: [
            "To create different tones",
            "To change its colour",
            "To make it heavier"
        ],
        correct: 0
    },
    {
        question: "Why is the Daniel chatbot educational?",
        options: [
            "It only displays advertisements",
            "It teaches users about the Doira and Uzbek culture",
            "It has no educational content"
        ],
        correct: 1
    }
];


let chatQuizIndex = 0;
let chatQuizCorrectAnswers = 0;
let chatQuizEarnedPoints = 0;
let chatQuizActive = false;
let chatQuizAnswered = false;
let chatQuizRewardEnabled = true;


/*
 * Starts or restarts the quiz.
 */
function startChatQuiz() {
    const messagesContainer =
        document.getElementById("chatMessages");

    if (!messagesContainer) {
        console.error(
            "Quiz cannot start: #chatMessages was not found."
        );

        return;
    }

    if (chatQuizActive) {
        addChatMessage(
            "The quiz is already active. Please answer the current question.",
            "bot-message"
        );

        return;
    }

    chatQuizIndex = 0;
    chatQuizCorrectAnswers = 0;
    chatQuizEarnedPoints = 0;
    chatQuizActive = true;
    chatQuizAnswered = false;

    const quizAlreadyCompleted =
        localStorage.getItem(
            CHAT_QUIZ_COMPLETED_KEY
        ) === "true";

    chatQuizRewardEnabled = !quizAlreadyCompleted;

    if (chatQuizRewardEnabled) {
        addChatMessage(
            "Welcome to the Doira Quiz! There are 15 questions. You will receive +1 game point for every correct answer.",
            "bot-message"
        );
    } else {
        addChatMessage(
            "You have already completed this quiz and received its rewards. You can practise again, but additional points will not be awarded.",
            "bot-message"
        );
    }

    showChatQuizQuestion();
}


/*
 * Displays the current question inside the chat.
 */
function showChatQuizQuestion() {
    const messagesContainer =
        document.getElementById("chatMessages");

    if (
        !messagesContainer ||
        !chatQuizActive ||
        chatQuizIndex >= CHAT_QUIZ_QUESTIONS.length
    ) {
        return;
    }

    chatQuizAnswered = false;

    const currentQuestion =
        CHAT_QUIZ_QUESTIONS[chatQuizIndex];

    const quizContainer =
        document.createElement("div");

    quizContainer.className =
        "message bot-message quiz-message";

    const questionNumber =
        document.createElement("p");

    questionNumber.className =
        "quiz-question-title";

    questionNumber.textContent =
        `Question ${chatQuizIndex + 1}/${CHAT_QUIZ_QUESTIONS.length}`;

    const questionText =
        document.createElement("p");

    questionText.className =
        "quiz-question-text";

    questionText.textContent =
        currentQuestion.question;

    const optionsContainer =
        document.createElement("div");

    optionsContainer.className =
        "chat-quiz-options";

    currentQuestion.options.forEach(
        (option, optionIndex) => {
            const optionButton =
                document.createElement("button");

            optionButton.type = "button";
            optionButton.textContent = option;

            optionButton.addEventListener(
                "click",
                () => {
                    processChatQuizAnswer(
                        optionIndex,
                        quizContainer
                    );
                }
            );

            optionsContainer.appendChild(
                optionButton
            );
        }
    );

    quizContainer.appendChild(questionNumber);
    quizContainer.appendChild(questionText);
    quizContainer.appendChild(optionsContainer);

    messagesContainer.appendChild(quizContainer);

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}


/*
 * Checks the selected answer.
 */
function processChatQuizAnswer(
    selectedAnswer,
    quizContainer
) {
    if (
        !chatQuizActive ||
        chatQuizAnswered
    ) {
        return;
    }

    chatQuizAnswered = true;

    const currentQuestion =
        CHAT_QUIZ_QUESTIONS[chatQuizIndex];

    const optionButtons =
        quizContainer.querySelectorAll(
            ".chat-quiz-options button"
        );

    optionButtons.forEach((button) => {
        button.disabled = true;
    });

    const answerIsCorrect =
        selectedAnswer === currentQuestion.correct;

    if (answerIsCorrect) {
        chatQuizCorrectAnswers++;

        optionButtons[selectedAnswer]
            .classList.add("correct-answer");

        if (chatQuizRewardEnabled) {
            const newScore =
                getStoredScore() + 1;

            saveScore(newScore);

            chatQuizEarnedPoints++;

            refreshInterfaceAfterQuiz(newScore);

            addChatMessage(
                "✅ Correct! You earned +1 game point.",
                "bot-message"
            );
        } else {
            addChatMessage(
                "✅ Correct! This is a practice attempt, so no additional point was awarded.",
                "bot-message"
            );
        }
    } else {
        optionButtons[selectedAnswer]
            .classList.add("wrong-answer");

        optionButtons[currentQuestion.correct]
            .classList.add("correct-answer");

        addChatMessage(
            `❌ Incorrect. The correct answer is: ${currentQuestion.options[
            currentQuestion.correct
            ]
            }.`,
            "bot-message"
        );
    }

    chatQuizIndex++;

    if (
        chatQuizIndex <
        CHAT_QUIZ_QUESTIONS.length
    ) {
        window.setTimeout(() => {
            showChatQuizQuestion();
        }, 750);
    } else {
        window.setTimeout(() => {
            finishChatQuiz();
        }, 750);
    }
}


/*
 * Refreshes score, rank and collection after a quiz answer.
 */
function refreshInterfaceAfterQuiz(newScore) {
    unlockCollections(newScore);

    /*
     * The main game page uses the global score variable.
     * This check prevents an error on chat.html.
     */
    if (typeof score !== "undefined") {
        score = newScore;
    }

    if (
        typeof updateGameInterface === "function"
    ) {
        updateGameInterface();
    }

    if (
        typeof updateAssistantPageStats === "function"
    ) {
        updateAssistantPageStats();
    }

    if (
        typeof updateProfileInterface === "function"
    ) {
        updateProfileInterface();
    }
}


/*
 * Finishes the quiz and displays the result.
 */
function finishChatQuiz() {
    chatQuizActive = false;

    if (chatQuizRewardEnabled) {
        localStorage.setItem(
            CHAT_QUIZ_COMPLETED_KEY,
            "true"
        );
    }

    const previousBest =
        Number(
            localStorage.getItem(
                CHAT_QUIZ_BEST_SCORE_KEY
            )
        ) || 0;

    if (
        chatQuizCorrectAnswers > previousBest
    ) {
        localStorage.setItem(
            CHAT_QUIZ_BEST_SCORE_KEY,
            String(chatQuizCorrectAnswers)
        );
    }

    let resultMessage;

    if (
        chatQuizCorrectAnswers ===
        CHAT_QUIZ_QUESTIONS.length
    ) {
        resultMessage =
            "🏆 Perfect result! You are a true Doira Master!";
    } else if (chatQuizCorrectAnswers >= 11) {
        resultMessage =
            "⭐ Excellent! You know a lot about the Doira.";
    } else if (chatQuizCorrectAnswers >= 7) {
        resultMessage =
            "😊 Good job! Continue learning about the Doira.";
    } else {
        resultMessage =
            "📚 Keep learning and try the quiz again.";
    }

    const rewardMessage =
        chatQuizRewardEnabled
            ? ` You earned ${chatQuizEarnedPoints} game points.`
            : " This was a practice attempt, so no additional points were awarded.";

    addChatMessage(
        `🎉 Quiz completed! Your result is ${chatQuizCorrectAnswers}/${CHAT_QUIZ_QUESTIONS.length}.${rewardMessage} ${resultMessage}`,
        "bot-message"
    );

    addQuizRestartButton();
}


/*
 * Adds a restart button after completing the quiz.
 */
function addQuizRestartButton() {
    const messagesContainer =
        document.getElementById("chatMessages");

    if (!messagesContainer) {
        return;
    }

    const buttonContainer =
        document.createElement("div");

    buttonContainer.className =
        "message bot-message quiz-restart-message";

    const restartButton =
        document.createElement("button");

    restartButton.type = "button";
    restartButton.className =
        "quiz-restart-button";

    restartButton.textContent =
        "🔄 Try Quiz Again";

    restartButton.addEventListener(
        "click",
        () => {
            restartButton.disabled = true;
            startChatQuiz();
        }
    );

    buttonContainer.appendChild(
        restartButton
    );

    messagesContainer.appendChild(
        buttonContainer
    );

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}