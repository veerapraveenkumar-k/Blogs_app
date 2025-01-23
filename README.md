Blogs Management Application


The Blogs Management App is a robust platform for creating, managing, and publishing blogs, designed with advanced security and role-based access control. Key features include user authentication, OTP-based verification for enhanced account security, and roles such as User, Admin, and Editor. This scalable app ensures seamless collaboration and secure content handling, catering to diverse blogging needs.


1.Overview of the Blogs Management App:

The Blogs Management App is a feature-rich platform designed to streamline blog creation, management, and publication. It incorporates modern security practices, including OTP-based user verification and robust authentication. The application leverages role-based access control to ensure efficient content moderation and management, with three primary roles:
1. User: View blogs, comment on blogs, and manage their own comments.
2. Admin: Create blogs, assign editors to specific blogs, and perform full CRUD operations on all blogs.
3. Editor: Edit only the blogs assigned to them by the admin.

2.Features of the Blogs Management App:

1.  Authentication:
•	Secure login and registration using JWT tokens.
•	OTP verification via email for account security.
2.  Role-Based Access Control:
•	JWT token contains the user's role in its payload.
•	Frontend decodes the token to determine role-based access and permissions.
3.  Role Functionality:
•	User: View blogs, comment on blogs, and manage their comments.
•	Admin: Create, update, delete blogs, and assign editors.
•	Editor: Edit blogs assigned by the admin.
4.  CRUD Operations:
•	Full CRUD support for blogs with appropriate role-based restrictions.

3.Tech Stack for Blogs Management App:

1.  Backend:
•	Node.js: Server-side runtime environment for building scalable applications.
•	Express.js: Web application framework for handling routing, middleware, and APIs.
2.  Database:
•	MongoDB: NoSQL database for flexible data storage and retrieval.
3.  Authentication and Security:
•	JWT (JSON Web Tokens): For secure authentication and role-based access control.
•	Nodemailer: Email service for OTP verification.
4.  Additional Tools:
•	Bcrypt.js: For password hashing.
•	Mongoose: ODM for MongoDB.

4.Installation And Start Steps:

1.Clone the repository:
>>> git clone <repository-url>
Repo Link - https://github.com/veerapraveenkumar- k/Blogs_app.git 
2. Navigate to the server directory:
>>> cd server
3. Install dependencies:
>>> npm install
4. Start the server:
>>> node app.js

5.Environment Variables:

MONGO_CONNECTION_STRING = 'mongodb+srv://<username>:<password> @blogcluster1.dv2e9.mongodb.net/<Database name>?retryWrites=true&w=majority&appName=BlogCluster1'
PORT = 3000
EMAIL_HOST= smtp.gmail.com
EMAIL_PORT= 587
EMAIL_USER= 'your email id '
EMAIL_PASS= 'your app password for EMAIL '
JWT_SECRECT_TOKEN = 'MY-SECRECT-TOKEN'


6. API Documentation:

Admin API’S
1.Create Admin account
Request: 
Method: POST
Url: /api/admin/create-account
Body: {
“email”: “…….”,
“Password: “……”
}
Response: 
Success:
Status code: 200
{msg: “Admin Account Created”}
Failure:
Status Code: 400
{error_msg: “This Email Already Used”}


