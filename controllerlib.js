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