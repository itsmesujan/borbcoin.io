// script.js (Partial)
const telegram = window.Telegram.WebApp;
telegram.ready();

let userId; // Telegram User ID
let coinBalance = 0; // In Nexol Coins
let referralCode;

// DOM Elements
const coinBalanceDisplay = document.getElementById('coinBalance');
const tapArea = document.getElementById('tapArea');
const referralLinkInput = document.getElementById('referralLink');
const copyReferralButton = document.getElementById('copyReferral');
const eventListDiv = document.getElementById('eventList');
const withdrawButton = document.getElementById('withdrawButton');

// API Endpoint (Replace with your actual backend URL)
const API_BASE_URL = 'YOUR_BACKEND_URL';

// Get User Data (on app launch)
async function loadUserData() {
    userId = telegram.initDataUnsafe.user.id; // Get Telegram User ID (Important!)
    referralCode = generateReferralCode(userId);
    referralLinkInput.value = `${window.location.href}?ref=${referralCode}`; // Assuming a simple query parameter

    try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`);
        const data = await response.json();
        coinBalance = data.coinBalance || 0; // Initialize if user doesn't exist
    } catch (error) {
        console.error("Error loading user data:", error);
    }

    coinBalanceDisplay.textContent = `Balance: ${coinBalance} Nexol Coins`;
    loadEvents(); // Load events after user data
}

// Tap to Earn
tapArea.addEventListener('click', async () => {
    coinBalance++; // Simulate earning Nexol Coins
    coinBalanceDisplay.textContent = `Balance: ${coinBalance} Nexol Coins`;

    // Send updated balance to the backend
    try {
        await fetch(`${API_BASE_URL}/user/${userId}`, {
            method: 'PUT', // Or PATCH
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ coinBalance: coinBalance })
        });
    } catch (error) {
        console.error("Error updating Nexol Coin balance:", error);
    }
});

// Generate Referral Code
function generateReferralCode(userId) {
    // A simple example (you might want a more robust method)
    return btoa(userId); // Base64 encode the user ID
}

// Load Events from the backend
async function loadEvents() {
    try {
        const response = await fetch(`${API_BASE_URL}/events`);
        const events = await response.json();

        eventListDiv.innerHTML = ''; // Clear existing events
        events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.innerHTML = `
                <h3>${event.name}</h3>
                <p>${event.description}</p>
                <button class="completeEvent" data-event-id="${event.id}">Complete Event</button>
            `;
            eventListDiv.appendChild(eventDiv);
        });

         // Event completion logic
         document.querySelectorAll('.completeEvent').forEach(button => {
            button.addEventListener('click', async (event) => {
                const eventId = event.target.dataset.eventId;

                try {
                    //Simulate user completing the event
                    coinBalance += 10; // Reward is also in Nexol Coins.
                    coinBalanceDisplay.textContent = `Balance: ${coinBalance} Nexol Coins`;

                    // Send updated balance to the backend
                    await fetch(`${API_BASE_URL}/user/${userId}`, {
                        method: 'PUT', // Or PATCH
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ coinBalance: coinBalance })
                    });

                    // Send event completion notification to backend
                    await fetch(`${API_BASE_URL}/eventComplete`, {
                        method: 'POST', // Or PATCH
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userID: userId, eventID: eventId })
                    });
                } catch (error) {
                    console.error("Error completing event:", error);
                }
            });
        });

    } catch (error) {
        console.error("Error loading events:", error);
    }
}

copyReferralButton.addEventListener('click', () => {
    referralLinkInput.select();
    document.execCommand('copy');
    alert('Referral link copied!');
});

withdrawButton.addEventListener('click', async () => {
    const walletAddress = prompt("Enter your wallet address to withdraw Nexol Coins:");
    if (walletAddress) {
        try {
            const response = await fetch(`${API_BASE_URL}/withdraw`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId, address: walletAddress, amount: coinBalance })
            });
            const data = await response.json();
            if (data.success) {
                alert("Withdrawal request for Nexol Coins submitted successfully!");
            } else {
                alert("Withdrawal failed: " + data.message);
            }
        } catch (error) {
            console.error("Error during withdrawal:", error);
            alert("Withdrawal failed. Please try again later.");
        }
    } else {
        alert("Wallet address is required to withdraw Nexol Coins.");
    }
});

loadUserData();
