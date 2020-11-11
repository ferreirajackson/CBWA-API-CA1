const express = require('express');
const bodyParser = require('body-parser');
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;
const projectsController = require('./controllers/projects')();
const usersController = require('./controllers/users')();
const issuesController = require('./controllers/issues')();
const commentsController = require('./controllers/comments')();


const app = module.exports = express();

// logging
app.use((req, res, next) => {
    // Display log for requests
    console.log('[%s] %s -- %s', new Date(), req.method, req.url);
    next();
});


//Line 21 to 52 validates the api key so the user can only use the API with the right key
//The key is kept in "key" field of the "users" table
/*app.use(async(req, res, next) => {
    const FailedAuthMessage = {
        error: "Failed Authentication",
        message: "Go away!",
        code: "xxx", // Some useful error code
    };
    const suppliedKey = req.headers["x-api-key"];
    const clientIp =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    // Check Pre-shared key
    if (!suppliedKey) {
        console.log(
            " [%s] FAILED AUTHENTICATION -- %s, No Key Supplied",
            new Date(),
            clientIp
        );
        FailedAuthMessage.code = "01";
        return res.status(401).json(FailedAuthMessage);
    }
    const user = await users.getByKey(suppliedKey);
    if (!user) {
        console.log(
            " [%s] FAILED AUTHENTICATION -- %s, BAD Key Supplied",
            new Date(),
            clientIp
        );
        FailedAuthMessage.code = "02";
        return res.status(401).json(FailedAuthMessage);
    }
    next();
});*/

app.use(bodyParser.json())

const path = require('path');
const projects = require('./models/projects')();
const users = require('./models/users')();
const comments = require('./models/comments')();
const issues = require('./models/issues')();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.get("/", async(req, res) => {
    res.render('index', {
        title: "CA2 CBWA",
    });
});


app.get("/all/issues", async(req, res) => {
    const { issuesList } = await issues.get();
    res.render('issues', {
        title: "Issues",
        issues: issuesList
    });
});

app.get("/all/projects", async(req, res) => {
    const { projectsList } = await projects.get();
    res.render('projects', {
        title: "Projects",
        projects: projectsList
    });
});



app.get("/all/comments", async(req, res) => {
    const { commentsList } = await comments.get();
    res.render('comments', {
        title: "Comments",
        comments: commentsList
    });
});

app.get("/all/users", async(req, res) => {
    const { userList } = await users.get();
    res.render('users', {
        title: "Users",
        users: userList
    });
});


//Get all projects
app.get('/projects', projectsController.getController);

//Add new Projects individually
app.post('/projects', projectsController.postController);

//Get all issues for a project
app.get("/projects/:slug/issues", projectsController.aggregateController);

//Get an individual issue from an individual project
app.get("/projects/:slug/issues/:num", projectsController.aggregateUnitController);

//BONUS: Updated the status of an issue 
app.put("/projects/:slug/issues/:num/:status", projectsController.updateStatusController);

//Get individual projects
app.get('/projects/:slug', projectsController.getById);

//Get all users
app.get('/users', usersController.getController);

//Add new users individually
app.post('/users', usersController.postController);

//Get individual users
app.get('/users/:email', usersController.getById);

//Get all issues (bring comments with it)
app.get('/issues', issuesController.getController);

//Add new issues to a project individually
app.post('/projects/:slug/issues', issuesController.postController);

//Get all comments for an issue
app.get("/issues/:issueNumber/comments", issuesController.aggregateController);

////Get an individual comments from an individual issue
app.get("/issues/:issueNumber/comments/:num", issuesController.aggregateUnitController);

//Get individual issues
app.get('/issues/:issueNumber', issuesController.getById);

//Add new comments to an issue
app.post("/issues/:issueNumber/comments", commentsController.postUnitController);

//Get all comments (optional)
app.get('/comments', commentsController.getController);

//Get all comments for an author (optional)
app.get('/comments/:author', commentsController.getById);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


app.use((req, res) => {
    res.status(404).json({
        error: 404,
        message: 'Route not found',
    });
});