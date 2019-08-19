var request = require("request");
var url =require('url');
var ApiOptions = {server:"http://localhost:3000"};

if (process.env.NODE_ENV == 'production') {
    ApiOptions.server = "https://borrik.herokuapp.com";
}

var renderLocation = function (err,res,body){
       res.render("location-info", body)
};

var renderHomePage=function (err, res, body) {
        var message;
        if (err) {
            message = (err);}
        if (!body.length) {
            message = "No places found nearby";
        }
        if (!(body instanceof Array)) {
            message = "API lookup error";
            body = [];
        }

        console.log(JSON.stringify(body));
        res.render('locations-list',  {        title: 'Cats feeding network',
            pageHeader: {
                title: ' Lets feed our wonderful cats together!'
            },
            sidebar: {
                context: 'Cat feeders serve as an important source of available food for free-roaming cats (FRCs) and can play a central role in providing data on FRC distribution, welfare, and health. Data on cat feeder personalities as well as a better understanding of their feeding practices offer relevance for decision making concerning FRC population control strategies. The current study surveyed 222 FRC feeders who responded to a municipal trap-neuter-return (TNR) campaign in an Israeli central urban setting. The aim of the study was to describe their personal characteristics, feeding practices, and the FRC populations they feed. Feeders were divided into four groups according to the number of cats they claimed to feed per day (group 1: fed up to 5 cats, group 2: fed 6–10 cats, group 3: fed 11–20 cats, and group 4: fed ≥21 cats). Most feeders were women (81%), with a median age of 58 years (range 18–81). The feeders reported an overall feeding of 3337 cats in 342 different feeding locations. Feeders of group 4 comprised 15.31% (n = 34) of all feeders but fed 56% (n = 1869) of the FRC in 37.42% (n = 128) of the feeding locations. “Heavy” feeders (groups 3 and 4) reported that they traveled significantly longer distances in order to feed the cats. Commercial dry food consisted of 90% of the food they provided, with 66% of them feeding once a day, with less food per cat per day than the other feeder groups. Interestingly, “heavy” feeders were usually singles, had on average fewer siblings, a clear preference for owning cats as pets, and lived in lower income neighborhoods. According to the feeders’ reports on the FRC populations they fed, 69.7% (2325/3337) cats were neutered and 11.8% (395/3337) were kittens. In addition, they reported that 1.6% (54/3337) of the cats were limping, 2% (67/3337) suffered from a systemic disease, 4% (135/3337) had skin lesions, and 3.9% (130/3337) were suffering from a chronic disability. Abundance of kittens and morbidity rate were significantly and negatively associated with neutering rate. These findings are in accordance with the suggestion that neutering may potentially improve cat welfare by reducing morbidity. Collaboration by the authorities with these heavy feeders, who represent a small number of FRC feeders and feed substantial FRC numbers, may be significant for the control and monitoring of FRC populations and their resources.'
            },
            locations:body,
        message: message})
    };

/* GET 'home' page */
module.exports.homelist = function(req, res) {
    //request and in callback renderHomePage
    request(url.resolve(ApiOptions.server, 'api/locations'),
        {
            method: 'get',
            json: {},
            qs: {
                lng: 34.767513,
                lat: 32.071269,
                dst: 4000000
            },
            //  timeout:2
        }, function (err, apiResp, body) {

//detect position?
            renderHomePage(err, res, body)
        });
};


module.exports.locationInfo = function(req, res) {
    request(url.resolve(ApiOptions.server, 'api/locations/'+req.params.locationid), {
        method: 'get',
            json: {},

        }, function (err,apiResp,body) {
        var message;
        if (err) {
            message = (err);}
        if (!body.length) {
            message = "No places found nearby";
        }
        renderLocation(err,res,body)

        })


};


// /* GET 'Location info' page */
// module.exports.locationInfo = function(req, res) {
//     res.render('location-info', {
//         title: 'Habima back yard Cats',
//         pageHeader: {
//             title: "Let's feed our cats together!"
//         },
//         sidebar: {
//             context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
//             callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
//         },
//         location: {
//             name: 'Habima back yard Cats',
//             address: 'Tel Aviv, Habima st, 1',
//             rating: 3,
//             facilities: ['Water source', 'Trees', 'Junk containers'],
//             coords: {
//                 lat: 51.455041,
//                 lng: -0.9690884
//             },
//             openingTimes: [{
//                 days: 'Monday - Friday',
//                 opening: '7:00am',
//                 closing: '7:00pm',
//                 closed: false
//             }, {
//                 days: 'Saturday',
//                 opening: '8:00am',
//                 closing: '5:00pm',
//                 closed: false
//             }, {
//                 days: 'Sunday',
//                 closed: true
//             }],
//             reviews: [{
//                 author: 'Simon Holmes',
//                 rating: 5,
//                 timestamp: '16 July 2013',
//                 reviewText: 'What a great place. I can\'t say enough good things about it.'
//             }, {
//                 author: 'Charlie Chaplin',
//                 rating: 3,
//                 timestamp: '16 June 2013',
//                 reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
//             }]
//         }
//     });
// };

/* GET 'Add review' page */
module.exports.addReview = function(req, res) {
    res.render('location-review-form', {
        title: 'Review Starcups on Loc8r',
        pageHeader: {
            title: 'Review Starcups'
        }
    });
};
