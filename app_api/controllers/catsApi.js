var mongoose = require('mongoose');
var Loc = mongoose.model('locations');

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

// var catsListSchema = new mongoose.Schema({
//     catName: {type:String, required:true},
//     catAge: {type: Number, "default": 0, min: 0, max: 30},
//     catChipNumber: String,
//     catColor: String,
//     catWeight: {type: Number, "default": 0, min: 0, max: 30},
//     catGender: {type:String, validate: /(male|female)$/},
//     catDescription: String,
//     catPhoto:[catPhotoSchema]
// });

module.exports.catsByLocation=function (req,res) {

    //finding volunteers

        if(req.params && req.params.locationid) {
            var locId = req.params.locationid;

            Loc.findOne({_id: locId}).select("cats")
                .exec(function (err, location) {
                    if (err) {
                        ErrCodesActions[400](res, err)
                    } else if (!location) {
                        ErrCodesActions[404](res)
                    } else {

                        var cats = location.cats;

                        sendJsonResponse(res, 220, cats)
                    }

                });
        }
        else {
            ErrCodesActions[401](res)
        }


};
module.exports.catsCreate=function (req,res) {
    var doAddCat =  function(req, res, location){
        location.cats.push({
            catName: req.body.catName,
            catAge: req.body.catAge,
            catChipNumber: req.body.catChipNumber,
            catColor: req.body.catColor,
            catWeight: req.body.catWeight,
            catDescription: req.body.catDescription,
            catGender: req.body.catGender,
            catPhoto: req.body.catPhoto,
        });
    };

    if(req.params && req.params.locationid ){
        //var catId=req.params.catid;
        var locId=req.params.locationid;

        Loc.findOne({_id: locId}).select("cats").exec( function (err, location) {
            if(!location){
                ErrCodesActions[404](res);
            }
            else if (err) {
                ErrCodesActions[400](res,err);
            }

            else {
                doAddCat(req, res, location);
                location.save(function(err, location) {
                    var thisCat;
                    if (err) {
                        ErrCodesActions[400](res,err);
                    } else {
                        //updateAverageRating(location._id);
                        thisCat= location.cats[location.cats.length - 1];
                        sendJsonResponse(res, 201, thisCat);
                    }
                });

            }

        });


    }
    else {

        ErrCodesActions[401](res)
    }

};
module.exports.catsReadOne=function (req, res) {

    if(req.params && req.params.locationid && req.params.catid){
        var locId=req.params.locationid;
        var catId = req.params.catid;

        Loc.findOne({_id: locId}).select("name cats").exec( function (err, location) {
            if(!location) {
                ErrCodesActions[404](res)
            }
            else if (err) {
                ErrCodesActions[400](res,err)
            }
            else {
                var response, cat;
                cat = location.cats.id(catId);
                if(!cat) {
                    ErrCodesActions[404](res)
                }
                else{

                    sendJsonResponse(res, 200, cat);
                }
            }
        });


    }
    else {

        ErrCodesActions[401](res)
    }

};
module.exports.catsUpdateOne=function (req,res) {

    if(req.params && req.params.locationid && req.params.catid){
        var locId = req.params.locationid;
        var catId = req.params.catid;

        Loc.findOne({_id: locId}).select("name cats").exec( function (err, location) {
            if(!location) {
                ErrCodesActions[404](res)
            }
            else if (err) {
                ErrCodesActions[400](res,err);
            }

            else {
                var thisCat = location.cats.id(catId);
                if(!thisCat){
                    ErrCodesActions[404](res);
                    return
                } else {
                        thisCat.catName= req.body.catName;
                        thisCat.catAge= req.body.catAge;
                        thisCat.catChipNumber= req.body.catChipNumber;
                        thisCat.catColor= req.body.catColor;
                        thisCat.catWeight= req.body.catWeight;
                        thisCat.catDescription= req.body.catDescription;
                        thisCat.catGender= req.body.catGender;
                        thisCat.catPhoto= req.body.catPhoto;
                    location.save(function(err, savedData) {
                        if (err) {
                            ErrCodesActions[400](res,err)
                        } else {
                            console.log(location);
                            //updateAverageRating(savedlocation._id);
                            sendJsonResponse(res, 200, thisCat);
                        }
                    });
                }

            }

        });
    }
    else {
        ErrCodesActions[401](res)
    }
};

module.exports.catsDeleteOne=function (req,res) {

    if(req.params && req.params.locationid && req.params.catid){
        var locId = req.params.locationid;
        var catId = req.params.catid;

        Loc.findOne({_id: locId}).select("name cats").exec( function (err, location) {
            if(!location) {
                ErrCodesActions[404](res)
            }
            else if (err) {
                ErrCodesActions[400](res,err)
            }

            else {
                var thisCat = location.cats.id(catId);
                if(!thisCat){
                    ErrCodesActions[404](res);
                } else {
                    thisCat.remove();
                    location.save(function(err, location) {
                        if (err) {
                            ErrCodesActions[400](res,err)
                        } else {
                            console.log("deleted cat from location id",location._id);
                            //updateAverageRating(location._id);
                            sendJsonResponse(res, 204, "null");
                        }
                    });
                }

            }

        });
    }
    else {

        ErrCodesActions[401](res)
    }
};