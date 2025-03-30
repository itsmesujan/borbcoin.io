// Telegram Web App SDK Initialization
const telegram = window.Telegram.WebApp;
telegram.ready(); // Signal that the app is ready

// Game Variables
let score = 0;
let earnings = 0.00;
const tapValue = 0.01; // Earning per tap

// DOM Elements
const tapArea = document.getElementById('tapArea');
const scoreDisplay = document.getElementById('score');
const earningsDisplay = document.getElementById('earnings');
const sendDataButton = document.getElementById('sendDataButton');

// Tap Event Listener
tapArea.addEventListener('click', () => {
    score++;
    earnings += tapValue;
    scoreDisplay.textContent = `Score: ${score}`;
    earningsDisplay.textContent = `Earnings: ${earnings.toFixed(2)}`;
});

// Send Data to Telegram (Example)
sendDataButton.addEventListener('click', () => {
    const data = {
        score: score,
        earnings: earnings
    };

    telegram.sendData(JSON.stringify(data));
    alert("Data sent to Telegram!"); // For demonstration
});

//Set Telegram theme
document.documentElement.style.setProperty('--tg-theme-bg-color', telegram.themeParams.bg_color);
document.documentElement.style.setProperty('--tg-theme-text-color', telegram.themeParams.text_color);
document.documentElement.style.setProperty('--tg-theme-hint-color', telegram.themeParams.hint_color);
document.documentElement.style.setProperty('--tg-theme-link-color', telegram.themeParams.link_color);
document.documentElement.style.setProperty('--tg-theme-button-color', telegram.themeParams.button_color);
document.documentElement.style.setProperty('--tg-theme-button-text-color', telegram.themeParams.button_text_color);
function updateUI() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    document.getElementById('current-level').textContent = `LVL ${userData.currentLevel}/10`;
    document.getElementById('borb-balance').textContent = `${userData.borbBalance} 🪙`;
    document.getElementById('coin-balance').textContent = `${userData.coinBalance} 🐥`;
    document.getElementById('earning-rate').textContent = `${userData.earningRate}/hour`;
    document.getElementById('active-multiplier').textContent = userData.activeMultiplier;
}

function completeTask(currency, amount) {
    const userData = JSON.parse(localStorage.getItem('userData'));
    userData[`${currency}Balance`] += amount;
    localStorage.setItem('userData', JSON.stringify(userData));
    updateUI();
    alert(`Task Completed! You earned ${amount} ${currency === 'borb' ? '🪙' : '🐥'}`);
}

function handleBuyClick(event) {
    const coinPackage = event.target.closest('.coin-package');
    const price = parseFloat(coinPackage.getAttribute('data-price'));
    const coins = parseInt(coinPackage.getAttribute('data-coins'));

    // Handle the purchase logic
    if (confirm(`Do you want to buy ${coins} coins for $${price}?`)) {
        const userData = JSON.parse(localStorage.getItem('userData'));
        userData.coinBalance += coins;
        localStorage.setItem('userData', JSON.stringify(userData));
        updateUI();
        alert(`Purchase Successful! You bought ${coins} coins 🐥`);
    }
}
