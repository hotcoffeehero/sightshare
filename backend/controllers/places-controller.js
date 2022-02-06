const HttpError = require('../models/http-error')
const { v4: uuid } = require('uuid')
const { validationResult, check } = require('express-validator')
const getCoordsForAddress = require('../../backend/util/location')
const Place = require('../models/place')

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

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId
    })
    if(!place){
         throw new HttpError("We could not find the place you were looking for...", 404)
    }
    res.json({place})    
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid
    const places= DUMMY_PLACES.find(p => {
        return p.creator === userId
    })
    if(!places || places.length === 0){
        return next(
            new HttpError("This user hasn't added any places...", 404)
        )
    }
    res.json({places})    
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

const updatePlace = (req, res, next) => {
    //Error handling for API input
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw new HttpError('Your input is invalid, check your data', 422)
    }
    // TEST: checking a length on modifying the description of a place
    const rightLength = check('description').not().isLength({min: 5})
    if(!rightLength) {
        throw new HttpError('Changes have to be at least five characters long...', 422)
    }
    //////////////////////////////
    const { title, description } = req.body
    const placeId = req.params.pid

    const updatedPlace = { ...DUMMY_PLACES.filter(p => p.id === placeId) }
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)
    updatedPlace.title = title
    updatedPlace.description = description

    DUMMY_PLACES[placeIndex] = updatedPlace

    res.status(200).json({place: updatedPlace})
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