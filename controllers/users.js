const users = require('../models/users.js')();
module.exports = () => {
    //Controller that calls the get function to all users
    const getController = async(req, res) => {
        const { userList, error } = await users.get();
        if (error) {
            console.log("error")
            return res.status(500).json({ error })
        }
        res.json({ users: userList });
    };
    //Controller that calls get function to an individual user
    const getById = async(req, res) => {
            const { userList, error } = await users.get(req.params.email);
            if (error) {
                console.log("error")
                return res.status(500).json({ error })
            }
            res.json({ users: userList });
        }
        //Controller that calls the add user function
    const postController = async(req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const usertype = req.body.usertype;
        const key = req.body.key;
        const { userList, error } = await users.add(name, email, usertype, key);
        if (error) {
            console.log("error")
            return res.status(500).json({ error })
        }
        res.json({ users: userList });
    }
    return {
        getController,
        postController,
        getById
    }
}