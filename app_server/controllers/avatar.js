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

let detectModelFromAvatarReq= function (req){
    //detect what model to choose for  avatar photo search
    let model;
    let urlToModel= RegExp('^.*(avatar)\\/(cats|volunteers).*$');

    if(req.url.match(urlToModel) && req.url.match(urlToModel)[2] == 'cats' || req.url.match(urlToModel)[2] == 'volunteers') {
        model = req.url.match(urlToModel)[2]
    }
    return model
};
 module.exports.setAvatar = function(req, res) {
     let model = detectModelFromAvatarReq(req);
     let action =req.query.action;
     let modid = req.params.modid;
     //do stuff via Api

     if (action == 'setAvatar'){
         let photoID=req.query.photoID;
         request(url.resolve(ApiOptions.server, "api/avatarCtrl/" + modid), {
                 method: 'post',
                 json: {
                     model: model,
                     photoID:photoID
                 }

             }, function (err, ApiResp, resBody) {
             console.log(ApiResp.statusCode);
                 if (err) {
                     console.log(err)
                 }
                 else if(ApiResp.statusCode !=220){
                     res.end('avatar not set, please check API response '+ ApiResp);
                 }
                 else {
                     //redirect back
                    res.redirect(url.resolve(ApiOptions.server, '/photos/'+ model +'/' + modid))
                     //res.redirect(url.resolve(ApiOptions.server, req.url.split('?')[0]))
                 }
             }
         )
     }
     else if (action == 'getAvatar'){
         request(url.resolve(ApiOptions.server, "api/avatarCtrl/" + modid), {
                 method: 'get',
                 json: {
                     model: model
                 }

             }, function (err, ApiResp, resBody) {
                 if (err) {
                     console.log(err)
                 }
                 else {
                     //redirect back
                     //need to finish implementation if needed
                     res.send('avatar get',ApiResp);
                     //console.log(url.resolve(ApiOptions.server, req.url.split('?')[0]))
                     //res.redirect(url.resolve(ApiOptions.server, req.url.split('?')[0]))
                 }
             }
         )

     }
 }