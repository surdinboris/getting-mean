//empty schema request
module.exports.responseDbSchema= function (req,res,model) {
    console.log('-----------apilib init------');
    let len= Object.keys(mongoose.model(model).schema.tree).length;
    let fields= Object.keys(mongoose.model(model).schema.tree);
    fields.splice(-3,len);
    console.log('from apilib', fields);
    return fields
};
