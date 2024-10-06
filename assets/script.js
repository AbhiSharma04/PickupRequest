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



document.getElementById("loginButton").addEventListener("click", function(event) {
    event.preventDefault();  // Prevent the link from navigating immediately
    document.getElementById("disclaimer").style.display = "block";

    // Redirect to the login page after showing the disclaimer
    setTimeout(function() {
        window.location.href = "login.html";
    }, 750);  // Adjust the delay 
});


