// আপনার গুগল শিটের আইডি
const sheetId = '1nIO19n20c6h8_B9S1OL5d2GhCKjRlneaIKxP1XPg3vw';
const base = `https://docs.google.com/spreadsheets/d/1nIO19n20c6h8_B9S1OL5d2GhCKjRlneaIKxP1XPg3vw/tq?tqx=out:json`;

const appGrid = document.getElementById('apps');
const searchInput = document.getElementById('searchInput');
let allApps = [];

// শিট থেকে ডাটা আনা
async function fetchApps() {
    try {
        const response = await fetch(base);
        const text = await response.text();
        const data = JSON.parse(text.substr(47).slice(0, -2));
        const rows = data.table.rows;

        allApps = rows.map(row => ({
            name: row.c[0] ? row.c[0].v : '',
            icon: row.c[2] ? row.c[2].v : '',
            link: row.c[3] ? row.c[3].v : '',
            desc: row.c[1] ? row.c[1].v : 'প্রিমিয়াম অ্যাপ'
        }));

        displayApps(allApps);
    } catch (error) {
        console.error('ডাটা লোড করতে সমস্যা হয়েছে:', error);
    }
}

// অ্যাপগুলো স্ক্রিনে দেখানো
function displayApps(apps) {
    appGrid.innerHTML = '';
    apps.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <img src="${app.icon}" alt="${app.name}" class="app-icon">
            <h3 class="app-title">${app.name}</h3>
            <p class="app-desc">${app.desc}</p>
            <a href="${app.link}" class="download-btn" target="_blank">ডাউনলোড</a>
        `;
        appGrid.appendChild(card);
    });
}

// সার্চ ফাংশন
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allApps.filter(app => 
        app.name.toLowerCase().includes(term)
    );
    displayApps(filtered);
});

// লোড হওয়া শুরু
fetchApps();
