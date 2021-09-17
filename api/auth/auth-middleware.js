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

const checkValidCredentials = (req, res, next) => {
    if(!req.body.username || !req.body.password) {
            next({ message: 'username and password required', status: 401});
    } else { 
        next()
    }
}

const checkUsernameAndPassword = (req, res, next) => {
   if(req.body.username && req.body.password) {
       const { username } = req.body

       Users.findBy({username})
        .then((credentials) => {
            if(credentials.length > 0) {
                req.user = credentials[0]
                next()
            } else {
                next({ message: 'invalid credentials', status: 400})
            }
        })
        .catch(next)
   } else {
       next({ message: 'username and password required', status: 400})
   }
}


module.exports = {
    checkUsernameFree,
    checkValidCredentials,
    checkUsernameAndPassword
}