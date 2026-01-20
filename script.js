const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUeFjb_jJoyCgoLll-7QbRlnOKGXVX9Y-FiHrW23UW1E2XVBYifT6Z5-NCQJMzhWfL-dWw2Lbk_b4I/pub?output=csv';

async function fetchSheetData() {
    try {
        const response = await fetch(SHEET_URL);
        const csvData = await response.text();
        const rows = csvData.split('\n').slice(1); 
        
        let allApps = rows.map(row => {
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
            return {
                name: cols[0] ? cols[0].replace(/"/g, '').trim() : '',
                desc: cols[1] ? cols[1].replace(/"/g, '').trim() : 'App',
                icon: cols[2] ? cols[2].replace(/"/g, '').trim() : '',
                link: cols[3] ? cols[3].replace(/"/g, '').trim() : '#',
                badge: cols[4] ? cols[4].replace(/"/g, '').trim() : 'NEW'
            };
        }).filter(app => app.name !== "");

        const appGrid = document.getElementById('apps');
        appGrid.innerHTML = "";
        
        allApps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.innerHTML = `
                <span class="badge">${app.badge}</span>
                <img src="${app.icon}" alt="${app.name}" class="app-icon">
                <div class="app-title">${app.name}</div>
                <div class="app-desc">${app.desc}</div>
                <a href="${app.link}" class="download-btn" target="_blank">DOWNLOAD</a>
            `;
            appGrid.appendChild(card);
        });
    } catch (e) { console.log(e); }
}

document.addEventListener('DOMContentLoaded', fetchSheetData);
