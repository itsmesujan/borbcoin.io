document.addEventListener('DOMContentLoaded', function() {
    // Initialize user data
    initializeUserData();

    // Update UI with user data
    updateUI();

    // Add event listeners for task buttons
    document.getElementById('check-in-button').addEventListener('click', () => completeTask('borb', 100));
    document.getElementById('join-telegram-button').addEventListener('click', () => completeTask('borb', 500));
    document.getElementById('join-premium-telegram-button').addEventListener('click', () => completeTask('borb', 1000));
    document.getElementById('follow-facebook-button').addEventListener('click', () => completeTask('borb', 300));
    document.getElementById('follow-twitter-button').addEventListener('click', () => completeTask('borb', 300));
    document.getElementById('follow-instagram-button').addEventListener('click', () => completeTask('borb', 300));

    // Add event listeners for buy buttons
    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
        button.addEventListener('click', handleBuyClick);
    });
});

function initializeUserData() {
    if (!localStorage.getItem('userData')) {
        const initialData = {
            currentLevel: 4,
            borbBalance: 115,
            coinBalance: 100390,
            earningRate: 200,
            activeMultiplier: '2x'
        };
        localStorage.setItem('userData', JSON.stringify(initialData));
    }
}

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
