module.exports.avatarAssign = function (req, res) {

    let photoid = req.params.photoid;
    let modid = req.params.modid;
    //let reqmodel = detectModelFromRequest(req);
    console.log('avatarAssign fired',photoid,modid);
    res.end('avatar setted successfully (test)')

};