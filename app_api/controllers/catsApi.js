let mongoose = require('mongoose');
let Loc = mongoose.model('locations');
let Cat = mongoose.model('cats');
let apilib = require('../../apilib');
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

// let catsListSchema = new mongoose.Schema({
//     catName: {type:String, required:true},
//     catAge: {type: Number, "default": 0, min: 0, max: 30},
//     catChipNumber: String,
//     catColor: String,
//     catWeight: {type: Number, "default": 0, min: 0, max: 30},
//     catGender: {type:String, validate: /(male|female)$/},
//     catDescription: String,
//     catPhoto:[catPhotoSchema]
// });

//empty schema request
module.exports.catSchema=function (req,res, model) {
    let fields = apilib.responseDbSchema(req,res,'cats');
    sendJsonResponse(res, 220, fields)
};

module.exports.catsByLocation=function (req,res) {

    //finding volunteers

        if(req.params && req.params.locationid) {
            let locId = req.params.locationid;

            Loc.findOne({_id: locId}).select("cats")
                .exec(function (err, location) {
                    if (err) {
                        ErrCodesActions[400](res, err)
                    } else if (!location) {
                        ErrCodesActions[404](res)
                    } else {

                        let cats = location.cats;

                        sendJsonResponse(res, 220, cats)
                    }

                });
        }
        else {
            ErrCodesActions[401](res)
        }


};

function doAddCat (req, res) {
    let fields = apilib.responseDbSchema(req,res,'cats');


    let newCat={};

    fields.forEach(function (field) {
        newCat.field=req.body[field];

        console.log('>>>',field,req.body.field)
    });

    Cat.create(
        newCat
        , function (err,newCat) {
            if (err){
                console.log('cat saving error',err);
                ErrCodesActions[400](res,err)

            }
            else{
                console.log('new cat was created',newCat._id );
                //location.cats.push(newCat._id);
                sendJsonResponse(res, 200,newCat._id)
            }
        })

};


module.exports.catsCreate=function (req,res) {
    console.log("req>>>"req)
    // console.log('searching for location with id', req.query.locationid);
    // Loc.findOne({_id:req.query.locationid},function (err, location) {
    //     if (err){
    //         ErrCodesActions[400](res,err)
    //
    //     }
    //     else{
    doAddCat(req, res)
    //    }
    //})

};
//not working - need other implementation
module.exports.catsCreateOld=function (req,res) {
    let doAddCat =  function(req, res, location){
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
        //let catId=req.params.catid;
        let locId=req.params.locationid;

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
                    let thisCat;
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
        let locId=req.params.locationid;
        let catId = req.params.catid;

        Loc.findOne({_id: locId}).select("name cats").exec( function (err, location) {
            if(!location) {
                ErrCodesActions[404](res)
            }
            else if (err) {
                ErrCodesActions[400](res,err)
            }
            else {
                let response, cat;
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
        let locId = req.params.locationid;
        let catId = req.params.catid;

        Loc.findOne({_id: locId}).select("name cats").exec( function (err, location) {
            if(!location) {
                ErrCodesActions[404](res)
            }
            else if (err) {
                ErrCodesActions[400](res,err);
            }

            else {
                let thisCat = location.cats.id(catId);
                if(!thisCat){
                    ErrCodesActions[404](res);
                    return
                } else {
                    //refactor to dynamic requesting fields accordingly to db schema
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
        let locId = req.params.locationid;
        let catId = req.params.catid;

        Loc.findOne({_id: locId}).select("name cats").exec( function (err, location) {
            if(!location) {
                ErrCodesActions[404](res)
            }
            else if (err) {
                ErrCodesActions[400](res,err)
            }

            else {
                let thisCat = location.cats.id(catId);
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