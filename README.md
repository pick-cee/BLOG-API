# BLOG-API

This is the API for a Blog Web App. It is simle to use and integrate into your system.

Users can make a post and comment a post and the UserId is used to track who made a comment to a particular post.

The system also allows for user verification. A verification email is sent to the email of the user. The user must input the verification code to verify their account.

## List of endpoints created

1. Register User - The registered user is sent a verification code
2. Verify Email - The user inputs the verification code and the server checks if the code is valid
3. Resend Token - This is to request for a new token if the token has expired or if the user has forgotten the token

### Run the aplication

1. Clone the repository using: `git clone`

### Start the server

1. Install all dependencies using:
   `npm install`
2. Then start the server using: `npm run dev`
