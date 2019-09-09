let mongoose = require('mongoose');
let Loc = mongoose.model('locations');
let Vol = mongoose.model('volunteers');

let sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};
//400 - error sendJsonResponse(res, 400,{"message":"error", "error":err})
//401 - no params in request sendJsonResponse(res, 400,{"message":"no ID parameter(s) given","err":"missing parameters"})
//404 - not found   sendJsonResponse(res,404,{"message":"no document with given ID was found"})
//220 - ok + response sent
//204 - deleted + response null
let ErrCodesActions={
    400:function (res, err){sendJsonResponse(res, 400,{"message":"error", "error":err})},
    401:function (res,err){sendJsonResponse(res, 401,{"message":"no ID parameter(s) given","err":"missing parameters"})},
    404:function (res,err){sendJsonResponse(res,404,{"message":"no document with given ID was found"})},
};


module.exports.volunteersCreate=function (req,res) {

        Vol.create({
            volunteerName: req.body.volunteerName,
            volunteerAddress: req.body.volunteerAddress,
            active: req.body.active,
            comment: req.body.comment

        }, function (err,volunteer) {
            if (err){
                ErrCodesActions[400](res,err)

            }
            else{
                sendJsonResponse(res, 200,volunteer)
            }
        })

    };
//empty schema request
module.exports.volunteerSchema=function (req,res) {
    let len= Object.keys(mongoose.model('volunteers').schema.tree).length;
    let fields= Object.keys(mongoose.model('volunteers').schema.tree);
    fields.splice(-3,len);
        sendJsonResponse(res, 220, fields)
};


module.exports.volunteersReadAll=function (req,res) {


        Vol.find({}, function (err, volunteers) {
            sendJsonResponse(res, 220, volunteers)
        })
};

module.exports.volunteersReadOne=function (req,res) {
    if(req.params && req.params.volunteerid){
        let volId=req.params.volunteerid;

        Vol.findOne({_id: volId}, function (err, volunteer) {

            if (err) {
                ErrCodesActions[400](res,err)
            }
            else if(!volunteer){
                ErrCodesActions[404](res)
            }
            else {
                sendJsonResponse(res, 220, volunteer)
            }
        });
    }
    else {
        ErrCodesActions[400](res, err)
    }

};


module.exports.volunteersLocations = function(req,res){
    let searchvolunt = req.params.volunteerid;
    //searchlogic will be here

    Loc.find({volunteers:mongoose.Types.ObjectId(searchvolunt)}).exec(function (err,locationslist) {
        if(err){
            console.log('error while retrieving volunteer\'s locations',err);
            ErrCodesActions[400](res,err);
        }
        else {
            //console.log('found locations of', searchvolunt, '--', locationslist)
            sendJsonResponse(res, 200, {locationlist:locationslist})
        }

    });

};


module.exports.volunteersUpdateOne = function (req,res) {

        if(req.params &&  req.params.volunteerid){
            //let locId=req.params.locationid;
            let volId = req.params.volunteerid;
            Vol.findOne({_id: volId}).exec(function (err,volunteer) {
                if (!volunteer) {
                    sendJsonResponse(res, 404, {
                        "message": "volunteerid not found"
                    });

                }
                else if(err){
                    ErrCodesActions[400](res,err);
                }


                 else {
                        volunteer.volunteerName = req.body.volunteerName;
                        volunteer.volunteerAddress= req.body.volunteerAddress;
                        volunteer.active= req.body.active;
                        volunteer.comment = req.body.comment;
                        volunteer.save(function(err, savedvolunteer) {
                            if (err) {
                                ErrCodesActions[400](res,err)
                            } else {

                                sendJsonResponse(res, 200, volunteer);
                            }
                        });
                    }

            });

        }
        else {

            ErrCodesActions[401](res)
        }

};

module.exports.volunteersDeleteOne=function (req,res) {
    if(req.params && req.params.volunteerid){
        let volId=req.params.volunteerid;
        Vol.findByIdAndRemove(volId).exec(function (err, volunteer) {
            if (err) {
                ErrCodesActions[400](res,err)
            }
            else if(!volunteer){
                ErrCodesActions[401](res)
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