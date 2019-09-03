let express = require('express');
let router = express.Router();
let ctrlLocations = require('../controllers/locationsApi');
let ctrlVolunteers = require('../controllers/volunteersApi');
let ctrlCats = require('../controllers/catsApi');
// locations
router.get('/locations', ctrlLocations.locationsListByDistance); //done
router.post('/locations', ctrlLocations.locationsCreate); //done
router.get('/locations/:locationid', ctrlLocations.locationsReadOne); //done
router.get('/locations/:locationid/volunteers', ctrlLocations.getVolunteersByLocId); //done
router.put('/locations/:locationid', ctrlLocations.locationsUpdateOne); //done
router.delete('/locations/:locationid', ctrlLocations.locationsDeleteOne); //done
//volunteers
router.post('/volunteers', ctrlVolunteers.volunteersCreate); //done
router.get('/volunteers', ctrlVolunteers.volunteersReadAll); //done
router.get('/volunteers/view-locations/:volunteerid', ctrlVolunteers.volunteersLocations);
router.get('/volunteers/:volunteerid',
    ctrlVolunteers.volunteersReadOne); //done
router.put('/volunteers/:volunteerid',
    ctrlVolunteers.volunteersUpdateOne); //done
router.delete('/volunteers/:volunteerid',
    ctrlVolunteers.volunteersDeleteOne); //done
//cats
router.post('/locations/:locationid/cats', ctrlCats.catsCreate); //done
router.get('/locations/:locationid/cats',
    ctrlCats.catsByLocation); //done
router.get('/locations/:locationid/cats/:catid',
    ctrlCats.catsReadOne); //done
router.put('/locations/:locationid/cats/:catid',
    ctrlCats.catsUpdateOne); //done
router.delete('/locations/:locationid/cats/:catid',
    ctrlCats.catsDeleteOne); //done

module.exports = router;