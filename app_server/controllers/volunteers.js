var request = require("request");
var url =require('url');
var ApiOptions = {server:"http://localhost:3000"};

if (process.env.NODE_ENV == 'production') {
    ApiOptions.server = "https://borrik.herokuapp.com";
}

var title= 'Volunteer edit';
module.exports.volunteerinfo = function (req,res) {

    var volid=req.params.volunteerid;
    //api request by id ...

    request(url.resolve(ApiOptions.server,"api/volunteers/"+volid), {method: 'get',
        json: {}} ,function (err, apiResp, body) {

        res.render("volunteer-edit.jade", {pageHeader:{title: title}, volunteer:body})
    })
};

module.exports.volunteerCreateChange=function (req,res) {
    //in case of id presented - initiation change of existing volunteer
    if(req.body && req.body._id){
       request(url.resolve(ApiOptions.server,"api/volunteers/"+ req.body._id),{method: 'put', json:req.body},
           function (err, apiResp, body) {
           res.render("volunteer-edit.jade", {pageHeader:{title: title}, volunteer:body})
       } )
    }
    // data without id - creating new
    else{
        request(url.resolve(ApiOptions.server,"api/volunteers"),{method: 'post', json: req.body},
            function (err, apiResp, body) {
            res.render("volunteer-edit.jade", {pageHeader:{title: title}, volunteer:body})
        } )
    }



};
