// envelopes.js

let envelopes = [];

// DOM Elements
const envelopesContainer = document.getElementById('envelopes-container');
const createEnvelopeForm = document.getElementById('create-envelope-form');

// Init
async function initEnvelopes() {
    try {
        await fetchEnvelopes();
    } catch (error) {
        console.error('Error fetching envelopes:', error);
    }
}

// Fetch
async function fetchEnvelopes() {
    try {
        envelopes = await API.getEnvelopes();
        renderEnvelopes();
    } catch (error) {
        console.error(error);
        if (error.message.includes('token')) {
            // Let dashboard.js handle auth redirect if needed, or do it here
        }
    }
}

// Render
function renderEnvelopes() {
    envelopesContainer.innerHTML = '';

    if (envelopes.length === 0) {
        envelopesContainer.innerHTML = '<p>No envelopes created yet.</p>';
        return;
    }

    envelopes.forEach(env => {
        const percent = Math.min(((env.budget - env.currentAmount) / env.budget) * 100, 100);
        const remainingPercent = (env.currentAmount / env.budget) * 100;

        // Color logic: Green if > 50%, Orange if > 20%, Red if < 20%
        let color = '#27ae60';
        if (remainingPercent < 20) color = '#e74c3c';
        else if (remainingPercent < 50) color = '#f39c12';

        const card = document.createElement('div');
        card.className = 'card envelope-card';
        card.style.minWidth = '300px';
        card.style.maxWidth = '350px';

        card.innerHTML = `
            <div class="header-row" style="margin-bottom: 10px;">
                <h3 style="margin: 0; color: #34495e;">${env.name}</h3>
                <button class="btn-sm" onclick="handleDeleteEnvelope('${env._id}')" title="Delete Envelope"><i class="fas fa-trash"></i></button>
            </div>
            
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 5px;">
                    <span>Remaining: <strong>₹${env.currentAmount}</strong></span>
                    <span style="color: #7f8c8d;">Budget: ₹${env.budget}</span>
                </div>
                <div class="progress-bar-container" style="background: #eee; height: 10px;">
                    <div class="progress-bar" style="width: ${remainingPercent}%; background: ${color};"></div>
                </div>
            </div>

            <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
                <h4 style="margin: 0 0 10px 0; font-size: 0.9rem; color: #7f8c8d;">Spend from Envelope</h4>
                <div style="display: flex; gap: 10px;">
                    <input type="number" id="spend-${env._id}" placeholder="Amount" style="flex: 1; min-width: 0;">
                    <button class="btn btn-secondary" onclick="handleSpendEnvelope('${env._id}')">Spend</button>
                </div>
            </div>
        `;
        envelopesContainer.appendChild(card);
    });
}

// Create
createEnvelopeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('envelope-name').value;
    const budget = Number(document.getElementById('envelope-budget').value);

    try {
        await API.addEnvelope({ name, budget });
        createEnvelopeForm.reset();
        await fetchEnvelopes();
        alert('Envelope created successfully!');
    } catch (error) {
        alert(error.message);
    }
});

// Delete
window.handleDeleteEnvelope = async (id) => {
    if (confirm('Are you sure you want to delete this envelope?')) {
        try {
            await API.deleteEnvelope(id);
            await fetchEnvelopes();
        } catch (error) {
            alert(error.message);
        }
    }
};

// Spend
window.handleSpendEnvelope = async (id) => {
    const input = document.getElementById(`spend-${id}`);
    const amount = Number(input.value);

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    try {
        await API.spendEnvelope(id, amount);
        input.value = '';
        await fetchEnvelopes();
    } catch (error) {
        alert(error.message);
    }
};

// Initialize when tab is clicked (or on load if you want, but tab click ensures auth is ready? 
// No, auth is checked in dashboard.js. getting user from localstorage.
// dashboard.js runs init() on load. We can run initEnvelopes() on load too.
initEnvelopes();
