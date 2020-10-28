const projects = require('../models/projects.js')();
module.exports = () => {
    //Controller that calls the get function to all projects
    const getController = async(req, res) => {
            res.json(await projects.get());
        }
        //Controller that calls get function to an individual project
    const getById = async(req, res) => {
            res.json(await projects.get(req.params.slug));
        }
        //Controller that calls the aggregate function to | 1-project -> N issues
    const aggregateController = async(req, res) => {
            res.json(await projects.aggregate(req.params.slug));
        }
        //Controller that calls the aggregate function to | 1-project -> 1 issue
    const aggregateUnitController = async(req, res) => {
            const slug = req.params.slug;
            const num = req.params.num;
            res.json(await projects.aggregateUnit(slug, num));
        }
        //Controller that calls the update comment issue function
    const updateStatusController = async(req, res) => {
            const slug = req.params.slug;
            const num = req.params.num;
            const status = req.params.status;
            res.json(await projects.updateStatus(slug, num, status));
        }
        //Controller that calls the add project function
    const postController = async(req, res) => {
        const slug = req.body.slug;
        const name = req.body.name;
        const description = req.body.description;
        const result = await projects.add(slug, name, description);
        res.json(result);
    }
    return {
        getController,
        postController,
        getById,
        aggregateController,
        aggregateUnitController,
        updateStatusController
    }
}