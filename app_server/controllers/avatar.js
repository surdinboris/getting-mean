let request = require("request");
let url =require('url');
let ApiOptions = {server:"http://localhost:3000"};
let contrlib = require('../../controllerlib');

if (process.env.NODE_ENV == 'production') {
    ApiOptions.server = "https://borrik.herokuapp.com";
}


module.exports.getAvatar = function(req, res) {
        //get avatar is for cat via API
    let catid = req.params.catid;
        request(url.resolve(ApiOptions.server, "api/avatarCtrl/" + catid), {
                method: 'get',
                json: {}
            }, function (err, ApiResp, resBody) {
                if (err) {
                    console.log(err)
                }
                else {
                    //redirect back
                    res.send('avatar get')
                    //res.redirect(url.resolve(ApiOptions.server, req.url.split('?')[0]))
                }

            }
        )

};


 module.exports.setAvatar = function(req, res) {
     //console.log('get avatar');
     let catid = req.params.catid;
     //do stuff via Api
     request(url.resolve(ApiOptions.server, "api/avatarCtrl/" + catid), {
             method: 'post',
             json: {}
         }, function (err, ApiResp, resBody) {
             if (err) {
                 console.log(err)
             }
             else {
                 //redirect back
                 res.send('avatar changed');
                 console.log(url.resolve(ApiOptions.server, req.url.split('?')[0]))
                 //res.redirect(url.resolve(ApiOptions.server, req.url.split('?')[0]))
             }
         }
     )
 }