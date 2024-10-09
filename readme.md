# Lost & Found Management System

## Overview

The **Lost & Found Management System** is a comprehensive web-based application that allows users to report lost items and manage the recovery process through a dashboard. The system consists of two main parts:
1. **Lost Item Submission Form**: A public-facing form where users can submit information about lost items.
2. **Admin Dashboard**: A secure dashboard for administrators to view, filter, and manage the status of lost items, including tracking shipping and generating reports.

## Features

### Lost Item Submission Form
- **Submit Lost Item**: Users can submit details of their lost item, including name, contact details, item description, and shipping preferences.
- **Form Validation**: Fields are validated to ensure all necessary information is provided.
- **Responsive Design**: The form is mobile-friendly, ensuring it works well on all screen sizes.
  
### Admin Dashboard
- **View Lost Items**: Displays detailed information on lost items submitted via the form, including the shipping method, pickup location, and shipping status.
- **Filter by Shipping Status**: Filter items by shipping status (completed or pending).
- **Search**: Allows searching by name or phone number.
- **Sort**: Sorts data by name (ascending/descending) or default timestamp (most recent first).
- **Date Range Filter**: Filter data by specific time periods (last 1 month, 3 months, or 6 months).
- **Shipping Status Update**: Admins can update the shipping status directly from the dashboard.
- **Export Data**: Export the table data as either a PDF or Excel file.
- **Pagination**: Navigate through pages of data with built-in pagination controls.

## Technologies Used

- **HTML5**: Structure and content of the pages.
- **CSS3**: Basic styling and layout.
- **JavaScript**: Core functionality for both the form and dashboard, including form validation, table rendering, filtering, and exporting.
- **Bootstrap 4.5**: Used for responsive layout and consistent styling across the system.
- **AWS Lambda**: Backend services for handling form submissions and managing data in the database.
- **DynamoDB**: AWS database used to store lost item information.
- **Amazon API Gateway**: For securely accessing the AWS Lambda functions.

## Installation

1. Clone the repository:
   
   ```bash
   git clone <repository-url>
   cd lost-found-system

2. Open the index.html file in your preferred browser to run the project locally.

3. Ensure your backend service (AWS Lambda or any other API) is correctly set up for managing the form submissions and dashboard functionalities.

4. Configure your API endpoints in dashboard.js, login.js and script.js.

5. Create a DynamoDB table to store lost and found items. Make sure the partition key is confirmationNumber.

6. Deploy your Lambda functions to handle the fetching and updating of data.
Set up API Gateway to trigger the Lambda functions.


## How to Use
- Login: User will first authenticate using AWS Cognito or a custom login flow.
- View the Dashboard: View a list of all lost and found items, with filters, search, and pagination available.
- Update Shipping Status: You can mark items as "Shipping Completed" or "Pending" using checkboxes.

## License
This project is licensed under the MIT License - see the LICENSE file for details.


## Contact Information

For any inquiries or issues, please contact me via:

- **Name**: Abhishek Sharma
- **LinkedIn**: [https://www.linkedin.com/in/asharma04/](https://www.linkedin.com/in/yourprofile)
- **GitHub**: [https://github.com/AbhiSharma04](https://github.com/yourusername)

Feel free to reach out for questions, contributions, or any other discussions related to the project.

---
