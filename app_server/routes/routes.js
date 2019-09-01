var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');
var ctrlvolunteers = require('../controllers/volunteers');
/* Locations pages */
router.get('/', ctrlLocations.homelist);
//router.get('/location', ctrlLocations.locationInfo);
router.get('/locations/:locationid', ctrlLocations.locationInfo);
//router.get('/locations/:locationid', ctrlvolunteers.volunteerCreatePage);
//router.get('/location/new/review', ctrlLocations.addReview);
/* Other pages */
router.get('/about', ctrlOthers.about);

router.get('/volunteers/:volunteerid', ctrlvolunteers.volunteerEditPage);
router.post('/volunteers/:volunteerid', ctrlvolunteers.volunteerEditCommit);

router.get('/volunteer',ctrlvolunteers.volunteerCreatePage);
router.post('/volunteer', ctrlvolunteers.volunteerCreateCommit);
//data manipulation



module.exports = router;
