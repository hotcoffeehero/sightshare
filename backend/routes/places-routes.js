const express = require('express')
const router = express.Router()

const DUMMY_PLACES = [
    {
      id: 'p1',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      location: {
        lat: 40.7484474,
        lng: -73.9871516
      },
      address: '20 W 34th St, New York, NY 10001',
      creator: 'u1'
    }
  ];

//Get a place by id
router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId
    })
    if(!place){
        const error = new Error("We could not find the place you were looking for...")
        error.code = 404;
        throw error 
    }
    res.json({place})    
})

//Get a place by user id...
router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid
    const place= DUMMY_PLACES.find(p => {
        return p.creator === userId
    })
    if(!place){
        const error = new Error("That user id returns no such place...")
        error.code = 404;
        return next(error) 
    }
    res.json({place})    
})

module.exports = router