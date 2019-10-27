let mongoose = require('mongoose');
let url = require('url');
// let Loc = mongoose.model('locations');
// let Cat = mongoose.model('cats');
let apilib = require('../../apilib');
let sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};
let fs = require('fs');


module.exports.getModPhotos= function (req,res) {
    let modid=req.params.modid;

    //determining-constructing model
    let reqmodel = 'unknown model';

    if (req.url.split('/')[1] == 'volunteer-photos') {
        reqmodel = 'volunteers'
    }
    else if (req.url.split('/')[1] == 'cat-photos') {
        reqmodel = 'cats'
    }

    mongoose.model(reqmodel).findOne({_id:modid}, function (err, cats) {

    }).select('catPhoto').exec(function (err, cat) {
        if(err){
            console.log('Error ocuured', err);
            sendJsonResponse(res, 400, err)
        }
        else{

            let catPhotos = JSON.parse(JSON.stringify(cat.catPhoto));
            catPhotos.forEach(function(catPhoto){
                //catPhoto.imageData.data=Buffer.from(catPhoto.imageData.data).toString('base64');
                catPhoto.imageData.data=Buffer.from(catPhoto.imageData.data).toString('base64');
            });

                //imgdata:Buffer.from(tumb.imageData.data).toString('base64')
            //need to filter (select) fields data only
            //sendJsonResponse(res, 220, cats)
            //  res.writeHead(200,{'Content-type':'image/jpg'});
            // res.end(content);
            //console.log(cat);
            //   res.end(cat.catPhoto[0].imageData);

            sendJsonResponse(res,220,catPhotos)
        }
    })
};

module.exports.setAvatarID= function (req,res) {
    let modid=req.params.modid;

    //determining-constructing model
    let reqmodel = 'unknown model';

    if (req.url.split('/')[1] == 'volunteer-photos') {
        reqmodel = 'volunteers'
    }
    else if (req.url.split('/')[1] == 'cat-photos') {
        reqmodel = 'cats'
    }

    mongoose.model(reqmodel).findOne({_id:modid}, function (err, cats) {

    }).exec(function (err, cat) {
        if(err){
        }
        console.log('error',err)
    }
    )};


module.exports.uploadPhotoToDB= function (req,res) {
    let modid = req.params.modid;
    //determining-constructing model
    let reqmodel = 'unknown model';

    if (req.url.split('/')[1] == 'volunteer-photos') {
        reqmodel = 'volunteers'
    }
    else if (req.url.split('/')[1] == 'cat-photos') {
        reqmodel = 'cats'
    }
    //console.log("~attach cat~", req.files);
    console.log("~~~",reqmodel,modid);
    mongoose.model(reqmodel).findOne({_id: modid},function (err, cat) {}).select('catPhoto').exec(function (err, cat) {
 //attach arrived photo to found cat here
        if (err) {
            console.log('api error', err)
            //res.end('api error',err)
        }
        //do stuff
        //db storing here
        //responding
        let catPhotos = JSON.parse(JSON.stringify(cat.catPhoto));
        catPhotos.forEach(function(catPhoto){
            //catPhoto.imageData.data=Buffer.from(catPhoto.imageData.data).toString('base64');
            catPhoto.imageData.data=Buffer.from(catPhoto.imageData.data).toString('base64');
        });
        //imgdata:Buffer.from(tumb.imageData.data).toString('base64')
        //need to filter (select) fields data only
        //sendJsonResponse(res, 220, cats)
        //  res.writeHead(200,{'Content-type':'image/jpg'});
        // res.end(content);
        //console.log(cat);
        //   res.end(cat.catPhoto[0].imageData);
        sendJsonResponse(res,220,catPhotos)

    })



};

//
// module.exports.getModPhotos= function (req,res) {
//     let modid=req.params.modid;
//
//     //determining-constructing model
//     let reqmodel = 'unknown model';
//
//     if (req.url.split('/')[1] == 'volunteer-photos') {
//         reqmodel = 'volunteers'
//     }
//     else if (req.url.split('/')[1] == 'cat-photos') {
//         reqmodel = 'cats'
//     }
//
//     mongoose.model(reqmodel).findOne({_id:modid}, function (err, cats) {
//
//     }).select('catPhoto').exec(function (err, cat) {
//         if(err){
//             console.log('Error ocuured', err);
//             sendJsonResponse(res, 400, err)
//         }
//         else{
//             //need to filter (select) fields data only
//             //sendJsonResponse(res, 220, cats)
//             //  res.writeHead(200,{'Content-type':'image/jpg'});
//             // res.end(content);
//             //console.log(cat);
//             //   res.end(cat.catPhoto[0].imageData);
//
//             sendJsonResponse(res,220,cat.catPhoto)
//
//         }
//     })
// };
//
// //
//
// //};
