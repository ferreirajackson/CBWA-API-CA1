const db = require('../db')();
const COLLECTION = "issues";
const COLLECTION_PROJECTS = "projects";
module.exports = () => {
    //Function that redirects the issue to the final get function
    const get = async(issueNumber = null) => {
            if (!issueNumber) {
                try {
                    const issues = await db.get(COLLECTION);
                    return { issuesList: issues };
                } catch (ex) {
                    console.log("-=-=-=-=-=- ERROR AT: GET ALL ISSUES -=-=-=-=-=-")
                    return { error: ex }
                }

            }
            try {
                const issues = await db.get(COLLECTION, { issueNumber });
                return { issuesList: issues };
            } catch (ex) {
                console.log("-=-=-=-=-=- ERROR AT: GET AN ISSUE -=-=-=-=-=-")
                return { error: ex }
            }

        }
        //Function that sets and redirects the relation between two tables
        //to later on make the join between them | 1 to N relationship
    const aggregateAllComments = async() => {
        const LOOKUP_BOOKS_PIPELINE = [{
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "issue_id",
                as: "comments",
            },
        }, ];
        try {
            const issues = await db.aggregate(COLLECTION, LOOKUP_BOOKS_PIPELINE);
            return { issuesList: issues };
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: AGGREGATE ALL ISSUES -=-=-=-=-=-")
            return { error: ex }
        }

    };
    //Function that sets and redirects the relation between two tables
    //to later on make the join between them | 1 to many relationship
    const aggregate = async(issueNumber) => {
        const LOOKUP_BOOKS_PIPELINE = [{
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "issue_id",
                    as: "comments",
                },
            },
            {
                $match: {
                    issueNumber: issueNumber,
                }
            },
        ];
        try {
            const issues = await db.aggregate(COLLECTION, LOOKUP_BOOKS_PIPELINE);
            return { issuesList: issues };
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: AGGREGATE ISSUES -=-=-=-=-=-")
            return { error: ex }
        }

    };
    //Function that sets and redirects the relation between two tables
    //to later on make the join between them | 1 to 1 relationship
    const aggregateUnit = async(issueNumber, num) => {
        const LOOKUP_BOOKS_PIPELINE = [{
                $match: {
                    issueNumber: issueNumber,
                }

            }, {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "issue_id",
                    as: "comments",
                },
            }, {
                $project: {
                    issueNumber: 1,
                    title: 1,
                    description: 1,
                    status: 1,
                    project_id: 1,
                    comments: {
                        $arrayElemAt: ["$comments", num - 1]
                    }
                }
            }

        ];
        try {
            const issues = await db.aggregate(COLLECTION, LOOKUP_BOOKS_PIPELINE);
            return { issuesList: issues };
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: AGGREGATE UNIT ISSUE -=-=-=-=-=-")
            return { error: ex }
        }

    };
    //Function that redirects the issue to the final add function
    const add = async(slug, title, description, dueDate) => {
        //Checks if all the fiels were informed
        if (slug === undefined || slug.length == 0 || title === undefined || title.length == 0 || description === undefined || description.length == 0 || dueDate === undefined || dueDate.length == 0) {
            const error_message = "It was not possible to create the issue, please inform all the following information: slug, title and description.";
            const response = {
                error: error_message,
            }
            return response;
        }
        //Adding a issue with status open
        const status = "open"
        try {
            var project_array = await db.get(COLLECTION_PROJECTS, { slug });
            if (project_array === undefined || project_array.length == 0) {
                const error_message = "there's no project " + slug;
                const response = {
                    error: error_message,
                }
                return response;
            }
            var project_id = project_array[0]._id;
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: ADD ISSUES/FINDING PROJECT -=-=-=-=-=-")
            return { error: ex }
        }

        try {
            const countVar = await db.count(COLLECTION, { project_id });
            const finalIssueNumber = (slug + '-' + (countVar + 1).toString());
            const results = await db.add(COLLECTION, {
                issueNumber: finalIssueNumber,
                title: title,
                description: description,
                status: status,
                project_id: project_id,
                dueDate: dueDate
            });
            return { issuesList: 'Issue successfully added' };
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: ADD ISSUES/LINKING ISSUE -=-=-=-=-=-")
            return { error: ex }
        }

    }
    return {
        get,
        add,
        aggregate,
        aggregateUnit,
        aggregateAllComments
    }
};