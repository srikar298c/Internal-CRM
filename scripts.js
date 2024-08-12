// For sidebar active link
document.addEventListener('DOMContentLoaded', function() {
    const currentFolder = window.location.pathname.split('/').slice(-2, -1)[0];
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        const linkFolder = link.getAttribute('href').split('/').slice(-2, -1)[0];
        if (linkFolder === currentFolder) {
            link.parentElement.classList.add('active');
        }
    });

    // Dropdown menu functionality
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.preventDefault();
            const parent = this.parentElement;
            const isOpen = parent.classList.contains('active');

            // Close all dropdown menus
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });

            // If the clicked dropdown is not already open, open it
            if (!isOpen) {
                parent.classList.add('active');
            }
        });
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});
// dashboard
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname.split('/').pop();
    const dashboardLinks = document.querySelectorAll('.dashboard-nav-button a');
    dashboardLinks.forEach(link => {
        if (link.getAttribute('href').includes(currentPath)) {
            link.parentElement.classList.add('active');
        }
    });

    // Collapsible sections
    const latestUpdateHeaders = document.querySelectorAll('.latestupdate-header');
    latestUpdateHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const details = this.nextElementSibling;
            const isOpen = details.classList.contains('open');

            // Close all details sections
            document.querySelectorAll('.latestupdate-details').forEach(detail => {
                detail.classList.remove('open');
            });

            // Rotate all arrows to original position
            document.querySelectorAll('.latestupdate-header').forEach(header => {
                header.classList.remove('active');
            });

            // If the clicked section is not already open, open it
            if (!isOpen) {
                details.classList.add('open');
                this.classList.add('active');
            }
        });
    });
});
//Projects folder
let projectData = [];

// Fetch project data
fetch('../../../../Internal-CRM/project_data.json')
    .then(response => response.json())
    .then(data => {
        projectData = data;
        populateProjectTable(projectData);
        populateCountryFilter(projectData);
    })
    .catch(error => console.error('Error loading project data:', error));

