let mongoose = require('mongoose');
let Loc = mongoose.model('locations');
let Vol = mongoose.model('volunteers');
let ErrCodesActions = {
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

let sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//resolving with full associated  volunteers object
let attachVolsToLocation = function(location) {
    return new Promise(function (resolve, reject) {
        let volsList = location.volunteers.map(function (volunteer) {
            return new Promise(function (resolve2, reject2) {
                Vol.findOne({_id: volunteer}, function (err, volobj) {

                    if (err) {
                        reject2('DB request failed for one of locations volunteer ID ', err)
                    }
                    resolve2(volobj)
                })
            });
        });

        Promise.all(volsList).then(function (volslist) {

            //cloning object via JSON to make possible property additions
            // from another db request (volunteers)
            //location = JSON.parse(JSON.stringify(location));
            location = location.toObject();
            //filtering 'dead' volunteers before saving
            volslist = volslist.filter(function (val) {
                return val != null
            });
            location.volunteers = volslist;
            resolve(location)
        }).catch(function(err){
            reject(err)
        });

    })
};
//     console.log(location.volunteers);
//     return new Promise(function (resolve, reject) {
//         let volsList = Promise.all(location.volunteers.map(function (volunteer) {
//             console.log(volunteer);
//             return Vol.findOne({_id:volunteer}, function (err, volobj) {
//                 console.log("searching "+ volobj);
//                 if(err){
//                     reject('DB request failed for one of locations volunteer ID ',err)
//                 }
//                 return volobj
//             })
//         }));
//         volsList.then(function (volsobj) {
//             console.log('volsobj====',volsobj);
//             //cloning object via JSON to make possible property additions
//             // from another db request (volunteers)
//             //location = JSON.parse(JSON.stringify(location));
//             location = location.toObject();
//             //filtering 'dead' volunteers before saving
//             volsobj = volsobj.filter(function (val) {
//                 return val != null
//
//             });
//             location.volunteers = volsobj;
//             resolve(location)
//         }).catch(function(err){
//             reject(err)
//         });
//
//     })
// };


module.exports.locationSchema=function (req,res) {
    let len= Object.keys(mongoose.model('locations').schema.tree).length;
    let fields= Object.keys(mongoose.model('locations').schema.tree);
    fields.splice(-3,len);
    sendJsonResponse(res, 220, fields)
};

module.exports.locationsCreate = function (req, res) {
    console.log('location create arrived data',req.body);
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        rating: req.body.rating,
        waterSource: req.body.waterSource,
        facilities: req.body.facilities,
        coords: req.body.coords? req.body.coords.split(",") : [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        // feedingSchedule: [feedingScheduleSchema],
        volunteers: req.body.volunteers? req.body.volunteers.split(",") : [],
        // catsList:[catsListSchema]

    }, function (err, location) {
        if (err) {
            console.log('location saving error', err);
            ErrCodesActions[400](res, err)
        }
        else {
            sendJsonResponse(res, 200, location)
        }
    })
};

module.exports.locationsReadOne = function (req, res) {
    if (req.params && req.params.locationid) {
        let locId = req.params.locationid;

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
        let locId = req.params.locationid;
        Loc.findOne({_id: locId}).exec(function (err, location) {
            //console.log('Loc.findOne',locId );
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
            if(req.body.volunteers && req.body.volunteers != 'no volunteers') {
                location.volunteers = req.body.volunteers.split(",");
            }
            else if (req.body.volunteers == 'no volunteers') {
                //retrieved request to clear volunteers
                location.volunteers =[];
            }
            //put to child doc
            // location.days= req.body.days;
            // location.opening= req.body.opening;
            // location.closing= req.body.closing;
            // location.closed= req.body.closed;
            //console.log('location arrived',req.body.volunteers);
            location.save().then(function (location) {
                //checking if it was last volunteer in location to prevent further code failing
                // if(location.volunteers && location.volunteers.length >0){
                    attachVolsToLocation(location).then
                    (location=> sendJsonResponse(res, 200, location)).catch(err=>console.log('error while executing attachVolsToLocation',err))
                // }
                // else{
                //    sendJsonResponse(res, 200, location)
               // }


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
        let locId = req.params.locationid;

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
    let lng = parseFloat(req.query.lng);
    let lat = parseFloat(req.query.lat);
    let maxDist = parseInt(req.query.dst);
    let point = {
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
                    //let distInMeters=loc.distance;
                    let distInkm = loc.distance / 1000;
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
};/* all locations */
module.exports.locationsList = function (req, res) {
    Loc.find({}).exec(function (err, locations) {
            if (err) {
                ErrCodesActions[400](res, err)
            }
            else {
                sendJsonResponse(res, 220, locations)
            }
        }
    )
};

//finding volunteers
exports.getVolunteersByLocId = (req, res) => {
    if (req.params && req.params.locationid) {
        let locId = req.params.locationid;

        Loc.findOne({_id: locId}).select("volunteers")
            .exec(function (err, location) {
                if (err) {
                    ErrCodesActions[400](res, err)
                } else if (!location) {
                    ErrCodesActions[404](res)
                } else {

                    let volunteers = location.volunteers;

                    sendJsonResponse(res, 220, volunteers)
                }

            });
    }
    else {
        ErrCodesActions[401](res)
    }
};