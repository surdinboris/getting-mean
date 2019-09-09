let request = require("request");
let url =require('url');
let ApiOptions = {server:"http://localhost:3000"};

if (process.env.NODE_ENV == 'production') {
    ApiOptions.server = "https://borrik.herokuapp.com";
}

let volunteerEditTitle= 'Volunteer edit page';

//get handler
module.exports.volunteerEditPage = function (req, res) {

    let volid=req.params.volunteerid;
    //api request by id ...
    request(url.resolve(ApiOptions.server,"api/volunteers/"+volid), {method: 'get',
        json: {}} ,function (err, apiResp, body) {
        res.render("volunteer-view.jade", {pageHeader:{title: volunteerEditTitle},formAction:body._id, volunteer:body})
    })
};

//put (change) handler
module.exports.volunteerEditCommit=function (req, res) {
      let volid=req.params.volunteerid;
    //api request by id ...
    request(url.resolve(ApiOptions.server,"api/volunteers/"+volid),{method: 'put', json: req.body},
        function (err, apiResp, body) {
            res.render("volunteer-view.jade", {pageHeader:{title: volunteerEditTitle}, formAction:body._id, volunteer:body})
        } )
};


//loading list fo volunteers and render pick up page
module.exports.volunteerAssignPage = function (req, res){
    let locationname = req.query.locationname;
    //console.log('___',locationid);
    request(url.resolve(ApiOptions.server, "api/locations/all"), {method: 'get',
    json:{}}, function (err, apiResp, locsBody) {
        request(url.resolve(ApiOptions.server, "api/volunteers"), {
                method: 'get',
                json: {}
            },
            function (err, apiResp, volsBody) {
                //res.end(JSON.stringify(locsBody.concat(volsBody)));
                res.render('volunteer-assign-view.jade',{pageHeader:{title: 'Assign Volunteer'}, defloc:locationname, locations:locsBody, volunteers:volsBody})
            });
    })};

// getting user's choise of volunteer and location - assign volunteer to location
module.exports.volunteerAssignCommit = function (req,resp) {
    console.log('>>>>>',req.body);
    let attachvol= req.body.volunteer;
    let locationid= req.body.location;

    request(url.resolve(ApiOptions.server, "api/locations/" + locationid), {
        method: 'get',
        json: {}
    }, function (err, locApiResp, locBody) {
        if (err) {
            console.log(err)
        }
        let locVolsUpdated = locBody.volunteers;
        //creating array of id's
        locVolsUpdated=locVolsUpdated.map(function (vol) {
            return vol._id
        });
        locVolsUpdated.push(attachvol);

        //third - attach this id to location object
        request(url.resolve(ApiOptions.server, "api/locations/"+ locationid), {
                method: 'put',
                json: {volunteers: locVolsUpdated.toString()}},
            function(err, updatedApiResp, updLocBody) {
                if (err) {
                    console.log('error',err)
                }
                resp.redirect('/locations/'+locationid)
            })
    })

};


//get new empty handler
module.exports.volunteerCreatePage = function (req, res) {
    //
    // request(url.resolve(ApiOptions.server,"api/volunteers/schema"), {method: 'get',
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
module.exports.volunteersLocations = function (req,resp) {
    let volunteerid=req.params.volunteerid;
    let voldata=  new Promise(function(resolve,reject){
        request(url.resolve(ApiOptions.server, "/api/volunteers/view-locations/"+volunteerid),{
        method:'get',
        json:{}}, function (err,apiResp,voluntersLocations) {
            if(err){
                reject(err)
            }
            resolve(voluntersLocations)
        })});

    voldata.then(function (voluntersLocations) {
        let locationdata= voluntersLocations.locationlist;
        let nolocations;
        if (!locationdata.length){
            nolocations = 'Volunteer has no locations assigned :-( '
            //locationdata=[{name:'Volunteer has no locations assigned :-( '}]
        }
        resp.render("volunteer-with-locations-view.jade", {pageHeader: {title: 'Volunteer\'s locations list'}, volunteer:{_id:volunteerid},nolocations:nolocations, locationdata: locationdata})

    }).catch(err=>resp.end(err));
   };


module.exports.volunteersList = function (req, resp) {
    request(url.resolve(ApiOptions.server, "/api/volunteers/"), {
        method: 'get',
        json: {}
    }, function (err, apiResp, body) {
        resp.render("volunteers-list.jade", {pageHeader: {title: 'Volunteers list'}, volunteers: body})
    });
};
module.exports.deleteVolunteer= function(req,resp){
  request(url.resolve(ApiOptions.server, "/api/volunteers/"+req.params.volunteerid),{
      method:'delete',
      json:{}
  }, function (err, volApiResp, volbody) {

      if(volApiResp.statusCode == 204){
          //add pareq.params.volunteerid + ' - deleted'
          resp.redirect("/volunteers/")
      }
      else{
          resp.end('API returned error code ' + volApiResp.statusCode )
      }
  })  
};
module.exports.volunteerCreateCommit = function (req, resp) {
    let locationid = req.query.locationid;
    //first - adding new volunteer and get its id
    request(url.resolve(ApiOptions.server, "api/volunteers/"), {
        method: 'post',
        json: req.body
    }, function (err, volApiResp, volBody) {
        //second - get current set of volunteers
        request(url.resolve(ApiOptions.server, "api/locations/" + locationid), {
            method: 'get',
            json: {}
        }, function (err, locApiResp, locBody) {
            if (err) {
                console.log(err)
            }
            let locVolsUpdated = locBody.volunteers;
            //creating array of id's
            locVolsUpdated=locVolsUpdated.map(function (vol) {
                return vol._id
            });
            locVolsUpdated.push(volBody._id);

            //third - attach this id to location object
            request(url.resolve(ApiOptions.server, "api/locations/"+ locationid), {
                method: 'put',
                json: {volunteers: locVolsUpdated.toString()}},
                function(err, updatedApiResp, updLocBody) {
                    if (err) {
                        console.log('error',err)
                    }
                    resp.redirect('/locations/'+locationid)
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