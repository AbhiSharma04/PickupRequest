document.getElementById('lossProtection').addEventListener('change', function () {
    const itemValueContainer = document.getElementById('itemValueContainer');
    if (this.value === 'Yes') {
        itemValueContainer.style.display = 'block';
    } else {
        itemValueContainer.style.display = 'none';
        document.getElementById('itemValue').value = '';  // Clear the field if not visible
    }
});

// Handle form submission
document.getElementById('lostItemForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = true;  // Disable button to prevent multiple submissions
    submitButton.textContent = 'Submitting...';  // Change button text

    // Show loading spinner
    document.getElementById('loadingSpinner').style.display = 'block';

    // Gather form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        itemDescription: document.getElementById('itemDescription').value,
        shippingMethod: document.getElementById('shippingMethod').value,
        pickupLocation: document.getElementById('pickupLocation').value,
        inquiryID: document.getElementById('inquiryID').value,
        dateOfLoss: document.getElementById('dateOfLoss').value,
        todaysDate: document.getElementById('todaysDate').value,
        lossProtection: document.getElementById('lossProtection').value,
        itemValue: document.getElementById('lossProtection').value === 'Yes' ? document.getElementById('itemValue').value : null
    };

    try {
        const response = await fetch('https://2pxhndeqq1.execute-api.us-east-2.amazonaws.com/prod/SubmitLostItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // Log the raw response before parsing
        console.log('Raw response:', response);

        // Parse the response as JSON
        const data = await response.json();

        // Ensure data has a body field with expected response
        const responseBody = JSON.parse(data.body);

        // Log the final parsed response body to ensure the correct data is being accessed
        console.log('Parsed response body:', responseBody);

        // Hide loading spinner
        document.getElementById('loadingSpinner').style.display = 'none';

        // If submission is successful
        if (response.ok) {
            // Show success message and confirmation number
            document.getElementById('responseMessage').innerHTML = `<div class="alert alert-success">Form submitted successfully. Confirmation Number: ${responseBody.confirmationNumber}</div>`;
        } else {
            // Show error message from response if available
            document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">Error: ${responseBody.error || 'Failed to submit form'}</div>`;
        }
    } catch (error) {
        // Hide loading spinner on error
        document.getElementById('loadingSpinner').style.display = 'none';

        // Show error message
        document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">Error: Could not submit form</div>`;
        console.error('Error during submission:', error);
    } finally {
        // Re-enable the submit button after the process is done
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
});
document.getElementById("loginButton").addEventListener("click", function(event) {
    event.preventDefault();  // Prevent the link from navigating immediately
    document.getElementById("disclaimer").style.display = "block";

    // Redirect to the login page after showing the disclaimer
    setTimeout(function() {
        window.location.href = "login.html";
    }, 750);  // Adjust the delay 
});
