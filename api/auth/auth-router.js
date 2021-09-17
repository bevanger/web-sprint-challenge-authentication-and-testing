const router = require('express').Router();
const { JWT_SECRET } = require('../secrets/index');
const bcrypt = require('bcryptjs');
const tokenBuilder = require('./token-builder');
const { checkUsernameFree, checkValidCredentials, checkUsernameAndPassword } = require('./auth-middleware');

const Users = require('../users/users-model');

router.post('/register', checkValidCredentials, checkUsernameFree, (req, res, next) => {
  let user = req.body

  const rounds = process.env.BCRYPT_ROUNDS || 8;
  const hash = bcrypt.hashSync(user.password, rounds);

  user.password = hash

  Users.add(user)
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)
});

router.post('/login', checkUsernameAndPassword, (req, res, next) => {
  const dbUser = req.user;
  const loginRequest = req.body;

  if(dbUser && bcrypt.compareSync(loginRequest.password, dbUser.password)) {
    const token = tokenBuilder(dbUser)

    res.status(200).json ({ message: `welcome ${dbUser.username}`, token })
  } else {
    next({ message: 'invalid credentials', status: 401 })
  }
});

module.exports = router;
