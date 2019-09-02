var mongoose = require('mongoose');
var Loc = mongoose.model('locations');
var Vol = mongoose.model('volunteers');
var ErrCodesActions = {
    400: function (res, err) {
        sendJsonResponse(res, 400, {"message": "error", "error": err})
    },
    401: function (res, err) {
        sendJsonResponse(res, 401, {"message": "no ID parameter(s) given", "err": "missing parameters"})
    },
    404: function (res, err) {
        sendJsonResponse(res, 404, {"message": "no document with given ID was found"})
    },
};

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//resolving with full associated  volunteers object
var attachVolsToLocation = function(location) {
    return new Promise(function (resolve, reject) {
        var volsList = Promise.all(location.volunteers.map(function (volunteer) {
            return Vol.findOne({_id: volunteer}, function (err, volunteer) {
                //console.log("vols"+volunteer);
                if(err){
                    reject('DB request failed for one of locations volunteer ID ',err)
                }
                return volunteer
            })
        }));
        volsList.then(function (volsobj) {
            //cloning object via JSON to make possible property additions
            // from another db request (volunteers)
            //location = JSON.parse(JSON.stringify(location));
            location = location.toObject();
            //filtering 'dead' volunteers before saving
            volsobj = volsobj.filter(function (val) {
                return val != null
            });
            location.volunteers = volsobj;
            resolve(location)
        }).catch(function(err){
            reject(err)
        });

    })
};

module.exports.locationsCreate = function (req, res) {
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        rating: req.body.rating,
        waterSource: req.body.waterSource,
        facilities: req.body.facilities,
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        // feedingSchedule: [feedingScheduleSchema],
        volunteers: req.body.volunteers.split(","),
        // catsList:[catsListSchema]
    }, function (err, location) {
        if (err) {
            ErrCodesActions[400](res, err)
        }
        else {
            sendJsonResponse(res, 200, location)
        }
    })
};

module.exports.locationsReadOne = function (req, res) {
    if (req.params && req.params.locationid) {
        var locId = req.params.locationid;

        Loc.findOne({_id: locId}, function (err, location) {
            if (err) {
                ErrCodesActions[400](res, err)
            }
            else if (!location) {
                ErrCodesActions[404](res)
            }
            else {
                attachVolsToLocation(location).then(function(location){

                    sendJsonResponse(res, 220, location)
                });


            }
        });
    }
    else {
        ErrCodesActions[400](res, err)
    }

};

module.exports.locationsUpdateOne = function (req, res) {
    if (req.params && req.params.locationid) {
        var locId = req.params.locationid;
        Loc.findOne({_id: locId}).select("-rating -volunteers").exec(function (err, location) {
            if (!location) {
                sendJsonResponse(res, 404, {
                    "message": "locationid not found"
                });
                return;
            }
            else if (err) {
                ErrCodesActions[400](res, err);
                return;
            }
            req.body.rating ? location.name = req.body.rating : null;
            req.body.name ? location.name = req.body.name : null;
            req.body.address ? location.address = req.body.address : null;
            //location.rating: req.body.rating;
            req.body.facilities ? location.facilities = req.body.facilities : null;
            req.body.lng && req.body.lat ? location.coords =
                [parseFloat(req.body.lng), parseFloat(req.body.lat)] : null;

            req.body.volunteers ? location.volunteers = req.body.volunteers.split(",") : null;
            //put to child doc
            // location.days= req.body.days;
            // location.opening= req.body.opening;
            // location.closing= req.body.closing;
            // location.closed= req.body.closed;
            location.save().then(function (location) {
                attachVolsToLocation(location).then
                (location=> sendJsonResponse(res, 200, location))

            }).catch(function (err) {
                console.log('location saving error', err);
                ErrCodesActions[400](res, err)
            })
        });
    } else {
        ErrCodesActions[401](res);
    }
};

module.exports.locationsDeleteOne = function (req, res) {
    if (req.params && req.params.locationid) {
        var locId = req.params.locationid;

        Loc.findByIdAndRemove(locId).exec(function (err, location) {

            if (err) {
                ErrCodesActions[400](res, err)
            }
            else if (!location) {
                ErrCodesActions[404](res)
            }
            else {
                sendJsonResponse(res, 204, null)
            }
        });
    }
    else {
        ErrCodesActions[401](res)
    }
};


/* locations by distance  /api/locations?lng=0.876876&lat=0.812358&dst=40000  (for dist 4000m)*/
module.exports.locationsListByDistance = function (req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDist = parseInt(req.query.dst);
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };

    if (!lng || !lat || !maxDist) {
        sendJsonResponse(res, 400, {
            "message": "lng and lat query parameters are required", "err": "missing parameters"
        });
        return
    }
    Loc.aggregate([{
        "$geoNear": {
            near: point,
            spherical: true,
            num: 10,
            maxDistance: maxDist, //meters
            distanceField: "distance"
        }

        //db-level convertation - disabled - was implemented at controller level
        // }, {
        //     "$addFields": {
        //         distance: {$toInt: "$distance"},
        //
        //     }
    }

    ]).exec(function (err, locationsbydst) {
            if (err) {
                ErrCodesActions[400](res, err)
            }
            else {
                locationsbydst.forEach(function (loc) {
                    //var distInMeters=loc.distance;
                    var distInkm = loc.distance / 1000;
                    if (distInkm < 2) {
                        loc.distance = String(Math.ceil(loc.distance)) + ' m'
                    }
                    else {
                        loc.distance = String(Math.ceil(loc.distance / 1000)) + ' km'
                    }

                });
                sendJsonResponse(res, 220, locationsbydst)
            }
        }
    )
};

//finding volunteers
exports.getVolunteersByLocId = (req, res) => {
    if (req.params && req.params.locationid) {
        var locId = req.params.locationid;

        Loc.findOne({_id: locId}).select("volunteers")
            .exec(function (err, location) {
                if (err) {
                    ErrCodesActions[400](res, err)
                } else if (!location) {
                    ErrCodesActions[404](res)
                } else {

                    var volunteers = location.volunteers;

                    sendJsonResponse(res, 220, volunteers)
                }

            });
    }
    else {
        ErrCodesActions[401](res)
    }
};