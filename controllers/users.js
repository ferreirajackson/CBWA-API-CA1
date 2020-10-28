const users = require('../models/users.js')();
module.exports = () => {
    //Controller that calls the get function to all users
    const getController = async(req, res) => {
            res.json(await users.get());
        }
        //Controller that calls get function to an individual user
    const getById = async(req, res) => {
            res.json(await users.get(req.params.email));
        }
        //Controller that calls the add user function
    const postController = async(req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const usertype = req.body.usertype;
        const key = req.body.key
        const result = await users.add(name, email, usertype, key);
        res.json(result);
    }
    return {
        getController,
        postController,
        getById
    }
}