// Constants
const highScoresList = document.querySelector('#highScoresList');
const scoresSelect = document.querySelector('#all-my');
const categoriesSelect = document.querySelector('#categories');
const clearHighScoresBtn = document.getElementById('clearHighScoresBtn');
const uuid = localStorage.getItem('uuid');
const url = 'http://localhost:3000/API/v1/scores/';
// const url = 'https://s2api4537.azurewebsites.net/API/v1/scores';


// Globals
let highScores = [];
let response = null;
let currentScores = scoresSelect.value;
let currentCategory = categoriesSelect.value;
let notyf = new Notyf({
    duration: 5000,
    position: {
        x: 'right',
        y: 'top',
    }
});

// Helper functions
const nameValidate = (name) => !(name === '')

const checkValidUpdate = (originalValue, newValue, scoreID) => {
    if (originalValue !== newValue) updateName(scoreID, newValue);
}

const handleEnter = (originalName, newName, scoreID) => {
    if (!nameValidate(newName)) {
        notyf.error('Your name cannot be empty!')
        return false
    }
    checkValidUpdate(originalName, newName, scoreID)
}

const sortHighScores = (i, j) => j.highscore - i.highscore

const handlePaste = (event) => {
    console.log('hi');
    event.preventDefault();
    return false;
}

const handleFocus = (event) => {
    if (event.target.onpaste === null) {
        event.target.onpaste = (event) => handlePaste(event);
    }
}

const handleKeyPress = (event, scoreID) => {
    const charCode = event.keyCode;
    const defaultValue = event.target.getAttribute('data-default');
    console.log(event);

    if (event.target.onblur === null) {
        event.target.onblur = (event) => checkValidUpdate(defaultValue, event.target.innerText, scoreID);
    }

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8) return true;

    if (charCode == 13) handleEnter(defaultValue, event.target.innerText, scoreID);

    return false;
}

// Main Functions
const updateName = async (id, name) => {
    response = await fetch(url + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
    });

    if (response.ok) {
        window.location.reload();
        return;
    }

    notyf.error('Sorry, there was a problem. Try again later!')
}

const getHighScores = async () => {
    response = await fetch(url);
    if (response.ok) {
        highScores = await response.json();
        highScores.sort((i, j) => sortHighScores(i, j));
        highScoresList.innerHTML = highScores.map(score => {
            return `<li class="high-score">${score.name} - ${score.highscore}</li>`
        }).join('');
    }
}

const getFilteredScores = async category => {
    highScoresList.innerHTML = '';

    response = await fetch(`${url}categories/${category}`);
    if (response.ok) {
        highScores = await response.json();
        highScores.sort((i, j) => sortHighScores(i, j));

        highScoresList.innerHTML = highScores.map(score => {
            return `<li class="high-score">${score.name} - ${score.highscore}</li>`
        }).join('');
    }
}

const getFilteredPersonalScores = async category => {
    highScoresList.innerHTML = '';

    response = await fetch(`${url}${uuid}/${category}`);
    if (response.ok) {
        highScores = await response.json();
        highScores.sort((i, j) => sortHighScores(i, j));

        highScoresList.innerHTML = highScores.map(score => {
            return `<li class="high-score">${score.name} - ${score.highscore}</li>`
        }).join('');
    }
}

const getPersonalScores = async () => {
    response = await fetch(url + uuid)
    if (response.ok) {
        highScores = await response.json();
        highScores.sort((i, j) => sortHighScores(i, j));

        highScoresList.innerHTML = highScores.map(score => {
            return `<li class="high-score">
                        <span onfocus='return handleFocus(event)' 
                              contenteditable='true' 
                              data-default='${score.name}'
                              onkeypress='return handleKeyPress(event, ${score.id})'
                              ondragenter='return false'
                              ondragleave='return false'
                              ondragover='return false' 
                              ondrop='return false'>
                              ${score.name}</span> - ${score.highscore}
                    </li>`
        }).join('');
    }
}
// TODO
// maybe do a modal to ask if they're sure that they want to clear the scores
// TODO2
// maybe clear by category
const deletePersonalScores = async () => {
    response = await fetch(url + uuid, {
        method: 'DELETE'
    });
    if (response.ok) {
        window.location.reload();
    }
}

// Event Listeners
scoresSelect.addEventListener('change', (event) => {
    currentScores = event.target.value;

    if (event.target.value == 'All Scores' && !currentCategory) {
        clearHighScoresBtn.disabled = true;
        getHighScores();
        return;
    }

    if (event.target.value == 'My Scores' && !currentCategory) {
        clearHighScoresBtn.disabled = false;
        getPersonalScores();
        return;
    }
    if (event.target.value == 'All Scores') getFilteredScores(currentCategory);
    if (event.target.value == 'My Scores') getFilteredPersonalScores(currentCategory);
})

categoriesSelect.addEventListener('change', event => {
    currentCategory = event.target.value;

    if (currentScores == 'My Scores' && !event.target.value) {
        getPersonalScores();
        return;
    }

    if (currentScores == 'All Scores' && !event.target.value) {
        getHighScores();
        return;
    }
    if (currentScores == 'My Scores') getFilteredPersonalScores(event.target.value);
    if (currentScores == 'All Scores') getFilteredScores(event.target.value);
})

clearHighScoresBtn.addEventListener('click', deletePersonalScores);

// Invocations
getHighScores();