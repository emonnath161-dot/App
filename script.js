/**
 * NexGen App Store - 5 Column Integrated System
 */

const SHEET_ID = '1nIO19n20c6h8_B9S1OL5d2GhCKjRlneaIKxP1XPg3vw'; 
const sheetURL = `https://docs.google.com/spreadsheets/d/1nIO19n20c6h8_B9S1OL5d2GhCKjRlneaIKxP1XPg3vw/export?format=csv`;

let allApps = [];

async function fetchSheetData() {
    try {
        const response = await fetch(sheetURL);
        const data = await response.text();
        
        // CSV ডাটাকে ভেঙে লিস্ট তৈরি করা
        const rows = data.split('\n').slice(1); 
        
        allApps = rows.map(row => {
            // ৫টি কলাম হ্যান্ডেল করার লজিক
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
            return {
                name: cols[0] ? cols[0].replace(/"/g, '').trim() : '',
                desc: cols[1] ? cols[1].replace(/"/g, '').trim() : 'প্রিমিয়াম অ্যাপ',
                icon: cols[2] ? cols[2].replace(/"/g, '').trim() : 'https://cdn-icons-png.flaticon.com/512/252/252232.png',
                link: cols[3] ? cols[3].replace(/"/g, '').trim() : '#',
                badge: cols[4] ? cols[4].replace(/"/g, '').trim() : 'NEW' // ৫ম কলাম (Badge)
            };
        }).filter(app => app.name !== "");

        displayApps(allApps);
    } catch (error) {
        console.error("Error:", error);
        const appGrid = document.getElementById('apps');
        if(appGrid) appGrid.innerHTML = "<p style='color:red; text-align:center; grid-column:1/-1;'>ডাটা কানেকশনে সমস্যা হচ্ছে! শিটটি Public করা আছে কি?</p>";
    }
}

function displayApps(apps) {
    const appGrid = document.getElementById('apps'); 
    if(!appGrid) return;
    appGrid.innerHTML = "";

    apps.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <span class="badge" style="position: absolute; top: 10px; right: 10px; background: #66fcf1; color: #000; font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: bold;">${app.badge}</span>
            <img src="${app.icon}" alt="${app.name}" class="app-icon" onerror="this.src='https://cdn-icons-png.flaticon.com/512/252/252232.png'">
            <div class="app-title" style="font-weight: bold; color: #66fcf1;">${app.name}</div>
            <div class="app-desc" style="font-size: 12px; color: #c5c6c7; margin: 5px 0;">${app.desc}</div>
            <a href="${app.link}" class="download-btn" target="_blank" style="display: block; margin-top: 10px; border: 1px solid #66fcf1; color: #66fcf1; text-decoration: none; border-radius: 20px; padding: 5px; font-size: 13px;">DOWNLOAD</a>
        `;
        card.style.position = 'relative'; // Badge পজিশনের জন্য
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

document.addEventListener('DOMContentLoaded', fetchSheetData);
