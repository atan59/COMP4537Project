// const getTokenURL = "http://localhost:3000/API/v1/token";
const getTokenURL = "https://s2api4537.azurewebsites.net/API/v1/token";
let splitJwt;

// get player token on init
getPlayerToken = async () => {
    response = await fetch(getTokenURL);
    if (response.ok) {
        const result = await response.json(); 
        let playerjwt = result.playerjwt;
        splitJwt = playerjwt.split(';').pop();
        document.cookie = splitJwt;
        return;   
    }
}


// Helper Functions
const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// Main Functions
const setUUID = () => {
    if (!localStorage.getItem('uuid')) {
        localStorage.setItem('uuid', uuidv4());
    }
}

// Invocations
getPlayerToken();
setUUID();