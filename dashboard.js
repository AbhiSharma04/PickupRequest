document.addEventListener('DOMContentLoaded', function () {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        window.location.href = 'login.html';
    } else {
        fetchData();
    }

    let currentPage = 1;
    const rowsPerPage = 10;
    let filteredData = [];  // Data after filtering
    let allData = [];  // All data from API

    // Fetch data from API
    function fetchData() {
        fetch('https://0mwdgczdv0.execute-api.us-east-2.amazonaws.com/prod/fetchLostItems', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.body) {
                    allData = JSON.parse(data.body);

                    // Sort data by the most recent timestamp
                    allData.sort((a, b) => {
                        const timestampA = new Date(a.timestamp || 0);
                        const timestampB = new Date(b.timestamp || 0);
                        return timestampB - timestampA;  // Descending order
                    });

                    filteredData = allData;  // Store sorted data into filteredData
                    paginateTable(filteredData);  // Display the sorted data with pagination
                } else {
                    console.error('No data found:', data);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Render table based on data
    function renderTable(data) {
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';  // Clear existing table data

        const start = (currentPage - 1) * rowsPerPage;

        data.forEach((item, index) => {
            const row = `
                <tr>
                    <td>${start + index + 1}</td> <!-- Serial Number (S.No) Column -->
                    <td>${item.name || 'N/A'}</td>
                    <td>${item.email || 'N/A'}</td>
                    <td>${item.phone || 'N/A'}</td>
                    <td>${item.address || 'N/A'}</td>
                    <td>${item.itemDescription || 'N/A'}</td>
                    <td>${item.shippingMethod || 'N/A'}</td>
                    <td>${item.pickupLocation || 'N/A'}</td>
                    <td>${item.inquiryID || 'N/A'}</td>
                    <td>${item.dateOfLoss || 'N/A'}</td>
                    <td><input type="checkbox" class="shipping-status" data-id="${item.confirmationNumber}" ${item.shippingCompleted ? 'checked' : ''}></td>
                </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });

        // Update the page indicator
        updatePageIndicator(data);
    }

    // Paginate table
    function paginateTable(data) {
        const start = (currentPage - 1) * rowsPerPage;
        const paginatedData = data.slice(start, start + rowsPerPage);
        renderTable(paginatedData);
    }

    document.getElementById('prevPage').addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            paginateTable(filteredData);
        }
    });

    document.getElementById('nextPage').addEventListener('click', function () {
        if (currentPage * rowsPerPage < filteredData.length) {
            currentPage++;
            paginateTable(filteredData);
        }
    });

    // Search functionality
    document.getElementById('filterInput').addEventListener('input', function () {
        const filterValue = this.value.toLowerCase();
        currentPage=1;
        filteredData = allData.filter(item => {
            const name = item.name ? item.name.toLowerCase() : '';
            //const email = item.email ? item.email.toLowerCase() : '';
            const phone = item.phone ? item.phone.toLowerCase() : '';
            return name.includes(filterValue) || phone.includes(filterValue);
        });
        paginateTable(filteredData);
    });

    // Filter by shipping status
    document.getElementById('statusFilter').addEventListener('change', function () {
        const status = this.value;
        currentPage=1;
        filteredData = allData.filter(item => {
            if (status === 'completed') {
                return item.shippingCompleted;
            } else if (status === 'pending') {
                return !item.shippingCompleted;
            }
            return true;  // Show all items if 'all' is selected
        });
        paginateTable(filteredData);
    });

    // Table sorting
    let sortOrder = 'asc';
    window.sortTable = function (column) {
        filteredData.sort((a, b) => {
            const valA = a[column] ? a[column].toLowerCase() : '';
            const valB = b[column] ? b[column].toLowerCase() : '';
            return (sortOrder === 'asc') ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        currentPage = 1;
        paginateTable(filteredData);
    };

    // Event delegation to handle dynamically inserted checkboxes
    document.getElementById('tableBody').addEventListener('change', function (event) {
        if (event.target.classList.contains('shipping-status')) {
            const confirmationNumber = event.target.dataset.id;
            const shippingCompleted = event.target.checked;

            // Confirm with the user before updating
            const confirmation = confirm('Are you sure you want to update the shipping status?');
            if (confirmation) {
                updateShippingStatus(confirmationNumber, shippingCompleted);
            } else {
                // Revert the checkbox to its original state if the user cancels
                event.target.checked = !event.target.checked;
            }
        }
    });

    // Function to update shipping status
    function updateShippingStatus(confirmationNumber, shippingCompleted) {
        fetch('https://rm87okece2.execute-api.us-east-2.amazonaws.com/prod/updateStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                confirmationNumber: confirmationNumber,
                shippingCompleted: shippingCompleted
            })
        })
            .then(response => response.json())
            .then(result => {
                if (result.message) {
                    fetchData();  // Refresh the table after update
                } else {
                    alert('Failed to update shipping status');
                    console.error('Failed to update shipping status:', result.error);
                }
            })
            .catch(error => console.error('Error updating shipping status:', error));
    }

    // Logout functionality
    document.getElementById('logout').addEventListener('click', function () {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Function to update page indicator
    function updatePageIndicator(data) {
        const start = (currentPage - 1) * rowsPerPage + 1;
        const end = Math.min(start + rowsPerPage - 1, filteredData.length);
        const total = filteredData.length;

        document.getElementById('pageIndicator').textContent = `Showing ${start} to ${end} of ${total} items (Page ${currentPage})`;
    }
});
