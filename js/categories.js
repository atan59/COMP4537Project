// Constants
const javascriptBtn = document.getElementById('javascript-btn');
const htmlBtn = document.getElementById('html-btn');
const cssBtn = document.getElementById('css-btn');
const linuxBtn = document.getElementById('linux-btn');
const dockerBtn = document.getElementById('docker-btn');
const pythonBtn = document.getElementById('python-btn');
const mixedBtn = document.getElementById('mixed-btn');

sendCategory = category => {
    localStorage.clear();
    console.log('hi');
    console.log(category);
    if (category !== '') localStorage.setItem('category', category);
}

// Event Listeners
javascriptBtn.addEventListener('click', () => sendCategory('JavaScript'));
htmlBtn.addEventListener('click', () => sendCategory('HTML'));
cssBtn.addEventListener('click', () => sendCategory('CSS'));
linuxBtn.addEventListener('click', () => sendCategory('Linux'));
dockerBtn.addEventListener('click', () => sendCategory('Docker'));
pythonBtn.addEventListener('click', () => sendCategory('Python'));
mixedBtn.addEventListener('click', () => sendCategory(''));
