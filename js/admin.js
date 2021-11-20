// Constants
const statsURL = "http://localhost:3000/API/v1/stats";
const loginURL = "http://localhost:3000/API/v1/login";

// Selectors
const mainContainer = document.querySelector('.container');
const formContainer = document.querySelector('.formContainer');
const endpointsTable = document.querySelector('#endpointsTable');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const loginBtn = document.querySelector('#loginBtn');

// Globals
let endpoints = [];
let response = null;
let notyf = new Notyf({
    duration: 5000,
    position: {
        x: 'right',
        y: 'top',
    }
});

// Main Functions
loadEndpoints = async () => {
    response = await fetch(statsURL);
    if (response.ok) {
        endpoints = await response.json();
        endpointsTable.innerHTML = endpoints.map(stat => {
            return `
                <tr>
                    <td class="end-point">${stat.method}</td>
                    <td class="end-point">${stat.endpoint}</td>
                    <td class="end-point">${stat.requests}</td>
                </tr>
            `
        }).join('');
    };
}

handleLogin = async e => {
    e.preventDefault();

    const data = { username: usernameInput.value, password: passwordInput.value };
    response = await fetch(loginURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        const result = await response.json();
        if (result.authorized) {
            mainContainer.style.display = 'flex';
            formContainer.style.display = 'none';
            return;
        }
    }
    notyf.error('Your credentials do not match our records');
}

// Event Listeners
usernameInput.addEventListener('keyup', () => {
    loginBtn.disabled = !usernameInput.value || !passwordInput.value;
});

passwordInput.addEventListener('keyup', () => {
    loginBtn.disabled = !usernameInput.value || !passwordInput.value;
});

// Invocations
loadEndpoints();