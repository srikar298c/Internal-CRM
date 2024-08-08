
//*********************************************Common to all pages */
// For sidebar a active
const currentFolder = window.location.pathname.split('/').slice(-2, -1)[0];

const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
sidebarLinks.forEach(link => {
    const linkFolder = link.getAttribute('href').split('/').slice(-2, -1)[0];
    if (linkFolder === currentFolder) {
        link.parentElement.classList.add('active');
    }
});

 document.addEventListener('DOMContentLoaded', function() {
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
// *********************************************************************Dashboard*//
const currentPath = window.location.pathname.split('/').pop();
const dashboardLinks = document.querySelectorAll('.dashboard-nav-button a');
dashboardLinks.forEach(link=>{

  if (link.getAttribute('href').includes(currentPath)) {
    link.parentElement.classList.add('active');
  }
})

 document.addEventListener('DOMContentLoaded', function() {
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
        

// projects**************************************************************************************
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
            <td><div class="project-label-container">
          <span>${project.label}</span>
          <span class="label-${project.status}">${project.status}</span>
        </div></td>
            <td>${project.activeMembers.map(member => `<span class="member-name">${member.name}</span>
                    <span class="member-phone">${member.phone}</span>`).join('<br>')}</td>
            <td><span class="member-name">${project.createdBy.name}</span><span class="member-phone">${project.createdBy.phone}</span></td>
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

    document.getElementById('popupTitle').textContent = `${project.country} - ${project.projectName}`;
    document.getElementById('popup').style.display = 'block';
    showTabContent('eligibility', project);
}

// Show content for selected tab in popup
function showTabContent(tab, project) {
    const tabContent = document.getElementById('tabContent');
    let content = '';

    switch (tab) {
        case 'eligibility':
            content = `
                <h3>Eligibility Criteria</h3>
                <ul>
                    ${Object.entries(project.eligibilityCriteria).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}
                </ul>
            `;
            break;
        case 'perks':
            content = '<h3>Perks & Salary</h3><p>Information about perks and salary would go here.</p>';
            break;
        case 'procedure':
            content = '<h3>Standard Procedure</h3><p>Information about standard procedures would go here.</p>';
            break;
        case 'ask':
            content = '<h3>Ask Shimona</h3><p>Here you can ask questions to Shimona.</p>';
            break;
    }

    tabContent.innerHTML = content;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    populateTable(projectData);
    populateCountryFilter(projectData);

    document.getElementById('countryFilter').addEventListener('change', filterTable);

    document.querySelector('#projectTable tbody').addEventListener('click', (e) => {
        const detailsIcon = e.target.closest('.details-icon');
        if (detailsIcon) {
            const country = detailsIcon.dataset.country;
            showPopup(country);
        }
    });

    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('popup').style.display = 'none';
    });

    document.querySelector('.tabs').addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.tab-btn');
        if (tabBtn) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            tabBtn.classList.add('active');
            const tab = tabBtn.dataset.tab;
            const country = document.getElementById('popupTitle').textContent.split(' - ')[0];
            const project = projectData.find(p => p.country === country);
            showTabContent(tab, project);
        }
    });
    document.querySelectorAll('#projectTable th').forEach(headerCell => {
        headerCell.addEventListener('click', () => {
            const columnIndex = headerCell.cellIndex;
            const isAscending = headerCell.classList.contains('th-sort-asc');

            sortTable(columnIndex, !isAscending);
        });
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

