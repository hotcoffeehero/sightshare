const { v4: uuid } = require('uuid')
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')

DUMMY_USERS = [
    {
        "id": "u1", 
        "name": "Clinton A.",
        "email": "clinton@gmail.com", 
        "password": "123456" 
    },
    {
        "id": "u2", 
        "name": "Mike K.",
        "email": "mike@gmail.com", 
        "password": "123456" 
    },
    {
        "id": "u3", 
        "name": "Morgan F.",
        "email": "morgan@gmail.com", 
        "password": "123456" 
    }
]


const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USERS})
}

const signup = (req, res, next) => {
    //Error handling for API input
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw new HttpError('Your input is invalid, check your data', 422)
    }
    //
    const { name, email, password } = req.body
    //Check to see if a user already exists by screening the email
    const hasUser = DUMMY_USERS.find(u => u.email === email)
    if(hasUser) {
        throw new HttpError('That user already exists...', 422)
    }
    const createdUser = {
        id: uuid(),
        name,
        email,
        password
    }
    DUMMY_USERS.unshift(createdUser)
    res.status(201).json({user: createdUser})
}

const login = (req, res, next) => {
    const { email, password }  = req.body
    //search to see if a user exists AND if their info matches
    const identifiedUser = DUMMY_USERS.find(u => u.email === email)
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Either there is no user or your info is wrong', 401)
    } 
    res.json({message: "You're logged in!"})
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login