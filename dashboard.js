document.addEventListener('DOMContentLoaded', function () {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        window.location.href = 'login.html';
    } else {
        fetchData();
    }

    let currentPage = 1;
    const rowsPerPage = 10;
    let filteredData = [];  // Data after filtering or sorting
    let allData = [];  // All data from API
    let defaultSortedData = [];  // Original default-sorted data (by timestamp)
    let currentStatusFilter = 'all';  // Keep track of the current status filter

    // Fetch data from API
    function fetchData() {
        return fetch('https://0mwdgczdv0.execute-api.us-east-2.amazonaws.com/prod/fetchLostItems', {
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

                // Sort data by the most recent timestamp (this will be our "default" sorting)
                defaultSortedData = allData.slice().sort((a, b) => {
                    const timestampA = new Date(a.timestamp || 0);
                    const timestampB = new Date(b.timestamp || 0);
                    return timestampB - timestampA;  // Descending order
                });

                // Initially apply the current filter (by default, it's 'all')
                applyShippingStatusFilter(currentStatusFilter);
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
                    <td>${item.confirmationNumber || 'N/A'}</td>
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
        currentPage = 1;
        filteredData = allData.filter(item => {
            const name = item.name ? item.name.toLowerCase() : '';
            const phone = item.phone ? item.phone.toLowerCase() : '';
            return name.includes(filterValue) || phone.includes(filterValue);
        });
        paginateTable(filteredData);
    });

    document.getElementById('dateFilter').addEventListener('change', function () {
        const selectedRange = this.value;
        const currentDate = new Date();

        if (selectedRange === 'all') {
            filteredData = defaultSortedData.slice();  // Reset to default sorted data
        } else {
            const monthOffset = parseInt(selectedRange);  // 1, 3, or 6 months
            filteredData = allData.filter(item => {
                const itemDate = new Date(item.timestamp);
                const cutoffDate = new Date(currentDate.setMonth(currentDate.getMonth() - monthOffset));
                return itemDate >= cutoffDate;
            });
        }

        currentPage = 1;  // Reset to first page
        paginateTable(filteredData);
    });

    // Filter by shipping status
    document.getElementById('statusFilter').addEventListener('change', function () {
        currentStatusFilter = this.value;
        currentPage = 1;
        applyShippingStatusFilter(currentStatusFilter);
    });

    function applyShippingStatusFilter(status) {
        if (status === 'all') {
            filteredData = defaultSortedData.slice();
        } else {
            filteredData = allData.filter(item => {
                if (status === 'completed') {
                    return item.shippingCompleted;
                } else if (status === 'pending') {
                    return !item.shippingCompleted;
                }
                return true;
            });
        }
        paginateTable(filteredData);
    }

    // Sorting with dropdown
    document.getElementById('sortOptions').addEventListener('change', function () {
        const sortOption = this.value;

        if (sortOption === 'default') {
            filteredData = defaultSortedData.slice();  // Copy the default-sorted data
        } else if (sortOption === 'nameAsc') {
            filteredData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        } else if (sortOption === 'nameDesc') {
            filteredData.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        }

        currentPage = 1;  // Reset to page 1 when sorting changes
        paginateTable(filteredData);
    });

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
                fetchData().then(() => {
                    applyShippingStatusFilter(currentStatusFilter);  // Reapply the filter after the update
                    paginateTable(filteredData);  // Display the filtered and updated data
                });
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
        window.location.href = 'index.html';
    });

    // Function to update page indicator
    function updatePageIndicator(data) {
        const start = (currentPage - 1) * rowsPerPage + 1;
        const end = Math.min(start + rowsPerPage - 1, filteredData.length);
        const total = filteredData.length;

        document.getElementById('pageIndicator').textContent = `Showing ${start} to ${end} of ${total} items (Page ${currentPage})`;
    }
});