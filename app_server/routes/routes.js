let express = require('express');
let router = express.Router();
let ctrlLocations = require('../controllers/locations');
let ctrlOthers = require('../controllers/others');
let ctrlVolunteers = require('../controllers/volunteers');
let ctrlCats = require('../controllers/cats');
/* Locations pages */

router.get('/cats', ctrlCats.catCreatePage);
//router.post('/cats', ctrlCats.catCreateCommit);
router.post('/cats', ctrlCats.childmodelCreateCommit);

/* Other pages */
router.get('/about', ctrlOthers.about);
router.get('/', ctrlLocations.homelist);
router.get('/locations/:locationid', ctrlLocations.locationInfo);
//router.get('/location/new/review', ctrlLocations.addReview);
router.get('/volunteers/:volunteerid', ctrlVolunteers.volunteerEditPage);
router.get('/volunteers/delete/:volunteerid', ctrlVolunteers.deleteVolunteer);
router.get('/volunteers/view-locations/:volunteerid', ctrlVolunteers.volunteersLocations);
router.get('/volunteers/', ctrlVolunteers.volunteersList);
router.post('/volunteers/:volunteerid', ctrlVolunteers.volunteerEditCommit);

//creation
router.get('/volunteer',ctrlVolunteers.volunteerCreatePage);
//router.post('/volunteer', ctrlVolunteers.volunteerCreateCommit);
router.post('/volunteer', ctrlVolunteers.childmodelCreateCommit);
router.get('/location/', ctrlLocations.locationCreatePage);
router.post('/location/', ctrlLocations.locationCreateCommit);
router.get('/assignVolunteer',ctrlVolunteers.volunteerAssignPage);
router.post('/assignVolunteer', ctrlVolunteers.volunteerAssignCommit);

//data manipulation



module.exports = router;
