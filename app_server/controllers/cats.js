let request = require("request");
let url =require('url');
let ApiOptions = {server:"http://localhost:3000"};
let contrlib = require('../../controllerlib');
if (process.env.NODE_ENV == 'production') {
    ApiOptions.server = "https://borrik.herokuapp.com";
}

let catFilteredFields=['catPhoto','__v','_id'];

let catEditTitle= 'Cat edit page';

//get handler
module.exports.catEditPage = function (req, res){
    let catid=req.params.catid;
    //api request by id ...
    request(url.resolve(ApiOptions.server,"api/cats/"+catid), {method: 'get',
        json: {}} ,function (err, apiResp, body) {
        body = contrlib.dbFilter(body,'cats');
        res.render("cat-edit.jade", {pageHeader:{title: catEditTitle},formAction:catid, cat:body})
    })
};

//put (change) handler
module.exports.catEditCommit=function (req, res){
    let catid=req.params.catid;
    //api request by id ...
    request(url.resolve(ApiOptions.server,"api/cats/"+catid),{method: 'put', json: req.body},
        function (err, apiResp, body) {
            body= contrlib.dbFilter(body,'cats');
            res.render("cat-edit.jade", {pageHeader:{title: catEditTitle}, formAction:catid, cat:body})
        } )
};


//get new empty handler
module.exports.catCreatePage = function (req, res) {
    //schema request to dynamically get fields for current schema and generate  creation page
    contrlib.requestDbSchema("cats",ApiOptions).then(fieldsObj=>{
        res.render("cat-edit.jade", {pageHeader:{title: catEditTitle}, formAction:'', cat:fieldsObj})
    }).catch(err=> res.end(err.toString()));
};

module.exports.catsList = function (req, resp) {
    request(url.resolve(ApiOptions.server, "/api/cats/"), {
        method: 'get',
        json: {}
    }, function (err, apiResp, body) {
        resp.render("cats-list.jade", {pageHeader: {title: 'Cats list'}, cats: body})
    });
};

module.exports.catsLocations = function (req,resp) {
    let catid=req.params.catid;
    let voldata=  new Promise(function(resolve,reject){
        request(url.resolve(ApiOptions.server, "/api/cats/view-locations/"+catid),{
            method:'get',
            json:{}}, function (err,apiResp,catsLocations) {
            if(err){
                reject(err)
            }
            resolve(catsLocations)
        })});

    voldata.then(function (locations) {
        let locationdata= locations.locationlist;
        let nolocations;
        if (!locationdata.length){
            nolocations = 'Cat has no locations assigned :-( '
            //locationdata=[{name:'Volunteer has no locations assigned :-( '}]
        }
        resp.render("cat-with-locations-view.jade", {pageHeader: {title: 'Cat\'s locations list'}, cat:{_id:catid},nolocations:nolocations, locationdata: locationdata})

    }).catch(err=>resp.end(err));
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
        //second - get current set of childmodels
        request(url.resolve(ApiOptions.server, "api/locations/" + locationid), {
            method: 'get',
            json: {}
        }, function (err, locApiResp, locBody) {
            if (err) {
                console.log(err)
            }
            let locChldModsUpdated = locBody[childmodel];
            //creating array of id's
            if (locChldModsUpdated.length > 0) {
                locChldModsUpdated = locChldModsUpdated.map(function (cat) {

                    return cat._id

                });
            }
            locChldModsUpdated.push(childModBody._id);

            //third - attach this id to location object
            request(url.resolve(ApiOptions.server, "api/locations/"+ locationid), {
                    method: 'put',
                    json: {cats: locChldModsUpdated.toString()}},
                function(err, updatedApiResp, updLocBody) {
                    if (err) {
                        console.log('error',err)
                    }
                    resp.redirect('/locations/'+locationid)
                })
        })
    })
};

module.exports.catAssignPage = function (req, res){

    let locationname = req.query.locationname;
    //console.log('___',locationid);
    request(url.resolve(ApiOptions.server, "api/locations/all"), {method: 'get',
        json:{}}, function (err, apiResp, locsBody) {
        request(url.resolve(ApiOptions.server, "api/cats"), {
                method: 'get',
                json: {}
            },
            function (err, apiResp, catsBody) {
                //res.end(JSON.stringify(locsBody.concat(volsBody)));
                res.render('cat-assign-view.jade',{pageHeader:{title: 'Assign Cat'}, defloc:locationname, locations:locsBody, cats:catsBody})
            });
    })};

module.exports.catAssignCommit = function(req,res) {
    //creating preconfiguder object
    let requestResolver = new contrlib.modelAssignCommit(req, res);
    requestResolver.renderExec(req,res)
    //return new contrlib.modelAssignCommit(req, res);
};


