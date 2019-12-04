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

function detectModelFromRequest(req) {

    //determining-constructing model
    let reqmodel = 'unknown model';

    if (req.url.split('/')[1] == 'volunteer-photos') {
        reqmodel = 'volunteers'
    }
    else if (req.url.split('/')[1] == 'cat-photos') {
        reqmodel = 'cats'
    }

    return reqmodel
}

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

    }).exec(function (err, cat) {
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
            let respObj={};
            respObj.thumbs=catPhotos;
            respObj.avatarID=cat.avatarID;
            sendJsonResponse(res,220,respObj)
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

module.exports.deleteFromDB = function (req, res) {
    let photoid = req.params.photoid;
    let modid = req.params.modid;
    let reqmodel = detectModelFromRequest(req);
    mongoose.model(reqmodel).update({_id:modid}, {$pull: {catPhoto: {_id:photoid}}},function(err, model) {
        if(err){
            console.log('Error deleting photo', err);
            sendJsonResponse(res, 500, 'error,  photo not deleted'+ err)
        }
        console.log('Deleted from DB', model);
        sendJsonResponse(res, 220, 'photos deleted')
    })
};


// same ID in database for all bench in case of multiple files upload
module.exports.uploadPhotoToDB = function (req,res) {

    let modid = req.params.modid;
    let reqmodel = detectModelFromRequest(req);

        let photoDBroutine = Object.keys(req.files).map(function (file) {
            return new Promise(function (resolve, reject) {
                let Catphoto = mongoose.model('catphotos');
                //return promises as done in controller and afterwards sendresponse out of files loop
                //console.log("checkme", req.files[file]);
                let mimetype = req.files[file].mimetype;
                let buffdata = req.files[file].data;
                let filename = req.files[file].name;
                Catphoto.create({
                        imageData: buffdata,
                        comment: filename,
                        contentType: mimetype
                    }
                ).then(cf => {
                    console.log('prepared to push cat photo', cf);
                    resolve(cf)
                })
            })
        });
        Promise.all(photoDBroutine).then(catPhotos=>{
                catPhotos.forEach(function (catPhoto) {
                    console.log("arrived cat photos", catPhoto);
                        mongoose.model(reqmodel).findByIdAndUpdate(
                             modid,
                            { $push: {catPhoto: catPhoto } },
                            function(err, model) {
                                if(err){
                                    console.log('Error pushing photo', err)
                                }
                                console.log('Pushed photo to DB', model)
                                 }
                        );

                        if (catPhotos[catPhotos.length - 1] === catPhoto) {
                            // at last iteration send rsponse
                            sendJsonResponse(res, 220, 'photos uploaded')
                        }
                })

                })

};

