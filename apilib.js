//empty schema request
let mongoose = require('mongoose');

//returns models fields for db
module.exports.responseDbSchema= function (req,res,shmodel) {
    let hiddenFields=['avatarID','catPhoto', '_id', '__v', 'id'];
    //let len= Object.keys(mongoose.model(shmodel).schema.tree).length;
    let fields= Object.keys(mongoose.model(shmodel).schema.tree);
    fields=fields.filter(function (f) {
        let isFiltered = hiddenFields.indexOf(f);
        if(isFiltered > -1){
            return
        }
        else{
            return f
        }
    });
    return fields
};
