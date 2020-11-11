const projects = require('../models/projects.js')();
module.exports = () => {
    //Controller that calls the get function to all projects
    const getController = async(req, res) => {
            const { projectsList, error } = await projects.get();
            if (error) {
                console.log("error")
                return res.status(500).json({ error })
            }
            res.json({ projects: projectsList });
        }
        //Controller that calls get function to an individual project
    const getById = async(req, res) => {
            console.log('GOT HERE')
            const { projectsList, error } = await projects.get(req.params.slug);
            if (error) {
                console.log("error")
                return res.status(500).json({ error })
            }
            res.json({ projects: projectsList });
        }
        //Controller that calls the aggregate function to | 1-project -> N issues
    const aggregateController = async(req, res) => {
            const { projectsList, error } = await projects.aggregate(req.params.slug);
            if (error) {
                console.log("error")
                return res.status(500).json({ error })
            }
            res.json({ projects: projectsList });
        }
        //Controller that calls the aggregate function to | 1-project -> 1 issue
    const aggregateUnitController = async(req, res) => {
            const slug = req.params.slug;
            const num = req.params.num;
            const { projectsList, error } = await projects.aggregateUnit(slug, num);
            if (error) {
                console.log("error")
                return res.status(500).json({ error })
            }
            res.json({ projects: projectsList });
        }
        //Controller that calls the update comment issue function
    const updateStatusController = async(req, res) => {
            const slug = req.params.slug;
            const num = req.params.num;
            const status = req.params.status;
            const { projectsList, error } = await projects.updateStatus(slug, num, status);
            if (error) {
                console.log("error")
                return res.status(500).json({ error })
            }
            res.json({ projects: projectsList });
        }
        //Controller that calls the add project function
    const postController = async(req, res) => {
        const slug = req.body.slug;
        const name = req.body.name;
        const description = req.body.description;
        const { projectsList, error } = await projects.add(slug, name, description);
        if (error) {
            console.log("error")
            return res.status(500).json({ error })
        }
        res.json({ projects: projectsList });
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