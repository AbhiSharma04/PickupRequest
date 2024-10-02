document.getElementById('lossProtection').addEventListener('change', function () {
    const itemValueContainer = document.getElementById('itemValueContainer');
    if (this.value === 'Yes') {
        itemValueContainer.style.display = 'block';
    } else {
        itemValueContainer.style.display = 'none';
        document.getElementById('itemValue').value = '';  // Clear the field if not visible
    }
});


// Handle form submission (modify this to match your current submission logic)
document.getElementById('lostItemForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    // Show loading spinner
    document.getElementById('loadingSpinner').style.display = 'block';

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

        const responseBody = JSON.parse(data.body);

        // Log the final parsed response body to ensure the correct data is being accessed
        console.log('Parsed response body:', responseBody);



        document.getElementById('loadingSpinner').style.display = 'none';

        if (response.ok) {
            document.getElementById('responseMessage').innerHTML = `<div class="alert alert-success">Confirmation Number: ${responseBody.confirmationNumber}</div>`;
        } else {
            document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">Error: ${responseBody.error || 'Failed to submit form'}</div>`;
        }
    } catch (error) {
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('responseMessage').innerHTML = `<div class="alert alert-danger">Error: Could not submit form</div>`;
        console.error('Error during submission:', error);
    }finally {
        // Re-enable the submit button after receiving a response
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
});