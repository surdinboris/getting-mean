let request = require("request");
let url =require('url');
let ApiOptions = {server:"http://localhost:3000"};

if (process.env.NODE_ENV == 'production') {
    ApiOptions.server = "https://borrik.herokuapp.com";
}

let requestDBSchema= function(dbmodel){
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