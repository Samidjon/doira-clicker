"use strict";

/* =====================================================
   TELEGRAM MINI APP
===================================================== */

const telegramApp = window.Telegram?.WebApp;

if (telegramApp) {
    telegramApp.ready();
    telegramApp.expand();
}


/* =====================================================
   LOCAL STORAGE KEYS
===================================================== */

const STORAGE_KEYS = {
    username: "doira_username",
    score: "doira_score",

    currentDoira: "current_doira",
    currentDoiraName: "current_doira_name",

    goldUnlocked: "doira_gold_unlocked",
    ancientUnlocked: "doira_ancient_unlocked",

    chatHistory: "doira_chat_history",

    quizCompleted: "doira_chat_quiz_completed",
    quizBestScore: "doira_chat_quiz_best_score",
    quizRewardedQuestions: "doira_chat_quiz_rewarded_questions"
};


/* =====================================================
   DOIRA FACTS
===================================================== */

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

    "The Doira combines drum sounds with the jingling sound of metal rings.",

    "Doira performances are commonly included in Uzbek weddings and national celebrations.",

    "The wooden frame of the Doira contains small metal rings that move while the instrument is played.",

    "Skilled musicians can combine soft finger taps with powerful palm strikes.",

    "The Doira is part of the frame drum family of musical instruments.",

    "The instrument is used to accompany traditional Uzbek songs and dances."
];


/* =====================================================
   CHAT QUIZ QUESTIONS
===================================================== */

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


/* =====================================================
   GENERAL STORAGE FUNCTIONS
===================================================== */

function getStoredUsername() {
    return localStorage.getItem(STORAGE_KEYS.username);
}


function getStoredScore() {
    return Number(
        localStorage.getItem(STORAGE_KEYS.score)
    ) || 0;
}


function saveScore(newScore) {
    localStorage.setItem(
        STORAGE_KEYS.score,
        String(newScore)
    );
}


function getCurrentDoira() {
    return (
        localStorage.getItem(
            STORAGE_KEYS.currentDoira
        ) || "doira.png"
    );
}


function getCurrentDoiraName() {
    return (
        localStorage.getItem(
            STORAGE_KEYS.currentDoiraName
        ) || "Classic"
    );
}


function navigateTo(path) {
    window.location.href = path;
}


/* =====================================================
   USER ACCESS CHECK
===================================================== */

function redirectWithoutUser() {
    const currentPage =
        window.location.pathname.split("/").pop() ||
        "index.html";

    const isLoginPage =
        currentPage === "login.html";

    if (!getStoredUsername() && !isLoginPage) {
        navigateTo("login.html");
    }
}


redirectWithoutUser();


/* =====================================================
   RANK AND PROGRESS
===================================================== */

function getRank(scoreValue) {
    if (scoreValue >= 500) {
        return "🥁 Doira Master";
    }

    if (scoreValue >= 200) {
        return "⭐ Skilled Musician";
    }

    if (scoreValue >= 100) {
        return "🎵 Beginner Performer";
    }

    return "🌱 New Learner";
}


function getProgressData(scoreValue) {
    if (scoreValue < 100) {
        return {
            start: 0,
            target: 100,
            label: "Progress to Beginner Performer"
        };
    }

    if (scoreValue < 200) {
        return {
            start: 100,
            target: 200,
            label: "Progress to Skilled Musician"
        };
    }

    if (scoreValue < 500) {
        return {
            start: 200,
            target: 500,
            label: "Progress to Doira Master"
        };
    }

    return {
        start: 0,
        target: 500,
        label: "Maximum rank achieved"
    };
}


