// Selectors
const question = document.querySelector('#question');
const choiceContainers = Array.from(document.querySelectorAll('.choice-container'));
const prefixes = Array.from(document.querySelectorAll('.choice-prefix'));
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');

// Constants
const SCORE_POINTS = 100;
const MAX_QUESTIONS = 5;

// Globals
let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
// let url = "http://localhost:3000/API/v1/questions";
let url = "https://s2api4537.azurewebsites.net/API/v1/questions";
let response = null;
let splitJwt;

startGame = async () => {
    questionCounter = 0;
    score = 0;
    splitJwt = document.cookie.split(';').pop();

    if (localStorage.getItem('category')) url += `/?category=${localStorage.getItem('category')}`;

    response = await fetch(url, {
        headers: {
            'Set-Cookie': splitJwt
        },
        credentials: 'include',
        method: 'GET'
    });
    if (response.ok) {
        questions = await response.json();
        questions.sort(() => Math.random() - 0.5);
        questions = questions.slice(0, MAX_QUESTIONS);
    }

    availableQuestions = [...questions];
    getNewQuestion();
}

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);

        return window.location.assign('./end.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;


    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerHTML = currentQuestion['choice' + number];
    })

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(SCORE_POINTS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)

            getNewQuestion();

        }, 1000)
    })
})

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}

startGame()
