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
    submitButton.querySelector('#submitSpinner').style.display = 'inline-block';  // Show spinner

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

        const data = await response.json();
        const responseBody = JSON.parse(data.body);

        // Hide loading spinner
        document.getElementById('loadingSpinner').style.display = 'none';

        // If submission is successful
        if (response.ok) {
            // Update the modal content with confirmation number and email
            document.getElementById('confirmationNumber').textContent = responseBody.confirmationNumber;
            document.getElementById('emailAddress').textContent = formData.email;

            // Show the modal
            $('#confirmationModal').modal('show');
        } else {
            document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">Error: ${responseBody.error || 'Failed to submit form'}</div>`;
        }
    } catch (error) {
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">Error: Could not submit form</div>`;
        console.error('Error during submission:', error);
    } finally {
        submitButton.disabled = false;
        submitButton.querySelector('#submitSpinner').style.display = 'none';  // Hide spinner
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


