//empty schema request
module.exports.responseDbSchema= function (req,res,model) {

    let len= Object.keys(mongoose.model(model).schema.tree).length;
    let fields= Object.keys(mongoose.model(model).schema.tree);
    fields.splice(-3,len);
    sendJsonResponse(res, 220, fields)
};
