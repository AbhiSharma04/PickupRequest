// Retrieve the JWT token from localStorage
const accessToken = localStorage.getItem('accessToken');

// Check if the user is logged in (token exists)
if (!accessToken) {
    window.location.href = 'login.html';  // Redirect to login if no token is found
} else {
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
    .then(response => response.json())  // Parse the response as JSON
    .then(data => {
        console.log('Data received from API:', data);  // Log the data for debugging
        if (data && data.body) {
            // The body contains the data as a string, so we need to parse it
            const parsedData = JSON.parse(data.body);  // Parse the body field
            console.log('Parsed Data:', parsedData);  // Log parsed data for debugging

            if (Array.isArray(parsedData) && parsedData.length > 0) {
                // If data is found, display it in a user-friendly way
                let table = '<table class="table table-striped"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Item Description</th><th>Shipping Method</th><th>Pickup Location</th><th>Inquiry ID</th><th>Date of Loss</th><th>Today Date</th><th>Loss Protection</th><th>Item Value</th><th>Confirmation Number</th><th>Timestamp</th></tr></thead><tbody>';
                parsedData.forEach(item => {
                    table += `<tr>
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
                });
                table += '</tbody></table>';               
                document.getElementById('userData').innerHTML = table;
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
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.clear();  // Clear the stored token
            window.location.href = 'login.html';  // Redirect to login page
        });
    }
});
