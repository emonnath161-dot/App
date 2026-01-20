/**
 * NexGen App Store - Final Published Data System
 */

// আপনার পাবলিশ করা শিটের নতুন আইডি এবং লিঙ্ক
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUeFjb_jJoyCgoLll-7QbRlnOKGXVX9Y-FiHrW23UW1E2XVBYifT6Z5-NCQJMzhWfL-dWw2Lbk_b4I/pub?output=csv';

let allApps = [];

async function fetchSheetData() {
    try {
        const response = await fetch(SHEET_URL);
        const csvData = await response.text();
        
        // CSV ডাটাকে রো (Row) অনুযায়ী ভাগ করা
        const rows = csvData.split('\n').slice(1); 
        
        allApps = rows.map(row => {
            // কমা দিয়ে ৫টি কলাম আলাদা করা (Name, Desc, Icon, Link, Badge)
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
            return {
                name: cols[0] ? cols[0].replace(/"/g, '').trim() : '',
                desc: cols[1] ? cols[1].replace(/"/g, '').trim() : 'Premium App',
                icon: cols[2] ? cols[2].replace(/"/g, '').trim() : 'https://cdn-icons-png.flaticon.com/512/252/252232.png',
                link: cols[3] ? cols[3].replace(/"/g, '').trim() : '#',
                badge: cols[4] ? cols[4].replace(/"/g, '').trim() : 'NEW'
            };
        }).filter(app => app.name && app.name.length > 0);

        displayApps(allApps);
    } catch (error) {
        console.error("Fetch Error:", error);
        const appGrid = document.getElementById('apps');
        if(appGrid) appGrid.innerHTML = "<p style='color:red; text-align:center; padding:20px;'>ডাটা লোড হচ্ছে না!</p>";
    }
}

function displayApps(apps) {
    const appGrid = document.getElementById('apps'); 
    if(!appGrid) return;
    appGrid.innerHTML = "";

    apps.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.style.position = 'relative'; 
        card.innerHTML = `
            <span class="badge" style="position: absolute; top: 10px; right: 10px; background: #66fcf1; color: #000; font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: bold; z-index: 10;">${app.badge}</span>
            <img src="${app.icon}" alt="${app.name}" class="app-icon" onerror="this.src='https://cdn-icons-png.flaticon.com/512/252/252232.png'">
            <div class="app-title" style="color:#66fcf1; font-weight:bold; margin-top:10px;">${app.name}</div>
            <div class="app-desc" style="color:#c5c6c7; font-size:12px; margin:5px 0;">${app.desc}</div>
            <a href="${app.link}" class="download-btn" target="_blank" style="display:inline-block; margin-top:10px; padding:5px 15px; border:1px solid #66fcf1; color:#66fcf1; border-radius:20px; text-decoration:none; font-size:12px;">DOWNLOAD</a>
        `;
        appGrid.appendChild(card);
    });
}

// সার্চ ফাংশন
const searchInput = document.getElementById('searchInput');
if(searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allApps.filter(app => 
            app.name.toLowerCase().includes(query) || 
            app.desc.toLowerCase().includes(query)
        );
        displayApps(filtered);
    });
}

document.addEventListener('DOMContentLoaded', fetchSheetData);
