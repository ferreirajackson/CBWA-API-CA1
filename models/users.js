const db = require('../db')();
const COLLECTION = "users";
//Library of encription
const bcrypt = require('bcrypt')
module.exports = () => {
    //Function that redirects the user to the final get function
    const get = async(email = null) => {
            if (!email) {
                const users = await db.get(COLLECTION);
                if (users === undefined || users.length == 0) {
                    const error_message = "'" + email + "There are no users registered.";
                    const response = {
                        error: error_message,
                    }
                    return response;
                }
                return users;
            }
            const users = await db.get(COLLECTION, { email });
            if (users === undefined || users.length == 0) {
                const error_message = email + " email not found.";
                const response = {
                    error: error_message,
                }
                return response;
            }
            return users;
        }
        //Function that redirects the user to the final add function
    const add = async(name, email, usertype, key) => {
            //Hashing function for API's
            const salt = bcrypt.genSaltSync(11);
            const hash = bcrypt.hashSync(key, salt);
            key = hash;
            const results = await db.add(COLLECTION, {
                name: name,
                email: email,
                usertype: usertype,
                key: key
            });
            return results.result;
        }
        //Function that verifies the api-key and allows the user to 
        //keep using the system
    const getByKey = async(key) => {
        if (!key) {
            console.log(" 01: Missing key");
            return null;
        }
        const users = await db.get(COLLECTION, { key });
        if (users.length !== 1) {
            console.log(" 02: Bad key");
            return null;
        }
        return users[0];
    };
    return {
        get,
        add,
        getByKey
    }
};