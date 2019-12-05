let mongoose = require('mongoose');
let url = require('url');
let sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.avatarAssign = function (req, res) {

    let reqmodel =req.body.model;
    let newAvatarid = req.body.photoID;
    let modid = req.params.modid;
    console.log('>>avatarAssign',newAvatarid);

    mongoose.model(reqmodel).findOne({_id:modid}, function (err, cat) {
            if (err) {
                console.log('error', err);
                sendJsonResponse(res, 501, 'error during avatar change: '+err)
            }
            else {

                console.log('target cat', cat, newAvatarid);
                //add some validation if picture present in subarray
                cat.set('avatarID', newAvatarid);
                cat.save();
                sendJsonResponse(res, 220, 'avatar changed successfully')
            }
        });
    //let reqmodel = detectModelFromRequest(req);
};

module.exports.avatarRetrieve = function(req,res){
    let reqmodel =req.body.model;
    let modid = req.params.modid;
    mongoose.model(reqmodel).findOne({_id:modid}, function (err, cat) {
        if (err) {
            console.log('error', err)
        }
        else {
            sendJsonResponse(res, 220, cat.avatarID)
        }
    })
};