var mongoose = require('mongoose');

var feedingScheduleSchema = new mongoose.Schema({
    days: {type: String, required: true},
    feedingTime: String,
});

var volunteerSchema = new mongoose.Schema({
    volunteerName: {type:String},
    volunteerAddress:{type:String},
    feedingSchedule: [feedingScheduleSchema],
    //rating: {type: Number, required: true, min: 0, max: 5},
    comment: String,
    createdOn: {type: Date, default: Date.now},
    active: {type: Boolean, required: true}
});


var catPhotoSchema = new mongoose.Schema({
    UplDate: {type: Date, default: Date.now},
    imageData: {type:'Buffer'},
    comment: String
});
var catsListSchema = new mongoose.Schema({
    catName: {type:String, required:true},
    catAge: {type: Number, "default": 0, min: 0, max: 30},
    catChipNumber: String,
    catColor: String,
    catWeight: {type: Number, "default": 0, min: 0, max: 30},
    catGender: {type:String, validate: /(male|female)$/},
    catDescription: String,
    catPhoto:[catPhotoSchema]
    });

var locationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: String,
    rating: {type: Number, "default": 0, min: 0, max: 5},
    waterSource:{type:Boolean, default: false},
    facilities: [String],
    coords: {type: [Number], index: '2dsphere'},
    volunteers:{ type: [mongoose.Schema.Types.ObjectId], ref: 'volunteerSchema'},
    cats:[catsListSchema],
    icon: {type:'Buffer'}
});

mongoose.model('locations',locationSchema);
mongoose.model('volunteers', volunteerSchema);
mongoose.model('cats', catsListSchema);

