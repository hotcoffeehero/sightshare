const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

const usersControllers = require('../controllers/users-controller')

//Get a list of users
router.get('/', usersControllers.getUsers)

//Register a new user
router.post('/signup', [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
],usersControllers.signup)

//Login a new user
router.post('/login', usersControllers.login)





module.exports = router