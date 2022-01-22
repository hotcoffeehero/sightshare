const express = require('express')
const bodyParser = require('body-parser')
const HttpError = require('../backend/models/http-error')
//Routes
const placesRoutes = require('../backend/routes/places-routes')
const usersRoutes = require('../backend/routes/users-routes')

const app = express()


//MIDDLEWARE

app.use(bodyParser.json())

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)

//Error handler for undefined routes
app.use((req, res, next) => {
    const error = new HttpError("Could not find this route, bro...", 404)
    throw error
})

//Error handler for defined routes
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || "An unknown error occured..."})
})

app.listen(5000, console.log("Running on 5000"))