document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');

    // Check if the user is logged in (token exists)
    if (!accessToken) {
        console.log('No access token found, redirecting to login.');
        window.location.href = 'login.html';  // Redirect to login if no token is found
    } else {
        console.log('Access token found, proceeding to fetch data.');

        // Display a message to the user
        document.getElementById('userData').innerHTML = 'You are successfully logged in!';

        // Fetch data from AWS API Gateway using the token
        fetch('https://0mwdgczdv0.execute-api.us-east-2.amazonaws.com/prod/fetchLostItems', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,  // Send the JWT token in the Authorization header
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('API response received:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data received from API:', data);

            if (data && data.body) {
                const parsedData = JSON.parse(data.body);
                console.log('Parsed Data:', parsedData);

                if (Array.isArray(parsedData) && parsedData.length > 0) {
                    let tableBody = document.getElementById('tableBody');
                    tableBody.innerHTML = '';  // Clear the table body

                    parsedData.forEach(item => {
                        let row = `
                            <tr>
                                <td>${item.name || 'N/A'}</td>
                                <td>${item.email || 'N/A'}</td>
                                <td>${item.phone || 'N/A'}</td>
                                <td>${item.address || 'N/A'}</td>
                                <td>${item.itemDescription || 'N/A'}</td>
                                <td>${item.shippingMethod || 'N/A'}</td>
                                <td>${item.pickupLocation || 'N/A'}</td>
                                <td>${item.inquiryID || 'N/A'}</td>
                                <td>${item.dateOfLoss || 'N/A'}</td>
                                <td>${item.timestamp || 'N/A'}</td>
                            </tr>`;
                        tableBody.insertAdjacentHTML('beforeend', row);
                    });
                } else {
                    document.getElementById('userData').innerHTML = 'No data found.';
                }
            } else {
                document.getElementById('userData').innerHTML = 'No data found.';
            }
        })
        .catch(error => {
            console.error('Error fetching protected data:', error);
            document.getElementById('userData').innerHTML = 'Error loading data. Please try again later.';
        });
    }

    // Logout functionality
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.clear();  // Clear the stored token
            window.location.href = 'login.html';  // Redirect to login page
        });
    }
});


let sortOrder = 'asc'; // Track sort order

function sortTable(column) {
    const table = document.getElementById("tableBody");
    const rows = Array.from(table.querySelectorAll("tr"));

    rows.sort((a, b) => {
        let valA = a.querySelector(`td[data-column="${column}"]`).innerText;
        let valB = b.querySelector(`td[data-column="${column}"]`).innerText;
        
        if (sortOrder === 'asc') {
            return valA.localeCompare(valB);
        } else {
            return valB.localeCompare(valA);
        }
    });

    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

    // Clear and append sorted rows
    table.innerHTML = "";
    rows.forEach(row => table.appendChild(row));
}

document.getElementById('filterInput').addEventListener('input', function() {
    const filterValue = this.value.toLowerCase();
    const rows = document.getElementById('tableBody').getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const email = row.cells[1].textContent.toLowerCase();
        if (name.includes(filterValue) || email.includes(filterValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

let currentPage = 1;
const rowsPerPage = 5; // Customize this as needed
function paginateTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';  // Clear the table body

    // Loop through the data and insert it into the table
    data.forEach(item => {
        const row = `<tr>
            <td>${item.name || 'N/A'}</td>
            <td>${item.email || 'N/A'}</td>
            <td>${item.phone || 'N/A'}</td>
            <td>${item.address || 'N/A'}</td>
            <td>${item.itemDescription || 'N/A'}</td>
            <td>${item.shippingMethod || 'N/A'}</td>
            <td>${item.pickupLocation || 'N/A'}</td>
            <td>${item.inquiryID || 'N/A'}</td>
            <td>${item.dateOfLoss || 'N/A'}</td>
            <td>${item.todaysDate || 'N/A'}</td>
            <td>${item.lossProtection || 'N/A'}</td>
            <td>${item.itemValue !== null ? item.itemValue : 'N/A'}</td>
            <td>${item.confirmationNumber || 'N/A'}</td>
            <td>${item.timestamp || 'N/A'}</td>
        </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}



// Handle page navigation
document.getElementById('prevPage').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        paginateTable(parsedData);
    }
});

document.getElementById('nextPage').addEventListener('click', function() {
    if (currentPage * rowsPerPage < parsedData.length) {
        currentPage++;
        paginateTable(parsedData);
    }
});
