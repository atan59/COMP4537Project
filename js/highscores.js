// Constants
const highScoresTable = document.querySelector('#scoresBody');
const tableHeaders = document.querySelector('#tableHeaders');
const scoresSelect = document.querySelector('#all-my');
const categoriesSelect = document.querySelector('#categories');
const clearScoresBtn = document.getElementById('clearScoresBtn');
const uuid = localStorage.getItem('uuid');
const url = 'http://localhost:3000/API/v1/scores/';
const MAX_CHARS = 20;
// const url = 'https://s2api4537.azurewebsites.net/API/v1/scores';

// Globals
let highScores = [];
let response = null;
let currentScores = scoresSelect.value;
let currentCategory = categoriesSelect.value;
let editState = false;
let notyf = new Notyf({
    duration: 5000,
    position: {
        x: 'right',
        y: 'top',
    }
});
let splitJwt;  // getting the cookie token, formatting it
splitJwt = document.cookie.split(';').pop();

// Helper functions
const nameValidate = (name) => !(name === '')

const lettersOnly = (event) => /[a-z]/i.test(event.key)

const checkValidUpdate = (originalValue, newValue, scoreID) => {
    if (!nameValidate(newValue)) {
        notyf.error('Your name cannot be empty!')
        return false
    }

    if (!/^[A-Za-z]+$/.test(newValue)) {
        notyf.error('Stop injecting our site!')
        return false
    }

    if (originalValue !== newValue) {
        updateName(scoreID, newValue);
        return true;
    };

    return false;
}

const sortHighScores = (i, j) => j.highscore - i.highscore

const setEditState = (tr, originalValue, children) => {
    tr.innerHTML = `
        <input type="text" 
               class="editScoreField"
               maxlength="${MAX_CHARS}"
               onpaste="return false"
               ondrop="return false"
               onkeypress="return lettersOnly(event)"
               value='${originalValue}'/>
        <td class="high-score">${children[1].innerText}</td>
        <td class="high-score">${children[2].innerText}</td>
        <td class="high-score"><a href="#" class="done"><i class="fas fa-check-square"></i></a></td>
    `
    editState = true;
}

const revertEditState = (tr, score) => {
    tr.innerHTML = `
        <td class="high-score">${score.name}</td>
        <td class="high-score">${score.highscore}</td>
        <td class="high-score">${score.category}</td>
        <td class="high-score"><a href="#" onclick='handleEdit(event, ${JSON.stringify(score)})'><i class="fas fa-edit"></i></a></td>
    `;
    editState = false;
}

const handleEdit = (event, score) => {
    const tr = event.target.parentNode.parentNode.parentNode;
    const tdArr = tr.children;
    const originalValue = tdArr[0].innerText;

    if (editState) return;

    setEditState(tr, originalValue, tdArr);

    const input = document.querySelector('.editScoreField');
    const checkMark = document.querySelector('.done');

    checkMark.addEventListener('click', () => {
        if (!checkValidUpdate(originalValue, input.value, score.id)) {
            revertEditState(tr, score);
        }
    })
}

// Main Functions
const updateName = async (id, name) => {
    response = await fetch(url + id, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': splitJwt
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
    response = await fetch(url, {
        headers: {
            'Set-Cookie': splitJwt
        },
        credentials: 'include',
        method: 'GET'
    });
    if (response.ok) {
        highScores = await response.json();
        highScores.sort((i, j) => sortHighScores(i, j));

        if (tableHeaders.childElementCount === 4) tableHeaders.removeChild(tableHeaders.lastChild);
        highScoresTable.innerHTML = highScores.map(score => {
            return `
                <tr>
                    <td class="high-score">${score.name}</td>
                    <td class="high-score">${score.highscore}</td>
                    <td class="high-score">${score.category}</td>
                </tr>
            `
        }).join('');
    }
}

const getFilteredScores = async category => {
    highScoresTable.innerHTML = '';

    response = await fetch(`${url}categories/${category}`, {
        headers: {
            'Set-Cookie': splitJwt
        },
        credentials: 'include',
        method: 'GET'
    });
    if (response.ok) {
        highScores = await response.json();
        highScores.sort((i, j) => sortHighScores(i, j));

        if (tableHeaders.childElementCount === 4) tableHeaders.removeChild(tableHeaders.lastChild);
        highScoresTable.innerHTML = highScores.map(score => {
            return `
                <tr>
                    <td class="high-score">${score.name}</td>
                    <td class="high-score">${score.highscore}</td>
                    <td class="high-score">${score.category}</td>
                </tr>
            `
        }).join('');
    }
}

const getFilteredPersonalScores = async category => {
    highScoresTable.innerHTML = '';

    response = await fetch(`${url}${uuid}/${category}`, {
        headers: {
            'Set-Cookie': splitJwt
        },
        credentials: 'include',
        method: 'GET'
    });
    if (response.ok) {
        highScores = await response.json();
        highScores.sort((i, j) => sortHighScores(i, j));

        if (tableHeaders.childElementCount !== 4) tableHeaders.innerHTML += '<th></th>';
        highScoresTable.innerHTML = highScores.map(score => {
            return `
                <tr>
                    <td class="high-score">${score.name}</td>
                    <td class="high-score">${score.highscore}</td>
                    <td class="high-score">${score.category}</td>
                    <td class="high-score"><a href="#" onclick='handleEdit(event, ${JSON.stringify(score)})'><i class="fas fa-edit"></i></a></td>
                </tr>
            `
        }).join('');
    }
}

const getPersonalScores = async () => {
    response = await fetch(url + uuid, {
        headers: {
            'Set-Cookie': splitJwt
        },
        credentials: 'include',
        method: 'GET'
    })
    if (response.ok) {
        highScores = await response.json();
        highScores.sort((i, j) => sortHighScores(i, j));

        if (tableHeaders.childElementCount !== 4) tableHeaders.innerHTML += '<th></th>';
        highScoresTable.innerHTML = highScores.map(score => {
            return `
                <tr>
                    <td class="high-score">${score.name}</td>
                    <td class="high-score">${score.highscore}</td>
                    <td class="high-score">${score.category}</td>
                    <td class="high-score"><a href="#" onclick='handleEdit(event, ${JSON.stringify(score)})'><i class="fas fa-edit"></i></a></td>
                </tr>
            `
        }).join('');
    }
}

const deletePersonalScores = async (category) => {
    let requestURL = url + uuid;

    if (category) requestURL += `/${category}`

    response = await fetch(requestURL, {
        headers: {
            'Set-Cookie': splitJwt
        },
        credentials: 'include',
        method: 'DELETE'
    });
    if (response.ok) {
        window.location.reload();
    }
}

// Event Listeners
scoresSelect.addEventListener('change', (event) => {
    currentScores = event.target.value;
    editState = false;

    if (event.target.value == 'All Scores') clearScoresBtn.disabled = true;
    if (event.target.value == 'My Scores') clearScoresBtn.disabled = false;

    if (event.target.value == 'All Scores' && !currentCategory) {
        getHighScores();
        return;
    }

    if (event.target.value == 'My Scores' && !currentCategory) {
        getPersonalScores();
        return;
    }
    if (event.target.value == 'All Scores') getFilteredScores(currentCategory);
    if (event.target.value == 'My Scores') getFilteredPersonalScores(currentCategory);
})

categoriesSelect.addEventListener('change', event => {
    currentCategory = event.target.value;
    editState = false;

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

clearScoresBtn.addEventListener('click', () => deletePersonalScores(currentCategory));

// Invocations
getHighScores();