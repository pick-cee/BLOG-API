# BLOG-API

This is the API for a Blog Web App. It is simple to use and integrate into your system.

Users can make a post and comment a post and the UserId is used to track who made a comment to a particular post.

The system also allows for user verification. A verification email is sent to the email of the user. The user must input the verification code to verify their account.

## List of endpoints created

1. Register User - The registered user is sent a verification code
2. Verify Email - The user inputs the verification code and the server checks if the code is valid
3. Resend Token - This is to request for a new token if the token has expired or if the user has forgotten the token
4. Login - The user logs in with their email and password
5. Forgot Password - The user inputs their email and a reset password link is sent to their email
6. Reset Password - The user inputs their new password and the password is reset
7. Create Post - The logged in user creates a post
8. Get All Posts - The logged in user can gets all his posts
9. Delete post - The logged in user can delete his posts
10. Create Comment - The logged in user can comment on a post
11. Get All Comments - The logged in user can get all comments for a posts
12. Delete Comment - The logged in user can delete his comments
13. Like Post - The logged in user can like a post
14. Unlike Post - The logged in user can unlike a post
15. Get All Likes - The logged in user can get all likes for a post

### Run the aplication

1. Clone the repository using: `git clone`

### Start the server

1. Install all dependencies using:
   `npm install`
   <br/>
2. Then start the server using: `npm run dev`
