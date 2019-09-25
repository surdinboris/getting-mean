let request = require("request");
let url = require("url");
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