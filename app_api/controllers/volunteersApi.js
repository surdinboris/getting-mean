var mongoose = require('mongoose');
var Loc = mongoose.model('locations');
var Vol = mongoose.model('volunteers');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};
//400 - error sendJsonResponse(res, 400,{"message":"error", "error":err})
//401 - no params in request sendJsonResponse(res, 400,{"message":"no ID parameter(s) given","err":"missing parameters"})
//404 - not found   sendJsonResponse(res,404,{"message":"no document with given ID was found"})
//220 - ok + response sent
//204 - deleted + response null
var ErrCodesActions={
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

module.exports.volunteersReadAll=function (req,res) {


        Vol.find({}, function (err, volunteers) {
            sendJsonResponse(res, 220, volunteers)
        })
}

module.exports.volunteersReadOne=function (req,res) {
    if(req.params && req.params.volunteerid){
        var volId=req.params.volunteerid;

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

module.exports.volunteersUpdateOne=function (req,res) {

        if(req.params &&  req.params.volunteerid){
            //var locId=req.params.locationid;
            var volId = req.params.volunteerid;
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
        var volId=req.params.volunteerid;
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