
# Image Uploader Web Application

This is a web application that allows users to upload, manage, and download images. Users can create an account, log in, delete their accounts, update account details, receive email notifications, and perform various actions related to image management.

## Features

- Account Creation: Users can create a new account by providing their email address and choosing a password.

- User Authentication: Passport is used for user authentication, allowing users to log in securely.

- Account Deletion: Users have the option to delete their accounts if they no longer wish to use the application.

- Logout: Users can log out of their accounts to securely end their sessions.

- Account Details Update: Users can update their account details, such as their email address or password.

- Email Notifications: Nodemailer is used to send email notifications to users for various events, such as successful account creation or password reset.

- Image Upload: Users can upload images to the application, which are securely stored and managed.

- Image Listing: All uploaded images are displayed in a user-friendly manner, allowing users to view and manage their images.

- Image Deletion: Users have the ability to delete individual images from their collection.

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- MongoDB

## Getting Started

1. Clone the repository:

   
shell
   git clone `https://github.com/saurabhdixit93/image-uploader.git`
  


2. Install the dependencies:

   
command
   `cd image-uploader`
   `npm install`
  


3. Set up environment variables:
   - Open the `.env` file and provide the necessary configuration values, such as MongoDB connection URL and email service credentials.

4. Start the application:

command
   npm start
  


5. Open your web browser and navigate to `http://localhost:5000` to access the application.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for new features, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