function getNextGoal(scoreValue) {
    if (scoreValue < 10) {
        return "10 points";
    }

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


function getNextRankInformation(scoreValue) {
    if (scoreValue < 100) {
        return (
            `${100 - scoreValue} more points are required ` +
            "to become a Beginner Performer."
        );
    }

    if (scoreValue < 200) {
        return (
            `${200 - scoreValue} more points are required ` +
            "to become a Skilled Musician."
        );
    }

    if (scoreValue < 500) {
        return (
            `${500 - scoreValue} more points are required ` +
            "to become a Doira Master."
        );
    }

    return "You have already reached the highest rank!";
}


function countUnlockedFacts(scoreValue) {
    return DOIRA_FACTS.filter(
        (fact) => scoreValue >= fact.points
    ).length;
}


/* =====================================================
   COLLECTION
===================================================== */

function unlockCollections(scoreValue) {
    if (scoreValue >= 100) {
        localStorage.setItem(
            STORAGE_KEYS.goldUnlocked,
            "true"
        );
    }

    if (scoreValue >= 300) {
        localStorage.setItem(
            STORAGE_KEYS.ancientUnlocked,
            "true"
        );
    }
}


/* =====================================================
   LOGIN PAGE
===================================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {
    const usernameInput =
        document.getElementById("username");

    const existingUsername =
        getStoredUsername();

    if (existingUsername && usernameInput) {
        usernameInput.value = existingUsername;
    }

    loginForm.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            const username =
                usernameInput.value.trim();

            if (!username) {
                alert("Please enter your name.");
                return;
            }

            localStorage.setItem(
                STORAGE_KEYS.username,
                username
            );

            if (
                localStorage.getItem(
                    STORAGE_KEYS.score
                ) === null
            ) {
                saveScore(0);
            }

            if (
                localStorage.getItem(
                    STORAGE_KEYS.currentDoira
                ) === null
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
        }
    );
}


/* =====================================================
   GENERAL NAVIGATION
===================================================== */

document
    .querySelectorAll("[data-link]")
    .forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                navigateTo(button.dataset.link);
            }
        );
    });


const headerProfileButton =
    document.getElementById(
        "headerProfileButton"
    );


if (headerProfileButton) {
    headerProfileButton.addEventListener(
        "click",
        () => {
            navigateTo("profile.html");
        }
    );
}


const profileFeatureCard =
    document.getElementById(
        "profileFeatureCard"
    );


if (profileFeatureCard) {
    profileFeatureCard.addEventListener(
        "click",
        () => {
            navigateTo("profile.html");
        }
    );
}


const collectionFeatureCard =
    document.getElementById(
        "collectionFeatureCard"
    );


if (collectionFeatureCard) {
    collectionFeatureCard.addEventListener(
        "click",
        () => {
            navigateTo("profile.html");
        }
    );
}


/* =====================================================
   CLICKER GAME
===================================================== */

const doira =
    document.getElementById("doira");

const scoreElement =
    document.getElementById("score");

const rankElement =
    document.getElementById("rank");

const drumSound =
    document.getElementById("drumSound");

const factBox =
    document.getElementById("factBox");

const factProgressText =
    document.getElementById(
        "factProgressText"
    );

const floatingPointsContainer =
    document.getElementById(
        "floatingPointsContainer"
    );

const progressFill =
    document.getElementById(
        "progressFill"
    );

const progressRankName =
    document.getElementById(
        "progressRankName"
    );

const progressNumbers =
    document.getElementById(
        "progressNumbers"
    );

const currentDoiraTitle =
    document.getElementById(
        "currentDoiraTitle"
    );

const headerUsername =
    document.getElementById(
        "headerUsername"
    );


let score = getStoredScore();


if (headerUsername && getStoredUsername()) {
    headerUsername.textContent =
        getStoredUsername();
}


