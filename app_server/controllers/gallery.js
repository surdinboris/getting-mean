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
            console.log(resBody);
            res.render('photo-gallery', {thumbs:resBody})
        }
    })
};

module.exports.getVolunteerPhotos = function(req, res) {
    let volid = req.params.volid;
    request(url.resolve(ApiOptions.server, "api/cat-photos/" + volid), {
        method: 'get',
        json: {}
    }, function (err, ApiResp, resBody) {
        if (err) {
            console.log(err)
        }
        else {
            let picts = resBody.map(function (tumb) {
                return Buffer.from(tumb.imageData.data).toString('base64');
            });
            res.render('photo-gallery', {thumbs: picts})
        }
    })
};

module.exports.getCatAvatar = function(req, res) {
    let catid = req.params.catid;
    //add additional request parameter to get avatar (could be stored as metadata of image file and retrieved via api) now it's just a first picture of gallery array
    request(url.resolve(ApiOptions.server, "api/cat-photos/" + catid), {
        method: 'get',
        json: {}
    }, function (err, ApiResp, resBody) {
        if (err) {
            console.log(err)
        }
        else {
            let avatar = resBody[0].imageData.data;
            //console.log('___',resBody[0].contentType);
            let ContentType =resBody[0].contentType;
            res.writeHead(200, {'Content-Type': ContentType});
            res.end(avatar);
        }
    })
};