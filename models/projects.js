const db = require('../db')();
const COLLECTION = "projects";
const COLLECTION_ISSUES = "issues";
const COLLECTION_USERS = "users";
var nodemailer = require('nodemailer');
require('dotenv').config();
module.exports = () => {
    //Function that redirects the project to the final get function
    const get = async(slug = null) => {
            if (!slug) {
                try {
                    const projects = await db.get(COLLECTION);
                    return { projectsList: projects };
                } catch (ex) {
                    console.log("-=-=-=-=-=- ERROR AT: GET ALL PROJECTS -=-=-=-=-=-")
                    return { error: ex }
                }

            }
            try {
                const projects = await db.get(COLLECTION, { slug });
                return { projectsList: projects };
            } catch (ex) {
                console.log("-=-=-=-=-=- ERROR AT: GET A PROJECT -=-=-=-=-=-")
                return { error: ex }
            }

        }
        //Function that sets and redirects the relation between two tables
        //to later on make the join between them | 1 to many relationship
    const aggregate = async(slug) => {
        const LOOKUP_BOOKS_PIPELINE = [{
                $lookup: {
                    from: "issues",
                    localField: "_id",
                    foreignField: "project_id",
                    as: "issues",
                },
            },
            {
                $match: {
                    slug: slug,
                }
            },
        ];
        try {
            const projects = await db.aggregate(COLLECTION, LOOKUP_BOOKS_PIPELINE);
            return { projectsList: projects };
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: AGGREGATE ALL PROJECTS -=-=-=-=-=-")
            return { error: ex }
        }

    };
    //Function that sets and redirects the relation between two tables
    //to later on make the join between them | 1 to 1 relationship
    const aggregateUnit = async(slug, num) => {
        const LOOKUP_BOOKS_PIPELINE = [{
                $match: {
                    slug: slug,
                }
            },
            {
                $lookup: {
                    from: "issues",
                    localField: "_id",
                    foreignField: "project_id",
                    as: "issues",
                },
            },
            {
                $project: {
                    slug: 1,
                    name: 1,
                    description: 1,
                    issues: {
                        $arrayElemAt: ["$issues", num - 1]
                    }
                }
            }

        ];
        try {
            const projects = await db.aggregate(COLLECTION, LOOKUP_BOOKS_PIPELINE);
            return { projectsList: projects };
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: AGGREGATE PROJECT -=-=-=-=-=-")
            return { error: ex }
        }

    };
    //Function that validates and redirect the update of a given issue
    const updateStatus = async(slug, num, status) => {
        //check if status inserted is valid
        if (status != 'open' && status != 'wip' && status != 'blocked' && status != 'closed') {
            const error_message = "invalid status, choose between open, wip, blocked or closed";
            const response = {
                error: error_message,
            }
            return response;
        }

        try {
            var arrayProjects = await db.get(COLLECTION, { slug });
            if (arrayProjects === undefined || arrayProjects.length == 0) {
                const error_message = "there's no projects " + slug;
                const response = {
                    error: error_message,
                }
                return response;
            }
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: UPDATE PROJECT/FINDING PROJECT -=-=-=-=-=-")
            return { error: ex }
        }
        console.log('print sth here again')
        console.log(arrayProjects)
        try {
            var project_id = arrayProjects[0]._id;
            var arrayIssues = await db.get(COLLECTION_ISSUES, { project_id });
            if (arrayIssues === undefined || arrayIssues.length == 0) {
                const error_message = "there's no issue number " + num;
                const response = {
                    error: error_message,
                }
                return response;
            }




        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: UPDATE PROJECT/LINKING ISSUE -=-=-=-=-=-")
            return { error: ex }
        }
        try {
            const countVar = await db.count(COLLECTION_ISSUES, { project_id });
            if (num > countVar) {
                const error_message = "Issue number " + num + " doesn't exist.";
                const response = {
                    error: error_message,
                }
                return response;
            }

        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: UPDATE  PROJECT/COUNTING ISSUES -=-=-=-=-=-")
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
            console.log("-=-=-=-=-=- ERROR AT: UPDATE PROJECT/GETTING USERS -=-=-=-=-=-")
            return { error: ex }
        }
        try {
            const _id = arrayIssues[num - 1]._id;


            //////////////////////////////////////////////////////////
            var dueDate = arrayIssues[num - 1].dueDate;
            var issuNum = arrayIssues[num - 1].issueNumber;
            var date = new Date();
            //console.log(dueDate + ' first')
            const day = date.getDate();
            //console.log(day)
            const month = date.getMonth() + 1;
            //console.log(month);
            const year = date.getFullYear();
            //console.log(year)
            //console.log(day + '/' + month + '/' + year)
            var date1 = date;
            var date2 = day + '/' + month + '/' + year;
            date1 = new Date(dueDate);
            date2 = new Date(date2);
            //console.log(date1)
            //console.log(date2)
            if (date1 < date2) {
                const error_message = "It was not possible update the status for this project, this project is expired! The due date was on " + dueDate;
                const response = {
                    error: error_message,
                }
                return response;
            };
            //////////////////////////////////////////////////////////



            const newValues = { $set: { status: status } };
            const projects = await db.upd(COLLECTION_ISSUES, { _id }, newValues);

            ////////////////////////////////////////////////////////////////
            arrayadmins.forEach(element => {
                //email sender
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

                let mailOptions = {
                    from: 'ca2mailer2020@gmail.com',
                    to: element.email,
                    subject: 'A project had the status updated.',
                    text: `A project ` + slug + ` had the status updated to "` + status + `":\nIssue Number: ` + issuNum + `\nStatus: ` + status + `\nDue date: ` + dueDate
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            });
            ///////////////////////////////////////////////////
            return { projectsList: 'Issue status successfully updated' };
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: UPDATE  PROJECT/SENDING EMAIL -=-=-=-=-=-")
            return { error: ex }
        }

    };
    //Function that redirects the project to the final add function
    const add = async(slug, name, description) => {

        //Checks if all the fiels were informed
        if (slug === undefined || slug.length == 0 || name === undefined || name.length == 0 || description === undefined || description.length == 0) {
            const error_message = "It was not possible to create the project, please inform all the following information: slug, name and description.";
            const response = {
                error: error_message,
            }
            return response;
        }

        //Checking if the project slug is duplicated
        try {
            const project = await db.get(COLLECTION, { slug });
            console.log(project.length);
            console.log('esse é o project')
            if (project.length > 0) {
                const error_message = "The project " + slug + " already exists in the bugtracker database. Try typing another project name:";
                const response = {
                    error: error_message,
                }
                return response;
            }
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: ADD PROJECT/FINDING PROJECT -=-=-=-=-=-")
            return { error: ex }
        }

        //Adding project
        try {
            const results = await db.add(COLLECTION, {
                slug: slug,
                name: name,
                description: description
            });
            return { projectsList: 'Project successfully added' };
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: ADD PROJECT/ADDING PROJECT -=-=-=-=-=-")
            return { error: ex }
        }

    }
    return {
        get,
        add,
        aggregate,
        aggregateUnit,
        updateStatus
    }
};