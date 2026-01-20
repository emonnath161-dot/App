/**
 * NexGen App Store - Google Sheets Integrated System
 */

// ১. আপনার সঠিক শিট আইডি
const SHEET_ID = '1nIO19n20c6h8_B9S1OL5d2GhCKjRlneaIKxP1XPg3vw'; 

// ২. শিট ইউআরএল (এখানেই আপনার ভুল ছিল, এখন এটি ঠিক করা হয়েছে)
const sheetURL = `https://docs.google.com/spreadsheets/d/1nIO19n20c6h8_B9S1OL5d2GhCKjRlneaIKxP1XPg3vw/tq?tqx=out:json`;

let allApps = [];

// ডাটা লোড করার ফাংশন
async function fetchSheetData() {
    try {
        const response = await fetch(sheetURL);
        const text = await response.text();
        
        // গুগল শিটের JSON ডাটা ক্লিন করা
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        const jsonData = JSON.parse(text.substring(start, end + 1));
        const rows = jsonData.table.rows;
        
        allApps = rows.map(row => ({
            name: row.c[0] ? String(row.c[0].v) : '',
            desc: row.c[1] ? String(row.c[1].v) : 'প্রিমিয়াম অ্যাপ',
            icon: row.c[2] ? String(row.c[2].v) : 'https://cdn-icons-png.flaticon.com/512/252/252232.png',
            link: row.c[3] ? String(row.c[3].v) : '#',
            badge: row.c[4] ? String(row.c[4].v) : 'NEW'
        })).filter(app => app.name && app.name.length > 0);

        displayApps(allApps);
    } catch (error) {
        console.error("Error fetching data:", error);
        const appGrid = document.getElementById('apps');
        if(appGrid) {
            appGrid.innerHTML = "<p style='color:red; text-align:center; grid-column: 1/-1;'>ডাটা লোড করতে ব্যর্থ! শিটটি Public করা আছে কিনা চেক করুন।</p>";
        }
    }
}

// অ্যাপগুলো গ্রিডে দেখানো
function displayApps(apps) {
    const appGrid = document.getElementById('apps'); 
    if(!appGrid) return;
    appGrid.innerHTML = "";

    if (apps.length === 0) {
        appGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #66fcf1;'>কোনো অ্যাপ পাওয়া যায়নি!</p>";
        return;
    }

    apps.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <img src="${app.icon}" alt="${app.name}" class="app-icon" onerror="this.src='https://cdn-icons-png.flaticon.com/512/252/252232.png'">
            <div class="app-title">${app.name}</div>
            <div class="app-desc">${app.desc}</div>
            <a href="${app.link}" class="download-btn" target="_blank">DOWNLOAD</a>
        `;
        appGrid.appendChild(card);
    });
}

// সার্চ ফাংশন
const searchInput = document.getElementById('searchInput');
if(searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filteredApps = allApps.filter(app => 
            app.name.toLowerCase().includes(query) || 
            app.desc.toLowerCase().includes(query)
        );
        displayApps(filteredApps);
    });
}

// ওয়েবসাইট লোড হলে কাজ শুরু হবে
document.addEventListener('DOMContentLoaded', fetchSheetData);
