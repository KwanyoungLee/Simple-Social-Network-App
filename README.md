# Simple-Social-Network-App
A simple single page social network application using the MERN stack

Launch the app as follows:
1. Create an express project
2. Copy all the files in this folder to a project folder
3. Set up a database names ‘assginment2’ and insert values
4. Launch server app by running node app.js
5. Launch the React App by running npm start


Implementation details:
Backend:
1. HTTP POST request for http://localhost:3001/signin. The middleware parses the body for the HTTP POST request and extract  the username and password carried in request body. It sends all retrieved information for signing in as a JSON string to the client.
2. HTTP GET request for http://localhost:3001/logout. the middleware unsets the userid cokkie variable and clear lastCommentRetrievalTime in the user’s record in the userList collection. 
3. HTTP GET request for http://localhost:3001/getuserprofile. It sends all retrieved information for getting an user profile in as a JSON string to the client.
4. HTTP PUT request for http://localhost:3001/saveuserprofile. The middleware updates the userprofile in the userList collection
5. HTTP GET request for http://localhost:3001/updatestar:/:friendid. It updaters the starredOrNot of the friend of the user in the userList collection.
6. HTTP POST request for http://localhost:3001/postcomment/:postid. It updates the new post comments.
7. HTTP DELETE requests for http://localhost:3001/deletecomment/:commentid. It deletes the comment.
8. HTTP GET request for http://localhost:3001/locadcommentupdates. It updates newly posted comments and deleted comments. 


Frontend:
1. Class FrontApp
2. Class Content
3. Class LoginPage
4. Class Header
5. Class Main
6. Class StarNameList
7. Class StarRow
8. Class Postandcomments
9. Class FriendRow
