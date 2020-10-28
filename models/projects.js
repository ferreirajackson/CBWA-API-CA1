const db = require('../db')();
const COLLECTION = "projects";
const COLLECTION_ISSUES = "issues";
module.exports = () => {
    //Function that redirects the project to the final get function
    const get = async(slug = null) => {
            if (!slug) {
                const projects = await db.get(COLLECTION);
                return projects;
            }
            const projects = await db.get(COLLECTION, { slug });
            return projects;
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
        const projects = await db.aggregate(COLLECTION, LOOKUP_BOOKS_PIPELINE);
        return projects;
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
        const projects = await db.aggregate(COLLECTION, LOOKUP_BOOKS_PIPELINE);
        return projects;
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

        const arrayProjects = await db.get(COLLECTION, { slug });
        if (arrayProjects === undefined || arrayProjects.length == 0) {
            const error_message = "there's no projects " + slug;
            const response = {
                error: error_message,
            }
            return response;
        }
        const project_id = arrayProjects[0]._id;
        const arrayIssues = await db.get(COLLECTION_ISSUES, { project_id });
        if (arrayIssues === undefined || arrayIssues.length == 0) {
            const error_message = "there's no issue number " + num;
            const response = {
                error: error_message,
            }
            return response;
        }
        const countVar = await db.count(COLLECTION_ISSUES, { project_id });
        if (num > countVar) {
            const error_message = "Issue number " + num + " doesn't exist.";
            const response = {
                error: error_message,
            }
            return response;
        }
        const _id = arrayIssues[num - 1]._id;
        const newValues = { $set: { status: status } };
        const projects = await db.upd(COLLECTION_ISSUES, { _id }, newValues);
        return projects;
    };
    //Function that redirects the project to the final add function
    const add = async(slug, name, description) => {
        const results = await db.add(COLLECTION, {
            slug: slug,
            name: name,
            description: description
        });
        return results.result;
    }
    return {
        get,
        add,
        aggregate,
        aggregateUnit,
        updateStatus
    }
};