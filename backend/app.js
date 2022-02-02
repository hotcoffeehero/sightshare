const express = require('express')
const bodyParser = require('body-parser')
const HttpError = require('./models/http-error')
const mongoose = require('mongoose')
//Routes
const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')

const mongoURI = 'mongodb+srv://hotcoffeehero:mongo1234@proshop.qiu4a.mongodb.net/sightshare?retryWrites=true&w=majority'

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

mongoose
.connect(mongoURI)
.then(()=>{
    app.listen(5000, console.log("Running on 5000"))
})
.catch(err => {
    console.log(err);
})
