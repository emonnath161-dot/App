/**
 * NexGen App Store - Fully Optimized JavaScript System
 * Features: Dual Column Layout, Search, Badge Support
 */

// ১. আপনার পাবলিশ করা গুগল শিটের নতুন CSV লিঙ্ক
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUeFjb_jJoyCgoLll-7QbRlnOKGXVX9Y-FiHrW23UW1E2XVBYifT6Z5-NCQJMzhWfL-dWw2Lbk_b4I/pub?output=csv';

let allApps = [];

// ২. শিট থেকে ডাটা সংগ্রহের ফাংশন
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
        if(appGrid) appGrid.innerHTML = "<p style='color:red; text-align:center; padding:20px; grid-column: 1/-1;'>ডাটা কানেকশনে সমস্যা!</p>";
    }
}

// ৩. অ্যাপগুলো স্ক্রিনে দেখানোর ফাংশন (পাশাপাশি দুটি ডিজাইন)
function displayApps(apps) {
    const appGrid = document.getElementById('apps'); 
    if(!appGrid) return;
    appGrid.innerHTML = "";

    if (apps.length === 0) {
        appGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #66fcf1; padding:20px;'>কোনো অ্যাপ পাওয়া যায়নি!</p>";
        return;
    }

    apps.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <span class="badge">${app.badge}</span>
            <img src="${app.icon}" alt="${app.name}" class="app-icon" onerror="this.src='https://cdn-icons-png.flaticon.com/512/252/252232.png'">
            <div class="app-title">${app.name}</div>
            <div class="app-desc">${app.desc}</div>
            <a href="${app.link}" class="download-btn" target="_blank">DOWNLOAD</a>
        `;
        appGrid.appendChild(card);
    });
}

// ৪. সার্চ করার ফাংশন
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

// ৫. ওয়েবসাইট লোড হওয়ার সাথে সাথে ফাংশনটি চালু হবে
document.addEventListener('DOMContentLoaded', fetchSheetData);
