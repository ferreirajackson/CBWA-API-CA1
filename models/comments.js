const db = require('../db')();
const COLLECTION = "comments";
const COLLECTION_ISSUES = "issues";
const COLLECTION_USERS = "users";
module.exports = () => {
    //Function that redirects the comment to the final get function
    const get = async(author = null) => {
            console.log(' inside comments model');
            if (!author) {
                const comments = await db.get(COLLECTION);
                return comments;
            }
            const comments = await db.get(COLLECTION, { author });
            return comments;
        }
        //Function that verify and redirects the comment to the final add function
    const addComments = async(text, issueNumber, author) => {
        //issues information
        const issue_array = await db.get(COLLECTION_ISSUES, { issueNumber });
        if (issue_array === undefined || issue_array.length == 0) {
            const error_message = "there's no issue named: " + issueNumber;
            const response = {
                error: error_message,
            }
            return response;
        }
        const issue_id = issue_array[0]._id;

        //users information
        const email = author;
        const author_array = await db.get(COLLECTION_USERS, { email });
        if (author_array === undefined || author_array.length == 0) {
            const error_message = "there's no user " + email;
            const response = {
                error: error_message,
            }
            return response;
        }
        const author_id = author_array[0]._id;

        //comments information
        const countComments = await db.count(COLLECTION, { issue_id });
        const finalIdNumber = countComments + 1;

        const results = await db.add(COLLECTION, {
            id: finalIdNumber,
            text: text,
            issue_id: issue_id,
            author: email,
            author_id: author_id,
        });
        return results.result;
    }
    return {
        get,
        addComments
    }
};