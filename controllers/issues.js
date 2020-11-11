const issues = require('../models/issues.js')();
module.exports = () => {
    //Controller that calls the get function to all issues
    const getController = async(req, res) => {
            const { issuesList, error } = await issues.aggregateAllComments();
            if (error) {
                console.log("error")
                return res.status(500).json({ error })
            }
            res.json({ issues: issuesList });
        }
        //Controller that calls get function to an individual issue
    const getById = async(req, res) => {
            const { issuesList, error } = await issues.get(req.params.issueNumber);
            if (error) {
                console.log("error")
                return res.status(500).json({ error })
            }
            res.json({ issues: issuesList });
        }
        //Controller that calls the aggregate function to | 1-issue -> N comments
    const aggregateController = async(req, res) => {
            const { issuesList, error } = await issues.aggregate(req.params.issueNumber);
            if (error) {
                console.log("error")
                return res.status(500).json({ error })
            }
            res.json({ issues: issuesList });
        }
        //Controller that calls the aggregate function to | 1-issue -> 1 comment
    const aggregateUnitController = async(req, res) => {
            const issueNumber = req.params.issueNumber;
            const num = req.params.num;
            const { issuesList, error } = await issues.aggregateUnit(issueNumber, num);
            if (error) {
                console.log("error")
                return res.status(500).json({ error })
            }
            res.json({ issues: issuesList });
        }
        //Controller that calls the add issue function
    const postController = async(req, res) => {
        const slug = req.params.slug;
        const title = req.body.title;
        const description = req.body.description;
        const dueDate = req.body.dueDate;
        const { issuesList, error } = await issues.add(slug, title, description, dueDate);
        if (error) {
            console.log("error")
            return res.status(500).json({ error })
        }
        res.json({ issues: issuesList });
    }
    return {
        getController,
        postController,
        getById,
        aggregateController,
        aggregateUnitController,

    }
}