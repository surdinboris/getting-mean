let express = require('express');
let router = express.Router();
let ctrlLocations = require('../controllers/locations');
let ctrlOthers = require('../controllers/others');
let ctrlvolunteers = require('../controllers/volunteers');
/* Locations pages */
router.get('/', ctrlLocations.homelist);
//router.get('/location', ctrlLocations.locationInfo);
router.get('/locations/:locationid', ctrlLocations.locationInfo);
//router.get('/locations/:locationid', ctrlvolunteers.volunteerCreatePage);
//router.get('/location/new/review', ctrlLocations.addReview);
/* Other pages */
router.get('/about', ctrlOthers.about);

router.get('/volunteers/:volunteerid', ctrlvolunteers.volunteerEditPage);
router.get('/volunteers/delete/:volunteerid', ctrlvolunteers.deleteVolunteer);
router.get('/volunteers/view-locations/:volunteerid', ctrlvolunteers.volunteersLocations);
router.get('/volunteers/', ctrlvolunteers.volunteersList);
router.post('/volunteers/:volunteerid', ctrlvolunteers.volunteerEditCommit);

router.get('/volunteer',ctrlvolunteers.volunteerCreatePage);
router.post('/volunteer', ctrlvolunteers.volunteerCreateCommit);

router.get('/assignVolunteer',ctrlvolunteers.volunteerAssignPage);
router.post('/assignVolunteer', ctrlvolunteers.volunteerAssignCommit);


//data manipulation



module.exports = router;
