const express = require('express')
const router = express.Router()

const usersControllers = require('../controllers/users-controller')

//Get a list of users
router.get('/', usersControllers.getUsers)

//Register a new user
router.post('/signup', usersControllers.signup)

//Login a new user
router.post('/login', usersControllers.login)





module.exports = router