const comments = require('../models/comments.js')();
module.exports = () => {
    //Controller that calls the get function to all comments
    const getController = async(req, res) => {
            const { commentsList, error } = await comments.get();
            if (error) {
                console.log("error")
                return res.status(500).json({ error })
            }
            res.json({ comments: commentsList });
        }
        //Controller that calls get function to an individual comment
    const getById = async(req, res) => {
            const { commentsList, error } = await comments.get(req.params.author);
            if (error) {
                console.log("error")
                return res.status(500).json({ error })
            }
            res.json({ comments: commentsList });
        }
        //Controller that calls the add comment function
    const postUnitController = async(req, res) => {
        const text = req.body.text;
        const issueNumber = req.params.issueNumber;
        const author = req.body.author;
        const { commentsList, error } = await comments.addComments(text, issueNumber, author);
        if (error) {
            console.log("error")
            return res.status(500).json({ error })
        }
        res.json({ comments: commentsList });
    }
    return {
        getController,
        getById,
        postUnitController
    }
}