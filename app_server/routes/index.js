var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');
var ctrlvolunteers = require('../controllers/volunteers');
/* Locations pages */
router.get('/', ctrlLocations.homelist);
//router.get('/location', ctrlLocations.locationInfo);
router.get('/locations/:locationid', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);


/* Other pages */
router.get('/about', ctrlOthers.about);
router.get('/volunteers/:volunteerid', ctrlvolunteers.volunteerinfo);

module.exports = router;
