let mongoose = require('mongoose');
let Loc = mongoose.model('locations');
let Cat = mongoose.model('cats');
let apilib = require('../../apilib');
let sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};
let fs = require('fs');
// let request = require('request');
// let url = require('url');
// let ApiOptions = {server:"http://localhost:3000"};



module.exports.catsReadAll=function (req,res) {


    Cat.find({}, function (err, cats) {

    }).select('-catPhoto').exec(function (err, cats) {
        if(err){
            console.log('Error ocuured', err)
        }
        else{
            //need to filter (select) fields data only
            sendJsonResponse(res, 220, cats)
        }
    })
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
        newCat[field]=req.body[field];


    });
    //in case of missing photo data
    if(req.body.catPhoto == '') {

        newCat.catPhoto={};
        //add request image parsing here
        newCat.catPhoto.imageData = fs.readFileSync('public/images/noimage.jpg');
        newCat.catPhoto.contentType = 'image/png';
        newCat.catPhoto.comment='no image';
    }
    if(newCat.avatarID == ''){
        newCat.avatarID= undefined
    }

    Cat.create(
        newCat
        , function (err,newCat) {
            if (err){
                console.log('cat saving error',err);
                ErrCodesActions[400](res,err)

            }
            else{
                console.log('new cat was created',newCat._id );
                let naAvatarId = newCat.catPhoto[0]._id;
                //location.cats.push(newCat._id);
                newCat.set('avatarID', naAvatarId);
                newCat.save();
                sendJsonResponse(res, 200,newCat)
            }
        })

};


module.exports.catsCreate=function (req,res) {
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
// //not working - need other implementation
// module.exports.catsCreateOld=function (req,res) {
//     let doAddCat =  function(req, res, location){
//         location.cats.push({
//             catName: req.body.catName,
//             catAge: req.body.catAge,
//             catChipNumber: req.body.catChipNumber,
//             catColor: req.body.catColor,
//             catWeight: req.body.catWeight,
//             catDescription: req.body.catDescription,
//             catGender: req.body.catGender,
//             catPhoto: req.body.catPhoto,
//         });
//     };
//
//     if(req.params && req.params.locationid ){
//         //let catId=req.params.catid;
//         let locId=req.params.locationid;
//
//         Loc.findOne({_id: locId}).select("cats").exec( function (err, location) {
//             if(!location){
//                 ErrCodesActions[404](res);
//             }
//             else if (err) {
//                 ErrCodesActions[400](res,err);
//             }
//
//             else {
//                 doAddCat(req, res, location);
//                 location.save(function(err, location) {
//                     let thisCat;
//                     if (err) {
//                         ErrCodesActions[400](res,err);
//                     } else {
//                         //updateAverageRating(location._id);
//                         thisCat= location.cats[location.cats.length - 1];
//                         sendJsonResponse(res, 201, thisCat);
//                     }
//                 });
//
//             }
//
//         });
//
//
//     }
//     else {
//
//         ErrCodesActions[401](res)
//     }
//
// };
module.exports.catsReadOne=function (req, res) {

        if(req.params && req.params.catid){
            let catid=req.params.catid;

            Cat.findOne({_id: catid}, function (err, cat) {

                if (err) {
                    ErrCodesActions[400](res,err)
                }
                else if(!cat){
                    ErrCodesActions[404](res)
                }
                else {
                    //filter here unnessesary fields



                    //cat= apilib.dbFilter(cat,catFilteredFields);
                    sendJsonResponse(res, 220, cat)
                }
            });
        }
        else {
            ErrCodesActions[400](res, err)
        }

    //
    // if(req.params && req.params.locationid && req.params.catid){
    //     let locId=req.params.locationid;
    //     let catId = req.params.catid;
    //
    //     Loc.findOne({_id: locId}).select("name cats").exec( function (err, location) {
    //         if(!location) {
    //             ErrCodesActions[404](res)
    //         }
    //         else if (err) {
    //             ErrCodesActions[400](res,err)
    //         }
    //         else {
    //             let response, cat;
    //             cat = location.cats.id(catId);
    //             if(!cat) {
    //                 ErrCodesActions[404](res)
    //             }
    //             else{
    //
    //                 sendJsonResponse(res, 200, cat);
    //             }
    //         }
    //     });
    //
    //
    // }
    // else {
    //
    //     ErrCodesActions[401](res)
    // }

};
// module.exports.catsUpdateOne=function (req,res) {
//     if(req.params && req.params.locationid && req.params.catid){
//         let locId = req.params.locationid;
//         let catId = req.params.catid;
//
//         Loc.findOne({_id: locId}).select("name cats").exec( function (err, location) {
//             if(!location) {
//                 ErrCodesActions[404](res)
//             }
//             else if (err) {
//                 ErrCodesActions[400](res,err);
//             }
//
//             else {
//                 let thisCat = location.cats.id(catId);
//                 if(!thisCat){
//                     ErrCodesActions[404](res);
//                     return
//                 } else {
//                     //refactor to dynamic requesting fields accordingly to db schema
//                         thisCat.catName= req.body.catName;
//                         thisCat.catAge= req.body.catAge;
//                         thisCat.catChipNumber= req.body.catChipNumber;
//                         thisCat.catColor= req.body.catColor;
//                         thisCat.catWeight= req.body.catWeight;
//                         thisCat.catDescription= req.body.catDescription;
//                         thisCat.catGender= req.body.catGender;
//                         thisCat.catPhoto= req.body.catPhoto;
//                     location.save(function(err, savedData) {
//                         if (err) {
//                             ErrCodesActions[400](res,err)
//                         } else {
//                             console.log(location);
//                             //updateAverageRating(savedlocation._id);
//                             sendJsonResponse(res, 200, thisCat);
//                         }
//                     });
//                 }
//
//             }
//
//         });
//     }
//     else {
//         ErrCodesActions[401](res)
//     }
// };

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

// let requestDBSchema= function(dbmodel){
//     return new Promise(function(resolve,reject){request(url.resolve(ApiOptions.server,"api/"+dbmodel+"/schema"), { method: 'get',json:{}}, function (err,apiResp, fieldslist) {
//         if(err){
//             reject(err)
//         }
//         let fieldsObj = {};
//         fieldslist.forEach(function (field) {
//             fieldsObj[field] = ''
//         });
//         resolve(fieldsObj)
//     })
//     })
// };

module.exports.catsUpdateOne = function (req,res) {

    if(req.params &&  req.params.catid){
        //let locId=req.params.locationid;
        let catId = req.params.catid;
        Cat.findOne({_id: catId}).exec(function (err,cat) {
            if (!cat) {
                sendJsonResponse(res, 404, {
                    "message": "catid not found"
                });

            }
            else if(err){
                ErrCodesActions[400](res,err);
            }


            else { //request schema
                // volunteer.volunteerName = req.body.volunteerName;
                // volunteer.volunteerAddress= req.body.volunteerAddress;
                // volunteer.active= req.body.active;
                let fields = apilib.responseDbSchema(req,res,'cats');

                //let newCat={};

                fields.forEach(function (field) {
                    req.body[field]? cat[field]=req.body[field]: null;


                });
                //cat.catDescription = req.body.catDescription;
                cat.save(function(err, savedcat) {
                    if (err) {
                        ErrCodesActions[400](res,err)
                    } else {
                        //savedcat= apilib.dbFilter(savedcat,catFilteredFields);
                        sendJsonResponse(res, 200, savedcat);
                    }
                });
            }

        });

    }
    else {

        ErrCodesActions[401](res)
    }

};