function updateGameInterface() {
    unlockCollections(score);

    if (scoreElement) {
        scoreElement.textContent =
            String(score);
    }

    if (rankElement) {
        rankElement.textContent =
            getRank(score);
    }

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

    const progress =
        getProgressData(score);

    const completed =
        score - progress.start;

    const required =
        progress.target - progress.start;

    let percentage;

    if (score >= 500) {
        percentage = 100;
    } else {
        percentage =
            required <= 0
                ? 100
                : (completed / required) * 100;
    }

    percentage = Math.min(
        100,
        Math.max(0, percentage)
    );

    progressFill.style.width =
        `${percentage}%`;

    progressRankName.textContent =
        progress.label;

    if (score >= 500) {
        progressNumbers.textContent =
            "500 / 500";
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

    const unlockedCount =
        countUnlockedFacts(score);

    factProgressText.textContent =
        `${unlockedCount} of ${DOIRA_FACTS.length} facts unlocked`;

    if (currentFact) {
        factBox.textContent =
            currentFact.text;
    } else {
        factBox.textContent =
            "Earn 50 points to unlock your first Doira fact.";
    }
}


function createFloatingPoint(points) {
    if (!floatingPointsContainer) {
        return;
    }

    const pointElement =
        document.createElement("span");

    pointElement.className =
        points === 10
            ? "floating-point bonus-point"
            : "floating-point normal-point";

    pointElement.textContent =
        points === 10
            ? "✨ +10"
            : "+1";

    const randomHorizontal =
        Math.floor(Math.random() * 50) - 25;

    pointElement.style.left =
        `calc(50% + ${randomHorizontal}px)`;

    floatingPointsContainer.appendChild(
        pointElement
    );

    window.setTimeout(() => {
        pointElement.remove();
    }, 850);
}


function playDrumSound() {
    if (!drumSound) {
        return;
    }

    drumSound.currentTime = 0;

    const playPromise =
        drumSound.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {
            console.log(
                "Audio playback was blocked by the browser."
            );
        });
    }
}


if (doira) {
    updateGameInterface();

    doira.addEventListener("click", () => {
        const isBonus =
            Math.random() < 0.1;

        const earnedPoints =
            isBonus ? 10 : 1;

        score += earnedPoints;

        saveScore(score);
        unlockCollections(score);

        createFloatingPoint(
            earnedPoints
        );

        playDrumSound();

        doira.classList.add(
            "click-animation"
        );

        window.setTimeout(() => {
            doira.classList.remove(
                "click-animation"
            );
        }, 140);

        updateGameInterface();
        updateAssistantPageStats();
    });
}


/* =====================================================
   PROFILE PAGE
===================================================== */

const profileName =
    document.getElementById(
        "profileName"
    );

const profileInitial =
    document.getElementById(
        "profileInitial"
    );

const profileScore =
    document.getElementById(
        "profileScore"
    );

const profileRank =
    document.getElementById(
        "profileRank"
    );

const selectedDoiraName =
    document.getElementById(
        "selectedDoiraName"
    );

const factsUnlocked =
    document.getElementById(
        "factsUnlocked"
    );

const nextGoal =
    document.getElementById(
        "nextGoal"
    );

const playFromProfile =
    document.getElementById(
        "playFromProfile"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


function updateProfileInterface() {
    if (!profileName) {
        return;
    }

    const username =
        getStoredUsername() || "Player";

    const currentScore =
        getStoredScore();

    unlockCollections(currentScore);

    profileName.textContent =
        username;

    if (profileInitial) {
        profileInitial.textContent =
            username.charAt(0).toUpperCase();
    }

    if (profileScore) {
        profileScore.textContent =
            String(currentScore);
    }

    if (profileRank) {
        profileRank.textContent =
            getRank(currentScore);
    }

    if (selectedDoiraName) {
        selectedDoiraName.textContent =
            getCurrentDoiraName();
    }

    if (factsUnlocked) {
        factsUnlocked.textContent =
            `${countUnlockedFacts(currentScore)} / ${DOIRA_FACTS.length}`;
    }

    if (nextGoal) {
        nextGoal.textContent =
            getNextGoal(currentScore);
    }

    updateCollectionCards(
        currentScore
    );

    updateAchievements(
        currentScore
    );
}


function updateCollectionCards(
    currentScore
) {
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

    const currentImage =
        getCurrentDoira();

    document
        .querySelectorAll(
            "[data-doira-card]"
        )
        .forEach((card) => {
            card.classList.toggle(
                "selected",
                card.dataset.doiraCard ===
                    currentImage
            );
        });
}


function setCollectionLockState(
    imageId,
    buttonId,
    lockId,
    unlocked
) {
    const image =
        document.getElementById(imageId);

    const button =
        document.getElementById(buttonId);

    const lock =
        document.getElementById(lockId);

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
    } else {
        lock.classList.remove("hidden");
    }
}