// Populate the table with project data
function populateProjectTable(data) {
    const tableBody = document.querySelector('#projectTable tbody');
    tableBody.innerHTML = '';

    data.forEach(project => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${project.country}</td>
            <td>${project.projectName}</td>
            <td>
                <div class="project-label-container">
                    <span class="label-date">${project.label}</span>
                    <span class="label-${project.status.toLowerCase()}">${project.status}</span>
                </div>
            </td>
            <td>
                ${project.activeMembers.map(member => `
                    <span class="member-name">${member.name}</span>
                    <span class="member-phone">${member.phone}</span>
                `).join('<br>')}
            </td>
            <td>
                <span class="member-name">${project.createdBy.name}</span>
                <span class="member-phone">${project.createdBy.phone}</span>
            </td>
            <td>
                <span class="icon stats-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M1.75 13.25V1.5H.5v12a1.24 1.24 0 0 0 1.22 1H15.5v-1.25z"/>
                        <path fill="currentColor" d="M3.15 8H4.4v3.9H3.15zm3.26-4h1.26v7.9H6.41zm3.27 2h1.25v5.9H9.68zm3.27-3.5h1.25v9.4h-1.25z"/>
                    </svg>
                </span>
                <span class="icon details-icon" data-country="${project.country}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
                        <g fill="currentColor">
                            <path d="M25 5h-.17v2H25a1 1 0 0 1 1 1v20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h.17V5H7a3 3 0 0 0-3 3v20a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3"/>
                            <path d="M23 3h-3V0h-8v3H9v6h14zm-2 4H11V5h3V2h4v3h3z"/>
                            <path d="M10 13h12v2H10zm0 5h12v2H10zm0 5h12v2H10z" class="ouiIcon__fillSecondary"/>
                        </g>
                    </svg>
                </span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Populate the country filter dropdown
function populateCountryFilter(data) {
    const countryFilter = document.getElementById('countryFilter');
    const countries = [...new Set(data.map(project => project.country))];
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
}

// Filter the table based on selected country
function filterTable() {
    const selectedCountry = document.getElementById('countryFilter').value;
    const filteredData = selectedCountry
        ? projectData.filter(project => project.country === selectedCountry)
        : projectData;
    populateProjectTable(filteredData);
}
// Show popup with project details
function showPopup(country) {
    const project = projectData.find(p => p.country === country);
    if (!project) return;

    const popup = document.getElementById('popup');
    const popupHeader = popup.querySelector('.project-popup-header');
    
    popupHeader.querySelector('.country').textContent = project.country;
    popupHeader.querySelector('.project-name').textContent = project.projectName;
    popupHeader.querySelector('.project-status').innerHTML = `${project.label} <span class="label-${project.status.toLowerCase()}">${project.status}</span>`;

    popup.classList.add('active');
    showTabContent('eligibility', project);
}

// Show popup with project details
function showPopup(country) {
    const project = projectData.find(p => p.country === country);
    if (!project) return;

    const popup = document.getElementById('popup');
    const popupHeader = popup.querySelector('.project-popup-header');
    
    popupHeader.querySelector('.country').innerHTML = ` 📍${project.country}`;
    popupHeader.querySelector('.project-name').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36"><path fill="currentColor" d="M29.29 5H27v2h2v25H7V7h2V5H7a1.75 1.75 0 0 0-2 1.69v25.62A1.7 1.7 0 0 0 6.71 34h22.58A1.7 1.7 0 0 0 31 32.31V6.69A1.7 1.7 0 0 0 29.29 5" class="clr-i-outline clr-i-outline-path-1"/><path fill="currentColor" d="M26 7.33A2.34 2.34 0 0 0 23.67 5h-1.8a4 4 0 0 0-7.75 0h-1.79A2.34 2.34 0 0 0 10 7.33V11h16ZM24 9H12V7.33a.33.33 0 0 1 .33-.33H16V6a2 2 0 0 1 4 0v1h3.67a.33.33 0 0 1 .33.33Z" class="clr-i-outline clr-i-outline-path-2"/><path fill="currentColor" d="M11 14h14v2H11z" class="clr-i-outline clr-i-outline-path-3"/><path fill="currentColor" d="M11 18h14v2H11z" class="clr-i-outline clr-i-outline-path-4"/><path fill="currentColor" d="M11 22h14v2H11z" class="clr-i-outline clr-i-outline-path-5"/><path fill="currentColor" d="M11 26h14v2H11z" class="clr-i-outline clr-i-outline-path-6"/><path fill="none" d="M0 0h36v36H0z"/></svg> ${project.projectName}`;
    popupHeader.querySelector('.project-status').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m20 12l-3.58 5.073q-.314.439-.79.683T14.616 18h-9q-.672 0-1.144-.472T4 16.385v-8.77q0-.67.472-1.143Q4.944 6 5.616 6h9q.557 0 1.024.264q.466.263.78.701zm-1.22 0l-3.203-4.5q-.154-.212-.413-.356Q14.904 7 14.616 7h-9q-.231 0-.424.192T5 7.616v8.769q0 .23.192.423t.423.192h9q.289 0 .549-.144q.259-.144.413-.356zM5 12v5V7z"/></svg> ${project.label} <span class="label-${project.status.toLowerCase()}">${project.status}</span>`;

    popup.classList.add('active');
    showTabContent('eligibility', project); // Show the default tab content
}

// Show content for the selected tab in popup
function showTabContent(tab, project) {
    const tabContent = document.getElementById('tabContent');
    let content = '';

    switch (tab) {
        case 'eligibility':
            content = `
                <h3>Eligibility Criteria</h3>
                <table class="content-table">
                    <tbody>
                        ${Object.entries(project.eligibilityCriteria).map(([key, value]) => `
                            <tr>
                                <td><strong>${key}:</strong></td>
                                <td>${value}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;
        case 'perks':
            content = `
                <h3>Perks & Salary</h3>
                <table class="content-table">
                    <tbody>
                        ${Object.entries(project.perksAndSalary).map(([key, value]) => `
                            <tr>
                                <td><strong>${key}</strong></td>
                                <td>${value}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;
        case 'procedure':
            content = `
                <h3>Standard Procedure</h3>
                <table class="content-table">
                    <tbody>
                        ${project.standardProcedure.map((step, index) => `
                            <tr>
                                <td><strong>${index + 1}:</strong></td>
                                <td>${step}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;
        case 'charges':
            content = `
                <h3>Service Charges</h3>
                <table class="content-table">
                    <tbody>
                        ${Object.entries(project.serviceCharges).map(([key, value]) => `
                            <tr>
                                <td><strong>${key}:</strong></td>
                                <td>${value}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;
    }

    tabContent.innerHTML = content;
}

// Event listeners for the projects page
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup');

    // Show popup on clicking the project details icon
    document.querySelector('#projectTable tbody').addEventListener('click', (e) => {
        const detailsIcon = e.target.closest('.details-icon');
        if (detailsIcon) {
            const country = detailsIcon.dataset.country;
            showPopup(country);
        }
    });

    // Close popup when clicking the close button
    popup.querySelector('.project-popup-close').addEventListener('click', () => {
        popup.classList.remove('active');
    });

    // Handle tab switching
    popup.querySelector('.project-popup-tabs').addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.project-popup-tab');
        if (tabBtn) {
            document.querySelectorAll('.project-popup-tab').forEach(btn => btn.classList.remove('active'));
            tabBtn.classList.add('active');
            const tab = tabBtn.dataset.tab;
            const country = popup.querySelector('.country').textContent.trim().slice(1);
            const project = projectData.find(p => p.country === country);
            showTabContent(tab, project);
        }
    });

    // Close popup when clicking outside the popup content
    window.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
        }
    });
});
    document.querySelectorAll('#projectTable th').forEach(headerCell => {
        headerCell.addEventListener('click', () => {
            const columnIndex = headerCell.cellIndex;
            const isAscending = headerCell.classList.contains('th-sort-asc');

            sortTable(columnIndex, !isAscending);
        });
    });


