const issues = require('../models/issues.js')();
module.exports = () => {
    //Controller that calls the get function to all issues
    const getController = async(req, res) => {
            res.json(await issues.aggregateAllComments());
        }
        //Controller that calls get function to an individual issue
    const getById = async(req, res) => {
            res.json(await issues.get(req.params.issueNumber));
        }
        //Controller that calls the aggregate function to | 1-issue -> N comments
    const aggregateController = async(req, res) => {
            res.json(await issues.aggregate(req.params.issueNumber));
        }
        //Controller that calls the aggregate function to | 1-issue -> 1 comment
    const aggregateUnitController = async(req, res) => {
            const issueNumber = req.params.issueNumber;
            const num = req.params.num;
            res.json(await issues.aggregateUnit(issueNumber, num));
        }
        //Controller that calls the add issue function
    const postController = async(req, res) => {
        const slug = req.params.slug;
        const title = req.body.title;
        const description = req.body.description;
        //const status = req.body.status;
        //const project_id = req.body.project_id;
        const result = await issues.add(slug, title, description);
        res.json(result);
    }
    return {
        getController,
        postController,
        getById,
        aggregateController,
        aggregateUnitController,

    }
}