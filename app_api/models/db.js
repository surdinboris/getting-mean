var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.connection.on('connected', function () {
    var srvFromUri=/.*@(.+\/)/.exec(dbURI)? /.*@(.+)\//.exec(dbURI)[1] : 'local';
    console.log('Mongoose connected to ' + srvFromUri);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg, type, callback) {
    mongoose.connection.close(function () {
        console.log(type + ' event occurred. Mongoose disconnected through ' + msg);
        callback();
    });
};

process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', 'SIGUSR2', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});
process.on('SIGINT', function () {
    gracefulShutdown('app termination', 'SIGINT',function () {
        process.exit(0);
    });
});
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', 'SIGTERM', function () {
        process.exit(0);
    });
});

var dbURI = 'mongodb://localhost/Loc8r';
console.log('Loaded in ' +process.env.NODE_ENV+ ' environment');
if(process.env.NODE_ENV == 'production'){
    console.log('DB connection changed to cluster');
    dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI,{ useNewUrlParser: true,  useCreateIndex: true});
require('./locations'); //db schema