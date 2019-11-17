let request = require("request");
let url =require('url');
let ApiOptions = {server:"http://localhost:3000"};
let contrlib = require('../../controllerlib');

if (process.env.NODE_ENV == 'production') {
    ApiOptions.server = "https://borrik.herokuapp.com";
}

module.exports.getCatPhotos = function(req, res) {
    let catid = req.params.catid;
    request(url.resolve(ApiOptions.server, "api/cat-photos/" + catid), {
        method: 'get',
        json: {}
    }, function (err, ApiResp, resBody) {
        if (err) {
            console.log(err)
        }
        else {
            // let picts = resBody.map(function (tumb) {
            //     return {imgdata:Buffer.from(tumb.imageData.data).toString('base64')};
            // });
            res.render('photo-gallery', {thumbs:resBody, catid:catid})
        }
    })
};

module.exports.uploadCatPhotos = function(req, res) {

    //checking action needed (upload\delete)

    //console.log('~upload request~', req.params.catid);
    let catid = req.params.catid;
    let images;
    //fixing different  typ list \ single object in case of multiple files
    req.files.images.constructor == Array ? images = req.files.images : images = [req.files.images];


    let promisedUpload = images.map(function (image) {
        return new Promise(function (resolve, reject) {
            //at the moment only one image multi images will be implemented via promise.all -> response to client request
            let formData = {};

            formData[image.name] = {
                value: image.data,
                options: {
                    filename: image.name
                }
            };

            request(url.resolve(ApiOptions.server, "api/cat-photos/" + catid), {
                method: 'post',
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                formData: formData,
                //json: {}
            }, function (err, ApiResp, resBody) {
                if (err) {
                    console.log('Error in promise while uploading via api', err);
                    reject(err)
                }
                else {
                    //to avoid unwanted photo data exchange while uploading many pictures, only
                    //response will be returned from api and once all photos will be uploaded, full photo data will be fetched
                    console.log('gallery upload api resp', ApiResp.statusCode, resBody);
                    resolve({ApiResp: ApiResp.statusCode, resBody: resBody})
                    // let picts = resBody.map(function (tumb) {
                    //     return {imgdata:Buffer.from(tumb.imageData.data).toString('base64')};
                    // });
                    //console.log(resBody);
                    //res.render('photo-gallery', {thumbs: resBody})
                }
            })
        })
    });

Promise.all(promisedUpload).then(result=>{
    //do any sort of validation with api requests
    console.log(result, );
    res.redirect(url.resolve(ApiOptions.server,req.url))
        //a little boilerplate to retrieve full response with all pictures, but leave it to further improvement
        //get   result of last promise
        // result = JSON.parse(result[result.length-1].resBody);
        // res.render('photo-gallery', {thumbs:result, catid:catid})
    //res.render('photo-gallery',{})
    }).catch(err=>res.end('Error in promise.all while uploading via api: '+err))
};

//     let formData = {
//         image_file: {
//             value: images[0].data,
//             options: {
//                 filename: images[0].name
//             }
//         }
//     };
//     //change to promises
//
//     request(url.resolve(ApiOptions.server, "api/cat-photos/" + catid), {
//         method: 'post',
//         headers: {
//             "Content-Type": "multipart/form-data"
//         },
//         formData:formData,
//         //json: {}
//     }, function (err, ApiResp, resBody) {
//         if (err) {
//             console.log(err)
//         }
//         else {
//
//             // let picts = resBody.map(function (tumb) {
//             //     return {imgdata:Buffer.from(tumb.imageData.data).toString('base64')};
//             // });
//             //console.log(resBody);
//             //res.render('photo-gallery', {thumbs: resBody})
//             res.end(resBody.toString())
//         }
//     })
// };
//
// module.exports.getVolunteerPhotos = function(req, res) {
//     let volid = req.params.volid;
//     request(url.resolve(ApiOptions.server, "api/cat-photos/" + volid), {
//         method: 'get',
//         json: {}
//     }, function (err, ApiResp, resBody) {
//         if (err) {
//             console.log(err)
//         }
//         else {
//             let picts = resBody.map(function (tumb) {
//                 return Buffer.from(tumb.imageData.data).toString('base64');
//             });
//             res.render('photo-gallery', {thumbs: picts})
//         }
//     })
// };

// module.exports.getCatAvatar = function(req, res) {
//     let catid = req.params.catid;
//     //add additional request parameter to get avatar (could be stored as metadata of image file and retrieved via api) now it's just a first picture of gallery array
//     request(url.resolve(ApiOptions.server, "api/cat-photos/" + catid), {
//         method: 'get',
//         json: {}
//     }, function (err, ApiResp, resBody) {
//         if (err) {
//             console.log(err)
//         }
//         else {
//             let avatar = resBody[0].imageData.data;
//             //console.log('___',resBody[0].contentType);
//             let ContentType =resBody[0].contentType;
//             res.writeHead(200, {'Content-Type': ContentType});
//             res.end(avatar);
//         }
//     })
// };