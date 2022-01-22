const express = require('express')
const router = express.Router()

const placesControllers = require('../controllers/places-controller')

//Get a place by id
router.get('/:pid', placesControllers.getPlaceById)

//Get a place by user id...
router.get('/user/:uid', placesControllers.getPlacesByUserId )

//Add a new place
router.post('/', placesControllers.createPlace)

//Update a place
router.patch('/:pid', placesControllers.updatePlace)

//Delete a place
router.delete('/:pid', placesControllers.deletePlace)

module.exports = router