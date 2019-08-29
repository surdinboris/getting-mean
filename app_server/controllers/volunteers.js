var request = require("request");
var url =require('url');
var ApiOptions = {server:"http://localhost:3000"};

if (process.env.NODE_ENV == 'production') {
    ApiOptions.server = "https://borrik.herokuapp.com";
}

var title= 'Volunteer edit';

//get handler
module.exports.volunteerEditPage = function (req, res) {
    var volid=req.params.volunteerid;
    //api request by id ...
    request(url.resolve(ApiOptions.server,"api/volunteers/"+volid), {method: 'get',
        json: {}} ,function (err, apiResp, body) {
        res.render("volunteer-view.jade", {pageHeader:{title: title},formAction:body._id, volunteer:body})
    })
};

//put (change) handler
module.exports.volunteerEditCommit=function (req, res) {
    var volid=req.params.volunteerid;
    //api request by id ...
    request(url.resolve(ApiOptions.server,"api/volunteers/"+volid),{method: 'put', json: req.body},
        function (err, apiResp, body) {
            res.render("volunteer-view.jade", {pageHeader:{title: title}, formAction:body._id, volunteer:body})
        } )
};


//get new empty handler
module.exports.volunteerCreatePage = function (req, res) {
    //
    // request(url.resolve(ApiOptions.server,"api/volunteers/new"), {method: 'get',
    //     json: {}} ,function (err, apiResp, body) {

    //!implement schema request to dynamically get fields for current schema and generate  creation page
        res.render("volunteer-view.jade", {pageHeader:{title: title}, formAction:'', volunteer:{
                volunteerName: '',
                volunteerAddress: '',
                active: true,
                comment: "",
                feedingSchedule: [],
                createdOn: '',
            }})
    //})
};

module.exports.volunteerCreateCommit = function (req, res) {
request(url.resolve(ApiOptions.server,"api/volunteers/"), {method: 'post',
    json: req.body} ,function (err, apiResp, body) {
    res.render("volunteer-view.jade", {pageHeader:{title: title}, formAction:'/volunteers/'+body._id, volunteer:body})
})
};



// module.exports.volunteerCreate=function (req,res) {
// //need to add some advanced validation of arrived data
//     if (req.body && !req.body._id) {
//         request(url.resolve(ApiOptions.server, "api/volunteers/"), {method: 'post', json: req.body},
//             function (err, apiResp, body) {
//                 res.render("volunteer-edit.jade", {pageHeader: {title: title}, volunteer: body})
//             })
//     }
//     else res.end('volunteer ID arrived that shouldnt be happen when creating new object')
// };