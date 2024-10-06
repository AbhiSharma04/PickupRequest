document.addEventListener('DOMContentLoaded', function () {
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
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const parsedData = JSON.parse(data.body);
                if (Array.isArray(parsedData) && parsedData.length > 0) {
                    let tableBody = document.getElementById('tableBody');
                    tableBody.innerHTML = '';  // Clear the table body

                    parsedData.forEach(item => {
                        let row = `
                            <tr>
                                <td>${item.timestamp || 'N/A'}</td>
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
                                <td>
                                    <input type="checkbox" ${item.shippingCompleted ? 'checked' : ''} 
                                        data-confirmation-number="${item.confirmationNumber}" 
                                        data-initial-value="${item.shippingCompleted}" 
                                        onchange="handleShippingStatusChange(event)">
                                </td>
                            </tr>`;
                        tableBody.insertAdjacentHTML('beforeend', row);
                    });
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
    logoutButton.addEventListener('click', function () {
        localStorage.clear();
        window.location.href = 'login.html';
    });
});

// Handle shipping status change
function handleShippingStatusChange(event) {
    const checkbox = event.target;
    const confirmationNumber = checkbox.getAttribute('data-confirmation-number');
    const initialValue = checkbox.getAttribute('data-initial-value') === 'true';

    // Check if the value has changed before making the API call
    if (initialValue === checkbox.checked) {
        console.log('No change detected in shipping status, skipping update.');
        return;
    }

    // Show confirmation dialog before proceeding
    const shippingCompleted = checkbox.checked;
    const action = shippingCompleted ? 'mark as completed' : 'mark as not completed';
    const confirmation = confirm(`Are you sure you want to ${action} the shipping status for this item?`);

    // If the user confirms the action, proceed with the update
    if (confirmation) {
        console.log('Updating shipping status...');
        console.log('confirmationNumber: ', confirmationNumber);
        console.log('shippingCompleted: ', shippingCompleted);

        // Send API request to update the shipping status
        updateShippingStatus(confirmationNumber, shippingCompleted);
    } else {
        // Revert the checkbox back to its original state if the user cancels
        checkbox.checked = initialValue;
    }
}

// Function to update shipping status via API
async function updateShippingStatus(confirmationNumber, shippingCompleted) {
    try {
        const response = await fetch('https://rm87okece2.execute-api.us-east-2.amazonaws.com/prod/updateStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ confirmationNumber, shippingCompleted })
        });

        const data = await response.json();
        console.log('Full API Response: ', data);

        if (response.ok) {
            console.log('Shipping status updated successfully!');
        } else {
            console.error('Failed to update shipping status:', data.error);
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error updating shipping status:', error);
        alert('Unknown error occurred');
    }
}
