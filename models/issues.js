const db = require('../db')();
const COLLECTION = "issues";
const COLLECTION_PROJECTS = "projects";
module.exports = () => {
    //Function that redirects the issue to the final get function
    const get = async(issueNumber = null) => {
            if (!issueNumber) {
                const issues = await db.get(COLLECTION);
                return issues;
            }
            const issues = await db.get(COLLECTION, { issueNumber });
            return issues;
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
        const issues = await db.aggregate(COLLECTION, LOOKUP_BOOKS_PIPELINE);
        return issues;
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
        const issues = await db.aggregate(COLLECTION, LOOKUP_BOOKS_PIPELINE);
        return issues;
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
        const issues = await db.aggregate(COLLECTION, LOOKUP_BOOKS_PIPELINE);
        return issues;
    };
    //Function that redirects the issue to the final add function
    const add = async(slug, title, description) => {
        const status = "open"
        const project_array = await db.get(COLLECTION_PROJECTS, { slug });
        if (project_array === undefined || project_array.length == 0) {
            const error_message = "there's no project " + slug;
            const response = {
                error: error_message,
            }
            return response;
        }
        const project_id = project_array[0]._id;
        const countVar = await db.count(COLLECTION, { project_id });
        const finalIssueNumber = (slug + '-' + (countVar + 1).toString());
        const results = await db.add(COLLECTION, {
            issueNumber: finalIssueNumber,
            title: title,
            description: description,
            status: status,
            project_id: project_id,
        });
        return results.result;
    }
    return {
        get,
        add,
        aggregate,
        aggregateUnit,
        aggregateAllComments
    }
};