let mongoose = require('mongoose');
let Loc = mongoose.model('locations');
let Cat = mongoose.model('cats');
let apilib = require('../../apilib');
let sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};
let fs = require('fs');

module.exports.getModPhotos= function (req,res) {
    let modid=req.params.modid;
    

    res.end('photos api request arrived '+modid)

}