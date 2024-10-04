// Retrieve the JWT token from localStorage
const accessToken = localStorage.getItem('accessToken');
console.log('JWT Token:', accessToken);

// Check if the user is logged in (token exists)
if (!accessToken) {
    window.location.href = 'login.html';  // Redirect to login if no token is found
} else {
    // Display a message to the user
    document.getElementById('userData').innerHTML = 'You are successfully logged in!';

    // Example: Fetch some protected data from AWS API Gateway using the token
    fetch('https://0mwdgczdv0.execute-api.us-east-2.amazonaws.com/prod/fetchLostItems', {
        method: 'POST',  // Assuming POST request based on your earlier comments
        headers: {
            'Authorization': `Bearer ${accessToken}`,  // Use the JWT token from Cognito
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();  // Parse the JSON response
    })
    .then(data => {
        if (data.length > 0) {
            console.log('Full data received:', data);
            
            // Create an HTML table to display the data
            let tableHTML = `
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Item Description</th>
                        <th>Shipping Method</th>
                        <th>Pickup Location</th>
                        <th>Inquiry ID</th>
                        <th>Date of Loss</th>
                        <th>Today's Date</th>
                        <th>Loss Protection</th>
                        <th>Item Value</th>
                        <th>Confirmation Number</th>
                    </tr>`;
    
            // Loop through the data and create table rows for each item
            data.forEach(item => {
                tableHTML += `
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
                        <td>${item.todaysDate || 'N/A'}</td>
                        <td>${item.lossProtection || 'N/A'}</td>
                        <td>${item.itemValue || 'N/A'}</td>
                        <td>${item.confirmationNumber || 'N/A'}</td>
                    </tr>`;
            });
    
            tableHTML += `</table>`;
    
            // Display the table in your HTML
            document.getElementById('userData').innerHTML = tableHTML;
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
