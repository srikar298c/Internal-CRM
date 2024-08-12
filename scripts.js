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
//Projects
let projectData = [];

// Fetch project data
fetch('../../../../Internal-CRM/project_data.json')
    .then(response => response.json())
    .then(data => {
        projectData = data;
        populateTable(projectData);
        populateCountryFilter(projectData);
    })
    .catch(error => console.error('Error loading project data:', error));

// Populate the table with project data
function populateTable(data) {
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
    populateTable(filteredData);
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
