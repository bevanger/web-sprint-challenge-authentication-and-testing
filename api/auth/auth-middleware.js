const Users = require('../users/users-model');

const checkUsernameFree = (req, res, next) => {
    Users.findBy('username', req.body.username)
        .then((usernameIsTaken) => {
            if(usernameIsTaken.length > 0) {
                next({ message: 'username taken', status: 422 });
            } else {
                next()
            }
        })
}

const checkValidRegistration = (req, res, next) => {
    if(req.body.username && req.body.password) {
            next();
    } else { 
        next({ message: 'username and password required', status: 401})
    }
}

module.exports = {
    checkUsernameFree,
    checkValidRegistration
}