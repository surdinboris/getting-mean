//empty schema request
let mongoose = require('mongoose');


module.exports.responseDbSchema= function (req,res,shmodel) {
    let len= Object.keys(mongoose.model(shmodel).schema.tree).length;
    let fields= Object.keys(mongoose.model(shmodel).schema.tree);
    fields.splice(-3,len);
    return fields
};
