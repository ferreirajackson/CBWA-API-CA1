const db = require('../db')();
const COLLECTION = "comments";
const COLLECTION_ISSUES = "issues";
const COLLECTION_USERS = "users";
var nodemailer = require('nodemailer');
require('dotenv').config();
module.exports = () => {
    //Function that redirects the comment to the final get function
    const get = async(author = null) => {
        console.log(' inside comments model');
        if (!author) {
            try {
                const comments = await db.get(COLLECTION);
                return { commentsList: comments };
            } catch (ex) {
                console.log("-=-=-=-=-=- ERROR AT: GET ALL COMMENTS -=-=-=-=-=-")
                return { error: ex }
            }

        }
        try {
            const comments = await db.get(COLLECTION, { author });
            return { commentsList: comments };
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: GET A COMMENT -=-=-=-=-=-")
            return { error: ex }
        }

    };
    //Function that verify and redirects the comment to the final add function
    const addComments = async(text, issueNumber, author) => {
        //Checks if all the fiels were informed
        if (text === undefined || text.length == 0 || author === undefined || author.length == 0) {
            const error_message = "It was not possible to create the comment, please inform all the following information: text and author.";
            const response = {
                error: error_message,
            }
            return response;
        }
        //issues information
        try {
            var issue_array = await db.get(COLLECTION_ISSUES, { issueNumber });
            if (issue_array === undefined || issue_array.length == 0) {
                const error_message = "there's no issue named: " + issueNumber;
                const response = {
                    error: error_message,
                }
                return response;
            }
            var issue_id = issue_array[0]._id;
            var issueNum = issue_array[0].issueNumber;

            //Validates if a comment can be added based on the dueDate
            var dueDate = issue_array[0].dueDate;
            var date = new Date();
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            var date1 = date;
            var date2 = month + '/' + day + '/' + year;
            date1 = new Date(dueDate);
            date2 = new Date(date2);
            if (date1 < date2) {
                const error_message = "It was not possible to add the comment, this issue is expired! The due date was on " + dueDate;
                const response = {
                    error: error_message,
                }
                return response;
            }
            //users information
            var email = author;
        } catch (ex) {
            console.log("-=-=-=-=-=-  ERROR AT: ADD COMMENT/FINDING ISSUE -=-=-=-=-=-")
            return { error: ex }
        }
        try {
            var author_array = await db.get(COLLECTION_USERS, { email });
            if (author_array === undefined || author_array.length == 0) {
                const error_message = "there's no user " + email;
                const response = {
                    error: error_message,
                }
                return response;
            }
            var author_id = author_array[0]._id;
            //var issueNum = author_array[0].issueNumber;
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: ADD COMMENT/FINDING USER ID -=-=-=-=-=-")
            return { error: ex }
        }


        //comments information
        try {
            const countComments = await db.count(COLLECTION, { issue_id });
            var finalIdNumber = countComments + 1;
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: ADD COMMENT/COUNTING COMMENTS -=-=-=-=-=-")
            return { error: ex }
        }


        //get admin
        try {
            const usertype = 'admin';
            var arrayadmins = await db.get(COLLECTION_USERS, { usertype });
            console.log("arrayadmins================")
            console.log(arrayadmins)
            console.log(arrayadmins.length)
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: ADD COMMENT/FINDING ADMIN TO SEND EMAIL -=-=-=-=-=-")
            return { error: ex }
        }
        try {
            const results = await db.add(COLLECTION, {
                id: finalIdNumber,
                text: text,
                issue_id: issue_id,
                author: email,
                author_id: author_id,
            });
            arrayadmins.forEach(element => {
                //email sender
                console.log('HOW MANY TIMES')
                console.log(element)
                console.log(element.email)
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                console.log(issueNum + 'test')
                let mailOptions = {
                    from: 'ca2mailer2020@gmail.com',
                    to: element.email,
                    subject: 'New comment to issue ' + issueNum + '.',
                    text: `A new comment has just been added to this project:\nIssue Number: "` + issueNum + `"\nComment: "` + text + `"\nauthor: ` + email
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            });
            //
            return { commentsList: 'Comment successfully added' };
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: ADD COMMENT/SENDING EMAIL -=-=-=-=-=-")
            return { error: ex }
        }

    }
    return {
        get,
        addComments
    }
};