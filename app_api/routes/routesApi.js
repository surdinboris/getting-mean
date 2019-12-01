let express = require('express');
let router = express.Router();
let ctrlLocations = require('../controllers/locationsApi');
let ctrlVolunteers = require('../controllers/volunteersApi');
let ctrlPhotos = require('../controllers/galleryApi');

let ctrlCats = require('../controllers/catsApi');
// locations
router.get('/locations', ctrlLocations.locationsListByDistance); //done
router.get('/locations/all', ctrlLocations.locationsList); //done
router.post('/locations', ctrlLocations.locationsCreate); //done
//schema requests
//router.get('/volunteer/schema', ctrlVolunteers.volunteerSchema); //done
router.get('/:model/schema', ctrlLocations.getModelSchema); //shared for all models - putted in locations controller

//router.get('/cat/schema',ctrlCats.catSchema);

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



//cat creation
router.post('/cats', ctrlCats.catsCreate); //done
router.get('/cats', ctrlCats.catsReadAll); //done

router.get('/locations/:locationid/cats',
    ctrlCats.catsByLocation); //done
router.get('/cats/:catid', ctrlCats.catsReadOne); //done
router.put('/cats/:catid', ctrlCats.catsUpdateOne); //done

router.delete('/locations/:locationid/cats/:catid',
    ctrlCats.catsDeleteOne); //done

router.get('/cat-photos/:modid', ctrlPhotos.getModPhotos);
router.post('/cat-photos/:modid', ctrlPhotos.uploadPhotoToDB);
router.delete('/cat-photos/:modid/:photoid', ctrlPhotos.deleteFromDB);

//router.get('/cat-photos/:modid/avatar', ctrlPhotos.getModPhotos);
router.get('/volunteer-photos/:modid', ctrlPhotos.getModPhotos);

module.exports = router;