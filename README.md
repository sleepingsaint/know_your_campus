# KNOW YOUR CAMPUS

social platform for students by students

### Intention behind this project

I have faced a lot of trouble knowing a lot of things that's been happening in my college, like different clubs / socities eg. coding society, dance society etc. I had to ask a ton of seniors for advice at the start of the semester to choose the subjects and for preparing the exams. 

The main aim of this project is to make platform where students can freely share their knowledge, experience and have fun while using this.

### Features

* Reviews on subjects and Professors
* Internship and Interview Experiences
* Project Pool - finding partners to work on projects
* Chat Rooms for interactions
* Live Broadcasting of events


### Tech Stack

* Frontend
    * React - for making life simple
    * Typescript - for avoiding huge bugs when deployed
    * Apollo Graphql client

* Backend
    * Django - Dependable
    * GraphQl - For better performance in the long run


## Work Progress

### Backend

[x] Authentication <br />
[x] Create schema and mutations for reviews <br />
	[x] Get All Reviews Query <br />
	[x] Get queries by tags <br />
	[x] Get query by id <br />
	[x] Get query by user and tags <br />
	[x] Mutation - Create, Update, Delete <br />
	[x] Custom Object type for fields <br />
	[x] App Upvote, Downvote, Remove vote mutations <br />
	[x] Add Pagination for Reviews <br />
	[x] Implement Relay framework for reviews

[x] Create Schema and mutations for comments <br />
	[x] Get All Comments for a review Query <br />
	[x] Get Comments by an user <br />
	[x] Mutation - Create, Update, Delete <br />
	[x] Add Pagination for Comments <br />
	[x] Implement Relay Framework for comments <br />

[x] Override Email Templates <br />
[ ] Setup email server <br />
[ ] Restructure Code <br />
	[ ] Seperating Mutation, Queries, Types

### Frontend

* Authentication

    [x] Create Account Component <br />
    [x] Login Component <br />
    [x] Logout Component <br />
	[x] Verify Account Component <br />
	[x] ReSend Verification Mail <br />
	[x] Reset Password <br />
    [ ] Change Password <br />
    [ ] Edit Profile
	[x] Implement Refresh Token <br />
* Reviews

    [ ] Create Review Component <br />
    [ ] List All Reviews Component <br />
    [ ] Edit Review Component <br />
    [ ] Delete Review Component <br />

* Comments

    [x] Create Comment Component <br />
    [x] List All Comments Component <br />
    [x] Edit Comment Component <br />
    [x] Delete Comment Component <br />

* Voice Chat

* Project Pool

> Contributions of any kind are appreciated.

> Both frontend and backend code are available in the respective branches