document
    .querySelectorAll(
        ".select-doira-button"
    )
    .forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                if (button.disabled) {
                    return;
                }

                const imageName =
                    button.dataset.image;

                const doiraName =
                    button.dataset.name;

                localStorage.setItem(
                    STORAGE_KEYS.currentDoira,
                    imageName
                );

                localStorage.setItem(
                    STORAGE_KEYS.currentDoiraName,
                    doiraName
                );

                updateProfileInterface();

                alert(
                    `${doiraName} Doira selected!`
                );
            }
        );
    });


function updateAchievements(
    currentScore
) {
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


function updateAchievement(
    elementId,
    unlocked
) {
    const achievement =
        document.getElementById(
            elementId
        );

    if (!achievement) {
        return;
    }

    achievement.classList.toggle(
        "unlocked",
        unlocked
    );

    const status =
        achievement.querySelector(
            ".achievement-status"
        );

    if (status) {
        status.textContent =
            unlocked
                ? "Unlocked ✓"
                : "Locked";
    }
}


if (profileName) {
    updateProfileInterface();
}


if (playFromProfile) {
    playFromProfile.addEventListener(
        "click",
        () => {
            navigateTo("index.html");
        }
    );
}


if (logoutButton) {
    logoutButton.addEventListener(
        "click",
        () => {
            const confirmed =
                window.confirm(
                    "Do you want to log out? Your progress will remain saved."
                );

            if (!confirmed) {
                return;
            }

            localStorage.removeItem(
                STORAGE_KEYS.username
            );

            navigateTo("login.html");
        }
    );
}


/* =====================================================
   CHAT QUIZ STATE
===================================================== */

let chatQuizIndex = 0;
let chatQuizCorrectAnswers = 0;
let chatQuizEarnedPoints = 0;

let chatQuizActive = false;
let chatQuizAnswered = false;
let chatQuizRewardEnabled = true;


/* =====================================================
   QUIZ REWARD STORAGE
===================================================== */

function getRewardedQuizQuestionIndexes() {
    try {
        const saved =
            localStorage.getItem(
                STORAGE_KEYS.quizRewardedQuestions
            );

        if (!saved) {
            return [];
        }

        const parsed =
            JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch (error) {
        console.error(
            "Unable to read rewarded quiz questions:",
            error
        );

        return [];
    }
}


function saveRewardedQuizQuestionIndex(
    questionIndex
) {
    const rewarded =
        getRewardedQuizQuestionIndexes();

    if (!rewarded.includes(questionIndex)) {
        rewarded.push(questionIndex);
    }

    localStorage.setItem(
        STORAGE_KEYS.quizRewardedQuestions,
        JSON.stringify(rewarded)
    );
}


/* =====================================================
   START CHAT QUIZ
===================================================== */

function startChatQuiz() {
    const messagesContainer =
        document.getElementById(
            "chatMessages"
        );

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

    const alreadyCompleted =
        localStorage.getItem(
            STORAGE_KEYS.quizCompleted
        ) === "true";

    chatQuizRewardEnabled =
        !alreadyCompleted;

    if (chatQuizRewardEnabled) {
        addChatMessage(
            "Welcome to the Doira Quiz! There are 15 questions. You can earn +1 game point for every correct answer.",
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


/* =====================================================
   DISPLAY QUIZ QUESTION
===================================================== */

function showChatQuizQuestion() {
    const messagesContainer =
        document.getElementById(
            "chatMessages"
        );

    if (
        !messagesContainer ||
        !chatQuizActive ||
        chatQuizIndex >=
            CHAT_QUIZ_QUESTIONS.length
    ) {
        return;
    }

    chatQuizAnswered = false;

    const currentQuestion =
        CHAT_QUIZ_QUESTIONS[
            chatQuizIndex
        ];

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
                document.createElement(
                    "button"
                );

            optionButton.type = "button";
            optionButton.textContent =
                option;

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

    quizContainer.appendChild(
        questionNumber
    );

    quizContainer.appendChild(
        questionText
    );

    quizContainer.appendChild(
        optionsContainer
    );

    messagesContainer.appendChild(
        quizContainer
    );

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}


/* =====================================================
   PROCESS QUIZ ANSWER
===================================================== */

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

    const currentQuestionIndex =
        chatQuizIndex;

    const currentQuestion =
        CHAT_QUIZ_QUESTIONS[
            currentQuestionIndex
        ];

    const optionButtons =
        quizContainer.querySelectorAll(
            ".chat-quiz-options button"
        );

    optionButtons.forEach((button) => {
        button.disabled = true;
    });

    const answerIsCorrect =
        selectedAnswer ===
        currentQuestion.correct;

    if (answerIsCorrect) {
        chatQuizCorrectAnswers++;

        optionButtons[selectedAnswer]
            .classList.add(
                "correct-answer"
            );

        const rewardedQuestions =
            getRewardedQuizQuestionIndexes();

        const alreadyRewarded =
            rewardedQuestions.includes(
                currentQuestionIndex
            );

        if (
            chatQuizRewardEnabled &&
            !alreadyRewarded
        ) {
            const newScore =
                getStoredScore() + 1;

            saveScore(newScore);

            score = newScore;
            chatQuizEarnedPoints++;

            saveRewardedQuizQuestionIndex(
                currentQuestionIndex
            );

            refreshInterfaceAfterQuiz(
                newScore
            );

            addChatMessage(
                "✅ Correct! You earned +1 game point.",
                "bot-message"
            );
        } else if (
            chatQuizRewardEnabled &&
            alreadyRewarded
        ) {
            addChatMessage(
                "✅ Correct! You already received the point for this question during an earlier attempt.",
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
            .classList.add(
                "wrong-answer"
            );

        optionButtons[
            currentQuestion.correct
        ].classList.add(
            "correct-answer"
        );

        const correctText =
            currentQuestion.options[
                currentQuestion.correct
            ];

        addChatMessage(
            `❌ Incorrect. The correct answer is: ${correctText}.`,
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


/* =====================================================
   UPDATE INTERFACE AFTER QUIZ
===================================================== */

function refreshInterfaceAfterQuiz(
    newScore
) {
    score = newScore;

    unlockCollections(newScore);
    updateGameInterface();
    updateAssistantPageStats();
    updateProfileInterface();
}


/* =====================================================
   FINISH CHAT QUIZ
===================================================== */

function finishChatQuiz() {
    chatQuizActive = false;

    if (chatQuizRewardEnabled) {
        localStorage.setItem(
            STORAGE_KEYS.quizCompleted,
            "true"
        );
    }

    const previousBest =
        Number(
            localStorage.getItem(
                STORAGE_KEYS.quizBestScore
            )
        ) || 0;

    if (
        chatQuizCorrectAnswers >
        previousBest
    ) {
        localStorage.setItem(
            STORAGE_KEYS.quizBestScore,
            String(
                chatQuizCorrectAnswers
            )
        );
    }

    let resultMessage;

    if (
        chatQuizCorrectAnswers ===
        CHAT_QUIZ_QUESTIONS.length
    ) {
        resultMessage =
            "🏆 Perfect result! You are a true Doira Master!";
    } else if (
        chatQuizCorrectAnswers >= 11
    ) {
        resultMessage =
            "⭐ Excellent! You know a lot about the Doira.";
    } else if (
        chatQuizCorrectAnswers >= 7
    ) {
        resultMessage =
            "😊 Good job! Continue learning about the Doira.";
    } else {
        resultMessage =
            "📚 Keep learning and try the quiz again.";
    }

    const rewardMessage =
        chatQuizRewardEnabled
            ? `You earned ${chatQuizEarnedPoints} new game points.`
            : "This was a practice attempt, so no additional points were awarded.";

    addChatMessage(
        `🎉 Quiz completed!\n\n` +
        `Your result: ${chatQuizCorrectAnswers}/${CHAT_QUIZ_QUESTIONS.length}\n` +
        `${rewardMessage}\n\n` +
        resultMessage,
        "bot-message"
    );

    addQuizRestartButton();
}


/* =====================================================
   QUIZ RESTART BUTTON
===================================================== */

function addQuizRestartButton() {
    const messagesContainer =
        document.getElementById(
            "chatMessages"
        );

    if (!messagesContainer) {
        return;
    }

    const buttonContainer =
        document.createElement("div");

    buttonContainer.className =
        "message bot-message quiz-restart-message";

    const restartButton =
        document.createElement(
            "button"
        );

    restartButton.type = "button";

    restartButton.className =
        "quiz-restart-button";

    restartButton.textContent =
        "🔄 Try Quiz Again";

    restartButton.addEventListener(
        "click",
        () => {
            restartButton.disabled =
                true;

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


/* =====================================================
   DANIEL CHAT ASSISTANT
===================================================== */

const chatButton =
    document.getElementById(
        "chatButton"
    );

const chatWindow =
    document.getElementById(
        "chatWindow"
    );

const closeChat =
    document.getElementById(
        "closeChat"
    );

const chatForm =
    document.getElementById(
        "chatForm"
    );

const chatInput =
    document.getElementById(
        "chatInput"
    );

const chatMessages =
    document.getElementById(
        "chatMessages"
    );

const chatNotification =
    document.querySelector(
        ".chat-notification"
    );

const clearChatHistoryButton =
    document.getElementById(
        "clearChatHistory"
    );

const isFullChatPage =
    document.body.classList.contains(
        "assistant-page"
    );


function initialiseChatInterface() {
    if (!chatMessages) {
        return;
    }

    updateAssistantPageStats();
    loadChatHistory();
}


function updateAssistantPageStats() {
    const currentScore =
        getStoredScore();

    const chatHeaderUsername =
        document.getElementById(
            "chatHeaderUsername"
        );

    const chatPageScore =
        document.getElementById(
            "chatPageScore"
        );

    const chatPageRank =
        document.getElementById(
            "chatPageRank"
        );

    const chatPageDoira =
        document.getElementById(
            "chatPageDoira"
        );

    if (chatHeaderUsername) {
        chatHeaderUsername.textContent =
            getStoredUsername() ||
            "Player";
    }

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


if (chatMessages) {
    initialiseChatInterface();
}


if (chatButton && chatWindow) {
    chatButton.addEventListener(
        "click",
        () => {
            chatWindow.classList.toggle(
                "hidden"
            );

            if (chatNotification) {
                chatNotification.classList.add(
                    "hidden"
                );
            }

            if (
                !chatWindow.classList.contains(
                    "hidden"
                )
            ) {
                chatInput?.focus();
            }
        }
    );
}


if (closeChat && chatWindow) {
    closeChat.addEventListener(
        "click",
        () => {
            chatWindow.classList.add(
                "hidden"
            );
        }
    );
}


/* =====================================================
   CHAT SUGGESTION BUTTONS
===================================================== */

document
    .querySelectorAll(
        ".quick-questions button, " +
        ".assistant-topic-list button, " +
        ".assistant-suggestion-grid button"
    )
    .forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                const question =
                    button.dataset.question;

                if (question) {
                    sendQuestion(question);
                }
            }
        );
    });


/* =====================================================
   CHAT FORM
===================================================== */

if (chatForm) {
    chatForm.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            const question =
                chatInput.value.trim();

            if (!question) {
                return;
            }

            sendQuestion(question);

            chatInput.value = "";
        }
    );
}


/* =====================================================
   CLEAR CHAT
===================================================== */

if (clearChatHistoryButton) {
    clearChatHistoryButton.addEventListener(
        "click",
        () => {
            const confirmed =
                window.confirm(
                    "Do you want to clear the conversation?"
                );

            if (!confirmed) {
                return;
            }

            clearChatHistory();
        }
    );
}


function clearChatHistory() {
    localStorage.removeItem(
        STORAGE_KEYS.chatHistory
    );

    if (chatMessages) {
        chatMessages.innerHTML = "";
    }

    addChatMessage(
        "Conversation cleared. How can I help you?",
        "bot-message"
    );
}


/* =====================================================
   SEND QUESTION
===================================================== */

function sendQuestion(question) {
    const normalizedQuestion =
        question.toLowerCase().trim();

    if (
        normalizedQuestion === "/clear" ||
        normalizedQuestion ===
            "clear chat"
    ) {
        clearChatHistory();
        return;
    }

    if (
        normalizedQuestion === "/quiz" ||
        normalizedQuestion ===
            "start quiz" ||
        normalizedQuestion ===
            "start the quiz"
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

        const answer =
            getBotAnswer(question);

        addChatMessage(
            answer,
            "bot-message"
        );
    }, 500);
}


/* =====================================================
   CHAT MESSAGES
===================================================== */

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
        saveChatMessage(
            text,
            messageClass
        );
    }

    if (isFullChatPage) {
        updateAssistantPageStats();
    }
}


/* =====================================================
   TYPING INDICATOR
===================================================== */

function showTypingIndicator() {
    if (
        !chatMessages ||
        document.getElementById(
            "chatTypingIndicator"
        )
    ) {
        return;
    }

    const indicator =
        document.createElement("div");

    indicator.id =
        "chatTypingIndicator";

    indicator.className =
        "chat-typing-indicator";

    indicator.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    chatMessages.appendChild(
        indicator
    );

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


function removeTypingIndicator() {
    document
        .getElementById(
            "chatTypingIndicator"
        )
        ?.remove();
}


/* =====================================================
   CHAT HISTORY
===================================================== */

function saveChatMessage(
    text,
    messageClass
) {
    const history =
        getChatHistory();

    history.push({
        text,
        messageClass
    });

    const limitedHistory =
        history.slice(-60);

    localStorage.setItem(
        STORAGE_KEYS.chatHistory,
        JSON.stringify(
            limitedHistory
        )
    );
}


function getChatHistory() {
    try {
        const saved =
            localStorage.getItem(
                STORAGE_KEYS.chatHistory
            );

        if (!saved) {
            return [];
        }

        const parsed =
            JSON.parse(saved);

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

    const history =
        getChatHistory();

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


/* =====================================================
   ACHIEVEMENT RESPONSE
===================================================== */

function getUnlockedAchievementText(
    currentScore
) {
    const unlocked = [];

    if (currentScore >= 10) {
        unlocked.push("First Beat");
    }

    if (currentScore >= 100) {
        unlocked.push(
            "Young Musician"
        );
    }

    if (currentScore >= 500) {
        unlocked.push(
            "Doira Master"
        );
    }

    if (unlocked.length === 0) {
        return (
            "You have not unlocked an achievement yet. " +
            "Reach 10 points to unlock First Beat."
        );
    }

    return (
        `Your unlocked achievements are: ` +
        `${unlocked.join(", ")}.`
    );
}


/* =====================================================
   DANIEL ANSWERS
===================================================== */

function getBotAnswer(question) {
    const text =
        question.toLowerCase().trim();

    const username =
        getStoredUsername() ||
        "player";

    const currentScore =
        getStoredScore();

    const currentRank =
        getRank(currentScore);


    /* Greeting */

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


    /* Assistant identity */

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


    /* Assistant functions */

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


    /* What is Doira */

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


    /* History */

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


    /* Structure */

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


    /* Metal rings */

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


    /* Doira sounds */

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


    /* Playing techniques */

    if (
        text.includes("how is doira played") ||
        text.includes("how to play doira") ||
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


    /* Performances */

    if (
        (
            text.includes("where") &&
            text.includes("played")
        ) ||
        text.includes("performances") ||
        text.includes("celebrations")
    ) {
        return (
            "The Doira is commonly played at Uzbek weddings, festivals, " +
            "national celebrations, concerts, traditional dances, and " +
            "folk music performances."
        );
    }


    /* Cultural importance */

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


    /* Uzbekistan */

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


    /* Random fact */

    if (
        text.includes("interesting fact") ||
        text.includes("random fact") ||
        text.includes("fun fact") ||
        text === "fact"
    ) {
        const randomIndex =
            Math.floor(
                Math.random() *
                RANDOM_FACTS.length
            );

        return RANDOM_FACTS[
            randomIndex
        ];
    }


    /* Score */

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


    /* Rank */

    if (
        text.includes("my rank") ||
        text.includes("current rank") ||
        text === "rank"
    ) {
        return (
            `Your current rank is ${currentRank}. ` +
            getNextRankInformation(
                currentScore
            )
        );
    }


    /* Next goal */

    if (
        text.includes("next goal") ||
        text.includes("next rank") ||
        text.includes("progress")
    ) {
        return getNextRankInformation(
            currentScore
        );
    }


    /* Achievements */

    if (
        text.includes("achievement")
    ) {
        return getUnlockedAchievementText(
            currentScore
        );
    }


    /* Current Doira */

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


    /* Collection */

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


    /* Golden Doira */

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
            "The Golden Doira unlocks at 100 points. " +
            `You need ${100 - currentScore} more points.`
        );
    }


    /* Ancient Doira */

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
            "The Ancient Doira unlocks at 300 points. " +
            `You need ${300 - currentScore} more points.`
        );
    }


    /* Classic Doira */

    if (
        text.includes("classic doira")
    ) {
        return (
            "The Classic Doira is the first instrument in your collection. " +
            "It is available to every player from the beginning."
        );
    }


    /* Bonus */

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


    /* Saving progress */

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


    /* Quiz information */

    if (
        text.includes("quiz")
    ) {
        return (
            "The educational quiz contains 15 questions. Each correct " +
            "answer can give 1 game point during the first rewarded attempt. " +
            "Type /quiz or press Start Quiz to begin."
        );
    }


    /* Game instructions */

    if (
        text.includes("game") ||
        text.includes("clicker")
    ) {
        return (
            "Open the Game page and tap the Doira to earn points. " +
            "As your score increases, you unlock facts, ranks, achievements, " +
            "and new Doira designs."
        );
    }


    /* Profile */

    if (
        text.includes("profile")
    ) {
        return (
            "The Profile page shows your username, score, rank, unlocked " +
            "facts, achievements, current instrument, and Doira collection."
        );
    }


    /* Thanks */

    if (
        text.includes("thank") ||
        text.includes("спасибо")
    ) {
        return (
            `You are welcome, ${username}! I am always here to help you ` +
            "learn more about the Doira."
        );
    }


    /* Goodbye */

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


    /* Unknown question */

    return (
        "I do not have a prepared answer for that question yet. " +
        "Try asking about Doira history, structure, sounds, playing " +
        "techniques, Uzbek culture, your score, rank, collection, " +
        "achievements, progress, bonus, quiz, or game instructions."
    );
}