var request = require("request");
var url =require('url');
var ApiOptions = {server:"http://localhost:3000"};

if (process.env.NODE_ENV == 'production') {
    ApiOptions.server = "https://borrik.herokuapp.com";
}

module.exports.volunteerinfo = function (req,res) {

    var volid=req.params.volunteerid;
    //api request by id ...

    request(url.resolve(ApiOptions.server,"api/volunteers/"+volid), {method: 'get',
        json: {}} ,function (err, apiResp, body) {

        res.render("volunteer-info.jade", {pageHeader:{title: 'volunteer info'}, volunteer:body})
    })
};