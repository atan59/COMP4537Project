// Constants
const highScoresList = document.querySelector('#highScoresList');
const allScoresDiv = document.querySelector('.all');
const myScoresDiv = document.querySelector('.my');
const uuid = localStorage.getItem('uuid');
// const url = 'http://localhost:3000/API/v1/scores';
// const url = 'https://s2api4537.azurewebsites.net/API/v1/scores';


// Globals
let highScores = [];
let response = null;

const getHighScores = async () => {
    response = await fetch(url);
    if (response.ok) {
        allScoresBtn.focus();
        highScores = await response.json();

        highScoresList.innerHTML = highScores.map(score => {
            return `<li class="high-score">${score.name} - ${score.highscore}</li>`
        }).join('');
    }
}

const getFilteredScores = async category => {
    // Implement Server API
    console.log(category);
}

const getFilteredPersonalScores = async category => {
    // Implement Server API
    console.log(category);
}

const getPersonalScores = async () => {
    const data = { uuid: uuid }

    response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        highScores = await response.json();

        highScoresList.innerHTML = highScores.map(score => {
            return `<li class="high-score">${score.name} - ${score.highscore}</li>`
        }).join('');
    }
}

// Event Listeners
allScoresBtn.addEventListener('click', getHighScores);
myScoresBtn.addEventListener('click', getPersonalScores);

Array.from(allScoresDiv.children).forEach(a => {
    a.addEventListener('click', () => {
        getFilteredScores(a.innerText)
    });
})

Array.from(myScoresDiv.children).forEach(a => {
    a.addEventListener('click', () => {
        getFilteredPersonalScores(a.innerText);
    })
})

// Invocations
getHighScores();