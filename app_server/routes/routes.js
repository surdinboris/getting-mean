let express = require('express');
let router = express.Router();
let ctrlLocations = require('../controllers/locations');
let ctrlOthers = require('../controllers/others');
let ctrlVolunteers = require('../controllers/volunteers');
let ctrlCats = require('../controllers/cats');
let ctrlGallery = require('../controllers/gallery');
/* Locations pages */

router.get('/cat', ctrlCats.catCreatePage);
//router.post('/cats', ctrlCats.catCreateCommit);
router.post('/cat', ctrlCats.childmodelCreateCommit);
//to be implenented after modelassignment refactory to support both cats and locations
router.get('/assignCat',ctrlCats.catAssignPage);
router.post('/assignCat', ctrlCats.catAssignCommit);
router.get('/cats/:catid', ctrlCats.catEditPage);
router.post('/cats/:catid',  ctrlCats.catEditCommit);

/* Other pages */
router.get('/about', ctrlOthers.about);
router.get('/', ctrlLocations.homelist);
router.get('/locations/:locationid', ctrlLocations.locationInfo);
router.get('/location/', ctrlLocations.locationCreatePage);
router.post('/location/', ctrlLocations.locationCreateCommit);
//router.get('/location/new/review', ctrlLocations.addReview);

router.get('/volunteers/:volunteerid', ctrlVolunteers.volunteerEditPage);
router.get('/volunteers/delete/:volunteerid', ctrlVolunteers.deleteVolunteer);
router.get('/volunteers/view-locations/:volunteerid', ctrlVolunteers.volunteersLocations);
router.get('/volunteers/', ctrlVolunteers.volunteersList);
router.post('/volunteers/:volunteerid', ctrlVolunteers.volunteerEditCommit);
//creation
router.get('/volunteer',ctrlVolunteers.volunteerCreatePage);
router.post('/volunteer', ctrlVolunteers.childmodelCreateCommit);
router.get('/assignVolunteer',ctrlVolunteers.volunteerAssignPage);
router.post('/assignVolunteer', ctrlVolunteers.volunteerAssignCommit);

//data manipulation

//photos
//router.get('/photos/volunteers/:volunteerid', ctrlVolunteers.getVolunteerPhotos);
router.get('/photos/cats/:catid', ctrlGallery.getCatPhotos);
router.get('/photos/cats/:catid/avatar', ctrlGallery.getCatAvatar);
//router.get('/photos/cats/:volid', ctrlCats.getVolPhotos);

module.exports = router;
