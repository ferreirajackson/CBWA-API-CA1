const db = require('../db')();
const COLLECTION = "users";
//Library of encription
//const bcrypt = require('bcrypt')
module.exports = () => {
    //Function that redirects the user to the final get function
    const get = async(email = null) => {
            if (!email) {
                try {
                    const users = await db.get(COLLECTION);
                    if (users === undefined || users.length == 0) {
                        const error_message = "'" + email + "There are no users registered.";
                        const response = {
                            error: error_message,
                        }
                        return response;
                    }
                    return { userList: users };
                } catch (ex) {
                    console.log("-=-=-=-=-=- ERROR AT: GET ALL USER -=-=-=-=-=-")
                    return { error: ex }
                }

            }
            try {
                const users = await db.get(COLLECTION, { email });
                if (users === undefined || users.length == 0) {
                    const error_message = email + " email not found.";
                    const response = {
                        error: error_message,
                    }
                    return response;
                }
                console.log("got here")
                return { userList: users };
            } catch (ex) {
                console.log("-=-=-=-=-=- ERROR AT: GET AN USER -=-=-=-=-=-")
                return { error: ex }
            }
        }
        //Function that redirects the user to the final add function
    const add = async(name, email, usertype, key) => {
            //Hashing function for API's
            /*const salt = bcrypt.genSaltSync(11);
            const hash = bcrypt.hashSync(key, salt);
            key = hash;*/

            //Checks if all the fiels were informed
            if (name === undefined || name.length == 0 || email === undefined || email.length == 0 || usertype === undefined || usertype.length == 0 || key === undefined || key.length == 0) {
                const error_message = "It was not possible to create the user, please inform all the following information: name, email, usertype and key.";
                const response = {
                    error: error_message,
                }
                return response;
            }

            //Checking if the user email is duplicated
            try {
                const users = await db.get(COLLECTION, { email });
                console.log(users.length);
                if (users.length > 0) {
                    const error_message = "The email " + email + " already exists in the bugtracker database. Try typing another email:";
                    const response = {
                        error: error_message,
                    }
                    return response;
                }
            } catch (ex) {
                console.log("-=-=-=-=-=- ERROR AT: ADD USER/CHECKING IF IS DUPLICATED -=-=-=-=-=-")
                return { error: ex }
            }

            //Adding user
            try {
                const results = await db.add(COLLECTION, {
                    name: name,
                    email: email,
                    usertype: usertype,
                    key: key
                });
                return { userList: 'User successfully added' };
            } catch (ex) {
                console.log("-=-=-=-=-=- ERROR AT: ADD USER/PROPER ADDITION -=-=-=-=-=-")
                return { error: ex }
            }

        }
        //Function that verifies the api-key and allows the user to 
        //keep using the system
    const getByKey = async(key) => {
        if (!key) {
            console.log(" 01: Missing key");
            return null;
        }

        try {
            const users = await db.get(COLLECTION, { key });
            if (users.length !== 1) {
                console.log(" 02: Bad key");
                return null;
            }
            return users[0];
        } catch (ex) {
            console.log("-=-=-=-=-=- ERROR AT: GET BY ID USER -=-=-=-=-=-")
            return { error: ex }
        }

    };
    return {
        get,
        add,
        getByKey
    }
};