2.Login Into Admin account
Request: 
Method: POST
Url: /api/admin/login
Body: {
“email”: “…….”,
“Password: “……”
}
Response: 
Success:
Status code: 200
{jwt_token: “Token”}
Failure:
1.Invalid Email,
Status Code: 404
{error_msg: “This email doesn't exist”}
2.Invaild Password,
Status Code: 400
{error_msg: “Email and Password doesn't match”}
Correct email and Password:
{
    "email": "sanjay@gmail.com",
    "password": "sanjay@1234"
}


3.Create Blog
Request: 
Method: POST
Url: /api/admin/create-blog
Body: {
“title”: “…….”,
“content: “……”
}
Headers: {
“Authorization”: Bearer JWTTOKEN
}
Response: 
Success:
Status code: 200
{msg: “New Blog Successfully Created”}
Failure:
Status Code: 404
{error_msg: “Unauthorized”}


4.Delete Blog
Request: 
Method: DELETE
Url: /api/admin/delete-blog
Body: {
“blogId”: “………”
}
Headers: {
“Authorization”: Bearer JWTTOKEN
}
Response: 
Success:
Status code: 200
{msg: “Blog Successfully Deleted”}
Failure:
1.Unauthorized,
Status Code: 404
{error_msg: “Unauthorized”}
2.Error:
Status Code: 400
{error_msg: “Cannot Delete Blog”}


5.Edit Blog
Request: 
Method: PUT
Url: /api/admin/edit-blog
Body: {
“blogId”: “………”,
“title”: “……”,
“content”: “……”
}
Headers: {
“Authorization”: Bearer JWTTOKEN
}
Response: 
Success:
Status code: 200
{msg: “Blog Successfully Updated”}
Failure:
1.Unauthorized,
Status Code: 404
{error_msg: “Unauthorized”}
2.Error:
Status Code: 400
{error_msg: “Cannot Update Blog”}


6.Assign Editor to a Blog
Request: 
Method: PUT
Url: /api/admin/assign-editor
Body: {
“blogId”: “………”,
“editorId”: “……”
}
Headers: {
“Authorization”: Bearer JWTTOKEN
}
Response: 
Success:
Status code: 200
{msg: “Editor Successfully Assigned”}
Failure:
1.Unauthorized,
Status Code: 404
{error_msg: “Unauthorized”}
2.Error:
Status Code: 400
{error_msg: “Cannot Assign Editor”}


7.Get All the blogs
Request: 
Method: GET
Url: /api/admin/get-all-blogs
Headers: {
“Authorization”: Bearer JWTTOKEN
}
Response: 
Success:
Status code: 200
{blogs_list: The list of Blogs details}
Failure:
Status Code: 400
{error_msg: “Cannot Get the Blogs Details”}

Editors API’S


1.Create Editor account
Request: 
Method: POST
Url: /api/editor/create-account
Body: {
“email”: “…….”,
“Password: “……”
}
Response: 
Success:
Status code: 200
{msg: “Editor Account Created”}
Failure:
Status Code: 400
{error_msg: “This Email Already Used”}

2.Login Into Editor account
Request: 
Method: POST
Url: /api/editor/login
Body: {
“email”: “…….”,
“Password: “……”
}
Response: 
Success:
Status code: 200
{jwt_token: “Token”}
Failure:
1.Invalid Email,
Status Code: 404
{error_msg: “This email doesn't exist”}
2.Invaild Password,
Status Code: 400
{error_msg: “Email and Password doesn't match”}
Correct email and Password:
{
    "email": "kishore@gmail.com",
    "password": "kishore@1234"
}


3.Get Editable or Assigned blogs
Request: 
Method: GET
Url: /api/editor/editable-blogs
Headers: {
“Authorization”: Bearer JWTTOKEN
}
Response: 
Success:
Status code: 200
{blogs_list: The list of Blogs details}
Failure:
Status Code: 400
{error_msg: “Didn't get the blogs”}

Users API’S:
1.Create Account
Same as the another two role
url: /api/users/create-acount
2.Login
url: /api/users/login
3.Post Comments
Request: 
Method: POST
Url: /api/users/new-comment
Headers: {
“Authorization”: Bearer JWTTOKEN
}

Body {
“blogId”: “…….”,
“content”: “…….”
}
Response: 
Success:
Status code: 200
{msg: “Comment Posted Successfully”}
Failure:
Status Code: 400
{error_msg: “Didn't Post the COMMENT”}
4.Delete Comments
Request: 
Method: POST
Url: /api/users/delete-comment
Headers: {
“Authorization”: Bearer JWTTOKEN
}



Response: 
Success:
Status code: 200
{msg: “Comment Succesfully Deleted”}
Failure:
1.Error
Status Code: 400
{error_msg: “Didn't delete the comment”}
2. Unauthorized
Status Code: 404
{error_msg: “Unauthorized”}

OTP API’S:
1.Send OTP Code to Email:
Request: 
Method: POST
Url: /api /send-verification-email
Response: 
Success:
Status code: 200
{msg: “OTP sent successfully”}
Failure:
1.Error
Status Code: 400
{error_msg: Respective Error Message}
1.Verify OTP Code:
Request: 
Method: POST
Url: /api /send-verification-email
Body: {
“email”: “….”,
“otp”: “…..”
}
Response: 
Success:
Status code: 200
{msg: “OTP Verified”}
Failure:
1.Error
Status Code: 400
{error_msg: “Can't Verify OTP”}

2.Invaild OTP:
Status Code: 400
{error_msg: “Invalid OTP”}

7. Folder Structure:
server
---app.js
---config
	---db.js
---middlewareFunctions
	---authentication.js
---models
	---blogsModel.js
	---commentsModel.js
	---userModel.js
	---verificationModel.js
---routes
	---adminRoute.js
	---editorRoute.js
	---otpRouter.js
	---userRouter.js
	---welcomeRouter.js
---.env

8.Contributing:
We welcome contributions to improve the Blogs Management App! To get started:
1. Fork the Repository: Click the Fork button on GitHub.
2. Clone the Repository: Clone your forked repo using:
>>> git clone <your-forked-repo-url>
url: https://github.com/veerapraveenkumar-k/Blogs_app
3. Create a Branch: Create a feature branch for your changes:
>>> git checkout -b feature/your-feature-name
4. Make Changes: Add your updates or new features.
5. Test Your Code: Ensure all existing and new functionalities work as expected.
6. Submit a Pull Request: Push your changes and create a pull request with a detailed description of your work.
