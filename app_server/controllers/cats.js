let request = require("request");
let url =require('url');
let ApiOptions = {server:"http://localhost:3000"};
let contrlib = require('../../controllerlib');
if (process.env.NODE_ENV == 'production') {
    ApiOptions.server = "https://borrik.herokuapp.com";
}

//get new empty handler
module.exports.catCreatePage = function (req, res) {
    //schema request to dynamically get fields for current schema and generate  creation page
    contrlib.requestDbSchema("cat",ApiOptions).then(fieldsObj=>{
        res.render("cat-edit.jade", {pageHeader:{title: 'Cat edit page'}, formAction:'', cat:fieldsObj})
    }).catch(err=> res.end(err.toString()));
};

// module.exports.catCreateCommit = function (req,res) {
//     let locationid = req.query.locationid;
//     request(url.resolve(ApiOptions.server, '/api/cats/'), {method:"post", json:req.body},
//                 function (err,apiResp, body) {
//         if(err){
//             console.log(err)
//         }
//       //  else(console.log("-=+-__===-",body))
//     });
//     res.end('cat Create_commit: ')
// };

module.exports.childmodelCreateCommit = function (req, resp) {
    //determining which model to use
    // possible volunteer | cat (will be pluralized)
    let modpath=url.parse(req.url).pathname.replace('/','');
    let childmodel= modpath+'s';
    let locationid = req.query.locationid;
    //first - adding new cat and get its id
    request(url.resolve(ApiOptions.server, `api/${childmodel}/`), {
        method: 'post',
        json: req.body
    }, function (err, childModApiResp, childModBody) {
        console.log('>>>>>cat loc from client body',req.body);
        //second - get current set of childmodels
        request(url.resolve(ApiOptions.server, "api/locations/" + locationid), {
            method: 'get',
            json: {}
        }, function (err, locApiResp, locBody) {
            if (err) {
                console.log(err)
            }
            console.log('>>>>>cat loc api body',childModBody);

            let locChldModsUpdated = locBody[childmodel];
            //creating array of id's
            if (locChldModsUpdated.length > 0) {
                locChldModsUpdated = locChldModsUpdated.map(function (vol) {
                    return vol._id
                });
            }
            locChldModsUpdated.push(childModBody._id);

            //third - attach this id to location object
            request(url.resolve(ApiOptions.server, "api/locations/"+ locationid), {
                    method: 'put',
                    json: {volunteers: locChldModsUpdated.toString()}},
                function(err, updatedApiResp, updLocBody) {
                    if (err) {
                        console.log('error',err)
                    }
                    resp.redirect('/locations/'+locationid)
                })
        })
    })
};