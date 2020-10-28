const comments = require('../models/comments.js')();
module.exports = () => {
    //Controller that calls the get function to all comments
    const getController = async(req, res) => {
            res.json(await comments.get());
        }
        //Controller that calls get function to an individual comment
    const getById = async(req, res) => {
            res.json(await comments.get(req.params.author));
        }
        //Controller that calls the add comment function
    const postUnitController = async(req, res) => {
        const text = req.body.text;
        const issueNumber = req.params.issueNumber;
        const author = req.body.author;
        const result = await comments.addComments(text, issueNumber, author);
        res.json(result);
    }
    return {
        getController,
        getById,
        postUnitController
    }
}