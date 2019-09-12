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