function sortTable(columnIndex, ascending) {
    const tbody = document.querySelector('#projectTable tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();

        return ascending ? aColText.localeCompare(bColText) : bColText.localeCompare(aColText);
    });

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    tbody.append(...rows);

    document.querySelectorAll('#projectTable th').forEach(th => th.classList.remove('th-sort-asc', 'th-sort-desc'));
    document.querySelector(`#projectTable th:nth-child(${columnIndex + 1})`).classList.toggle('th-sort-asc', ascending);
    document.querySelector(`#projectTable th:nth-child(${columnIndex + 1})`).classList.toggle('th-sort-desc', !ascending);
}


async function fetchData() {
        try {
            const response = await fetch('../../../../Internal-CRM/global-data.json');
            const candidatesData = await response.json();
            populateGlobalDatabaseTable(candidatesData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function createCandidateDiv(data) {
        const div = document.createElement('div');
        div.className = 'leads-candidate-data';

        const summary = document.createElement('div');
        summary.className = 'candidate-summary';
        summary.innerHTML = `
        <input type="checkbox" class="checkbox">
        <div class="caret-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z"/></svg></div>
            <img src="${data['display picture']}" alt="${data.name}" class="candidate-image">
            <div class="candidate-info">
                <div class="candidate-main-info">
                    <span class="candidate-id">ID: ${data.id}</span>
                    <span class="candidate-name">${data.name}</span>
                    <span class="candidate-contact">${data.mobileNumber} | ${data.email}</span>
                </div>
                <div class="candidate-details">
                    <span>${data.experience}</span>
                    <span>${data.department}</span>
                    <select class="status-select">
                        <option value="active" ${data.status === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="inactive" ${data.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
                <div class="action-dots">⋮</div>
            </div>
        `;

        const additionalInfo = document.createElement('div');
        additionalInfo.className = 'additional-info';
        additionalInfo.innerHTML = `
            <div class="info-group"><span class="info-label">Gender:</span>${data.gender}</div>
            <div class="info-group"><span class="info-label">Passport:</span>Not Available</div>
            <div class="info-group"><span class="info-label">Client Label:</span>${data.clients.label}</div>
            <div class="info-group"><span class="info-label">Client Status:</span>${data.clients.clientStatus}</div>
            <div class="button-group">
                <button class="icon-button"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
  <path fill="currentColor" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M9.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383z"/>
</svg></button>
                <button class="icon-button"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 100 100">
  <path fill="currentColor" d="M46.05 60.163H31.923c-.836 0-1.513.677-1.513 1.513V83.61c0 .836.677 1.513 1.513 1.513H46.05c.836 0 1.512-.677 1.512-1.513V61.675c0-.836-.677-1.512-1.512-1.512m22.027-45.285H53.95c-.836 0-1.513.677-1.513 1.513v67.218c0 .836.677 1.513 1.513 1.513h14.127c.836 0 1.513-.677 1.513-1.513V16.391c0-.836-.677-1.513-1.513-1.513m22.14 20.421H76.09c-.836 0-1.513.677-1.513 1.513v46.797c0 .836.677 1.513 1.513 1.513h14.126c.836 0 1.513-.677 1.513-1.513V36.812c0-.835-.677-1.513-1.512-1.513m-66.307 0H9.783c-.836 0-1.513.677-1.513 1.513v46.797c0 .836.677 1.513 1.513 1.513H23.91c.836 0 1.513-.677 1.513-1.513V36.812c0-.835-.677-1.513-1.513-1.513"/>
</svg></button>
                <button class="icon-button"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
  <path fill="currentColor" d="M42.76 50A8 8 0 0 0 40 56v168a8 8 0 0 0 16 0v-44.23c26.79-21.16 49.87-9.75 76.45 3.41c16.4 8.11 34.06 16.85 53 16.85c13.93 0 28.54-4.75 43.82-18a8 8 0 0 0 2.76-6V56a8 8 0 0 0-13.27-6c-28 24.23-51.72 12.49-79.21-1.12C111.07 34.76 78.78 18.79 42.76 50M216 172.25c-26.79 21.16-49.87 9.74-76.45-3.41c-25-12.35-52.81-26.13-83.55-8.4V59.79c26.79-21.16 49.87-9.75 76.45 3.4c25 12.35 52.82 26.13 83.55 8.4Z"/>
</svg></button>
                <button class="icon-button"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
  <path fill="currentColor" d="M15 13h1.5v2.82l2.44 1.41l-.75 1.3L15 16.69zm8 3c0 3.87-3.13 7-7 7c-1.91 0-3.64-.76-4.9-2H8c-1.1 0-2-.9-2-2V7h12v2.29c2.89.86 5 3.54 5 6.71M9 16c0-3.87 3.13-7 7-7H8v10h1.67c-.43-.91-.67-1.93-.67-3m7-5c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5m-.5-7H19v2H5V4h3.5l1-1h5z"/>
</svg></button>
                <button class="icon-button"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36">
  <path fill="currentColor" d="M32.51 27.83A14.4 14.4 0 0 1 30 24.9a12.6 12.6 0 0 1-1.35-4.81v-4.94A10.81 10.81 0 0 0 19.21 4.4V3.11a1.33 1.33 0 1 0-2.67 0v1.31a10.81 10.81 0 0 0-9.33 10.73v4.94a12.6 12.6 0 0 1-1.35 4.81a14.4 14.4 0 0 1-2.47 2.93a1 1 0 0 0-.34.75v1.36a1 1 0 0 0 1 1h27.8a1 1 0 0 0 1-1v-1.36a1 1 0 0 0-.34-.75M5.13 28.94a16.2 16.2 0 0 0 2.44-3a14.2 14.2 0 0 0 1.65-5.85v-4.94a8.74 8.74 0 1 1 17.47 0v4.94a14.2 14.2 0 0 0 1.65 5.85a16.2 16.2 0 0 0 2.44 3Z" class="clr-i-outline clr-i-outline-path-1"/>
  <path fill="currentColor" d="M18 34.28A2.67 2.67 0 0 0 20.58 32h-5.26A2.67 2.67 0 0 0 18 34.28" class="clr-i-outline clr-i-outline-path-2"/>
  <path fill="none" d="M0 0h36v36H0z"/>
</svg></button>
                <button class="icon-button"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
  <path fill="currentColor" d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7z"/>
</svg></button>
                <button class="icon-button"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
  <path fill="currentColor" d="m23 12l-2.44-2.78l.34-3.68l-3.61-.82l-1.89-3.18L12 3L8.6 1.54L6.71 4.72l-3.61.81l.34 3.68L1 12l2.44 2.78l-.34 3.69l3.61.82l1.89 3.18L12 21l3.4 1.46l1.89-3.18l3.61-.82l-.34-3.68zm-13 5l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9z"/>
</svg></button>
                <button class="submit-button">Submit</button>
            </div>
        `;

        div.appendChild(summary);
        div.appendChild(additionalInfo);

        const caretIcon = summary.querySelector('.caret-icon');
        caretIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            additionalInfo.classList.toggle('open');
            caretIcon.classList.toggle('open');
        });

        return div;
    }

    function populateGlobalDatabaseTable(candidatesData) {
        const container = document.getElementById('candidateContainer');
        candidatesData.forEach(data => {
            const candidateDiv = createCandidateDiv(data);
            container.appendChild(candidateDiv);
        });
    }

    function initializeFilters() {
        // Implement filter logic here
    }

    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', () => {
            // Implement search logic here
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        fetchData();
        initializeFilters();
        setupSearch();
    });