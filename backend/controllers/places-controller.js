const HttpError = require('../models/http-error')
const { v4: uuid } = require('uuid')
const { validationResult, check } = require('express-validator')
const getCoordsForAddress = require('../../backend/util/location')
const Place = require('../models/place')
const place = require('../models/place')

let DUMMY_PLACES = [
    {
      id: 'p1',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      // location: {
      //   lat: 40.7484474,
      //   lng: -73.9871516
      // },
      address: '20 W 34th St, New York, NY 10001',
      creator: 'u1'
    }
  ];

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid
    let place
    try {
      place = await Place.findById(placeId)
    } catch (err) {
      const error = new HttpError('Something went wrong. Could not find a place.', 500)
      return next(error)
    }
    
    if(!place){
         const error = new HttpError("We could not find the place you were looking for...", 404)
         return next(error)
    }
    res.json({place: place.toObject({ getters: true })})    
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid
    let places
    try {
      places= await Place.find({ creator: userId })
    } catch (err) {
      const error = new HttpError("Something went wrong or that user hasn't posted anything...", 500)
      return next(error)
    }
    if(!places || places.length === 0){
        return next(
            new HttpError("This user hasn't added any places...", 404)
        )
    }
    res.json({places: places.map(place => place.toObject({ getters: true }))})    
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
  
    const { title, description, address, creator } = req.body;
  
    let coordinates;
    try {
      coordinates = await getCoordsForAddress(address);
    } catch (error) {
      return next(error);
    }
  
    // const title = req.body.title;
    const createdPlace = new Place({
      title,
      description,
      address,
      location: coordinates,
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
      creator
    })
  
    try {
      createdPlace.save()
    } catch (err) {
      const error = new HttpError('Creating place failed. Please try again.', 500)
      return next(error)
    }
  
    res.status(201).json({ place: createdPlace });
  };

const updatePlace = async (req, res, next) => {
    //Error handling for API input
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw new HttpError('Your input is invalid, check your data', 422)
    }
   
    const { title, description } = req.body
    const placeId = req.params.pid

    let place 
    try {
      place = await Place.findById(placeId)
    } catch (err) {
      const error = new HttpError("Something went wrong. Couldn't make the update", 500)
      return next(error)
    }
    place.title = title
    place.description = description

    try {
      await place.save()
    } catch (err) {
      const error = new HttpError("Something went wrong. Your data wasn't saved.", 500)
      return next(error)
    }

    res.status(200).json({place: place.toObject({ getters: true })})
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.id
    //Checking to see if the place we want to delete exists
    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HttpError('No such place exists', 404)
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
    res.status(200).json({ message: "This place has been deleted." })
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace