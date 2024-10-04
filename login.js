// AWS Cognito Configuration
const poolData = {
    UserPoolId: 'us-east-2_w8p534jjr',  // Replace with your Cognito User Pool ID
    ClientId: '4beepr4qko4ouaul6f9qpvsukr',  // Replace with your App Client ID
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Handle form submission for login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent form from submitting the default way

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    document.getElementById('loginStatus').innerHTML = 'Logging in...';

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password
    });

    const userData = {
        Username: username,
        Pool: userPool
    };
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    // Authenticate the user
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('Login success, Access token:', result.getAccessToken().getJwtToken());
            
            // Store tokens locally (optional)
            localStorage.setItem('accessToken', result.getAccessToken().getJwtToken());
            localStorage.setItem('idToken', result.getIdToken().getJwtToken());

            // Redirect to dashboard on success
            window.location.href = 'dashboard.html';
        },
        onFailure: function (err) {
            console.error('Login error:', err);
            document.getElementById('loginStatus').innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
        },
        // Handle new password requirement
        newPasswordRequired: function(userAttributes, requiredAttributes) {
            console.log('New password required');
            
            const newPassword = prompt("Please enter a new password:");

            // Complete the new password challenge
            cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
                onSuccess: function(result) {
                    console.log('Password updated successfully, Access token:', result.getAccessToken().getJwtToken());

                    // Store tokens locally (optional)
                    localStorage.setItem('accessToken', result.getAccessToken().getJwtToken());
                    localStorage.setItem('idToken', result.getIdToken().getJwtToken());

                    // Redirect to dashboard after password change
                    window.location.href = 'dashboard.html';
                },
                onFailure: function(err) {
                    console.error('Error completing new password challenge:', err);
                    document.getElementById('loginStatus').innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
                }
            });
        }
    });
});
