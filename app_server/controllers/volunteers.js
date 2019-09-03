var request = require("request");
var url =require('url');
var ApiOptions = {server:"http://localhost:3000"};

if (process.env.NODE_ENV == 'production') {
    ApiOptions.server = "https://borrik.herokuapp.com";
}

var volunteerEditTitle= 'Volunteer edit page';

//get handler
module.exports.volunteerEditPage = function (req, res) {

    var volid=req.params.volunteerid;
    //api request by id ...
    request(url.resolve(ApiOptions.server,"api/volunteers/"+volid), {method: 'get',
        json: {}} ,function (err, apiResp, body) {
        res.render("volunteer-view.jade", {pageHeader:{title: volunteerEditTitle},formAction:body._id, volunteer:body})
    })
};

//put (change) handler
module.exports.volunteerEditCommit=function (req, res) {
    var volid=req.params.volunteerid;
    //api request by id ...
    request(url.resolve(ApiOptions.server,"api/volunteers/"+volid),{method: 'put', json: req.body},
        function (err, apiResp, body) {
            res.render("volunteer-view.jade", {pageHeader:{title: volunteerEditTitle}, formAction:body._id, volunteer:body})
        } )
};


//get new empty handler
module.exports.volunteerCreatePage = function (req, res) {
    //
    // request(url.resolve(ApiOptions.server,"api/volunteers/new"), {method: 'get',
    //     json: {}} ,function (err, apiResp, body) {

    //!implement schema request to dynamically get fields for current schema and generate  creation page
        res.render("volunteer-view.jade", {pageHeader:{title: volunteerEditTitle}, formAction:'', volunteer:{
                volunteerName: '',
                volunteerAddress: '',
                active: true,
                comment: "",
                feedingSchedule: [],
                createdOn: '',
            }})
    //})
};
module.exports.volunteersList = function (req, resp) {
    request(url.resolve(ApiOptions.server, "/api/volunteers/"), {
        method: 'get',
        json: {}
    }, function (err, apiResp, body) {
        console.log(body)
        resp.render("volunteers-list.jade", {pageHeader: {title: 'Volunteers list'}, volunteers: body})
    });
};
module.exports.deleteVolunteer= function(req,resp){
  request(url.resolve(ApiOptions.server, "/api/volunteers/"+req.params.volunteerid),{
      method:'delete',
      json:{}
  }, function (err, volApiResp, volbody) {

      if(volApiResp.statusCode == 204){
          resp.end(req.params.volunteerid + ' - deleted')
      }
  })  
};
module.exports.volunteerCreateCommit = function (req, resp) {
    var locationId = req.query.locationId;
    //first - adding new volunteer and get its id
    request(url.resolve(ApiOptions.server, "api/volunteers/"), {
        method: 'post',
        json: req.body
    }, function (err, volApiResp, volBody) {
        //second - get current set of volunteers
        request(url.resolve(ApiOptions.server, "api/locations/" + locationId), {
            method: 'get',
            json: {}
        }, function (err, locApiResp, locBody) {
            if (err) {
                console.log(err)
            }
            var locVolsUpdated= locBody.volunteers;
            //creating array of id's
            locVolsUpdated=locVolsUpdated.map(function (vol) {
                return vol._id
            });
            locVolsUpdated.push(volBody._id);

            //third - attach this id to location object
            request(url.resolve(ApiOptions.server, "api/locations/"+ locationId), {
                method: 'put',
                json: {volunteers: locVolsUpdated.toString()}},
                function(err, updatedApiResp, updLocBody) {
                    if (err) {
                        console.log('error',err)
                    }
                    resp.redirect('/locations/'+locationId)


            })
        })
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