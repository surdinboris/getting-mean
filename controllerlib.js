let request = require("request");
let url = require("url");
let ApiOptions = {server:"http://localhost:3000"};
if (process.env.NODE_ENV == 'production') {
    ApiOptions.server = "https://borrik.herokuapp.com";
}
//empty schema request
module.exports.requestDbSchema= function(dbmodel, ApiOptions){
    return new Promise(function(resolve,reject){request(url.resolve(ApiOptions.server,"api/"+dbmodel+"/schema"), { method: 'get',json:{}}, function (err,apiResp, fieldslist) {
        if(err){
            reject(err)
        }
        let fieldsObj = {};
        fieldslist.forEach(function (field) {
            fieldsObj[field] = ''
        });
        resolve(fieldsObj)
    })
    })
};
//returns precofigured constructor with
module.exports.modelAssignCommit = function (req,res) {

        //determining-constructing model
        let model = 'unknown model';

        if (req.url.replace('/', '') == 'assignVolunteer') {
            model = 'volunteer'
        }
        else if (req.url.replace('/', '') == 'assignCat') {
            model = 'cat'
        }

        this.model=model;
        this.renderExec = function (req, res) {

                let attachModel = req.body[model];

                let locationid = req.body.location;

                request(url.resolve(ApiOptions.server, "api/locations/" + locationid), {
                    method: 'get',
                    json: {}
                }, function (err, locApiResp, locBody) {
                    if (err) {
                        console.log(err)
                    }
                    let locModsUpdated = locBody[model + 's'];
                    //creating array of id's
                    locModsUpdated = locModsUpdated.map(function (mod) {
                        return mod._id
                    });
                    //avoiding duplicate insertion
                    if (locModsUpdated.indexOf(attachModel) < 0) {
                        locModsUpdated.push(attachModel);
                    }

                    //third - attach this id to location object
                    request(url.resolve(ApiOptions.server, "api/locations/" + locationid), {
                            method: 'put',
                            json: model == 'volunteer' ? {volunteers: locModsUpdated.toString()} : {cats: locModsUpdated.toString()}
                        },
                        function (err, updatedApiResp, updLocBody) {
                            if (err) {
                                console.log('error', err)
                            }
                            res.redirect('/locations/' + locationid)
                        })
                })
            }
        };

// module.exports.modelAssignCommit = function (req,res) {
//
//     return function (req,res) {
//
//         let model = 'unknown model';
//
//         if (req.url.replace('/', '') == 'assignVolunteer') {
//             model = 'volunteer'
//         }
//         else if (req.url.replace('/', '') == 'assignCat') {
//             model = 'cat'
//         }
//
//         let attachModel = req.body[model];
//         let locationid = req.body.location;
//
//         request(url.resolve(ApiOptions.server, "api/locations/" + locationid), {
//             method: 'get',
//             json: {}
//         }, function (err, locApiResp, locBody) {
//             if (err) {
//                 console.log(err)
//             }
//             let locModsUpdated = locBody[model + 's'];
//             //creating array of id's
//             locModsUpdated = locModsUpdated.map(function (mod) {
//                 return mod._id
//             });
//             //avoiding duplicate insertion
//             if (locModsUpdated.indexOf(attachModel) < 0) {
//                 locModsUpdated.push(attachModel);
//             }
//
//             //third - attach this id to location object
//             request(url.resolve(ApiOptions.server, "api/locations/" + locationid), {
//                     method: 'put',
//                     json: model == 'volunteer' ? {volunteers: locModsUpdated.toString()} : {cats: locModsUpdated.toString()}
//                 },
//                 function (err, updatedApiResp, updLocBody) {
//                     if (err) {
//                         console.log('error', err)
//                     }
//                     res.redirect('/locations/' + locationid)
//                 })
//         })
//     }
//};

// module.exports.modelAssignCommit = function (req,resp) {
//
//     let attachvol= req.body.volunteer;
//     let locationid= req.body.location;
//
//     request(url.resolve(ApiOptions.server, "api/locations/" + locationid), {
//         method: 'get',
//         json: {}
//     }, function (err, locApiResp, locBody) {
//         if (err) {
//             console.log(err)
//         }
//         let locVolsUpdated = locBody.volunteers;
//         //creating array of id's
//         locVolsUpdated=locVolsUpdated.map(function (vol) {
//             return vol._id
//         });
//         locVolsUpdated.push(attachvol);
//
//         //third - attach this id to location object
//         request(url.resolve(ApiOptions.server, "api/locations/"+ locationid), {
//                 method: 'put',
//                 json: {volunteers: locVolsUpdated.toString()}},
//             function(err, updatedApiResp, updLocBody) {
//                 if (err) {
//                     console.log('error',err)
//                 }
//                 resp.redirect('/locations/'+locationid)
//             })
//     })
//
// };