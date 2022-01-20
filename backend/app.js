const express = require('express')
const bodyParser = require('body-parser')

//Routes
const placesRoutes = require('../backend/routes/places-routes')

const app = express()

app.use('/api/places', placesRoutes)

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || "An unknown error occured..."})
})

app.listen(5000, console.log("Running on 5000"))