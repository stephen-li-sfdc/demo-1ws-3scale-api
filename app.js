var express         = require('express'),
    rawBodyParser   = require('raw-body-parser'),
    fs              = require('fs'),
    path            = require('path'),
    uuid            = require('uuid'),
    winston         = require('winston');

var app = express();
app.use(function (req, res, next) {
    if (req) {
        winston.info('request headers: ',req.headers);
    }
    next();
});
app.use(function (req, res, next) {
    if (res) {
        winston.info('res headers: ',res.headers);
    }
    next();
});
app.use(rawBodyParser());

var internal_api_router = express.Router();

internal_api_router.get('/test', function(req, res) {
    res.json({ message: 'hooray! welcome to our internal api!' });
});

var external_api_router = express.Router();

external_api_router.get('/test', function(req, res) {
    res.json({ message: 'hooray! welcome to our external api!' });
});

winston.info('Web Concurrency in this dyno = ' + process.env.WEB_CONCURRENCY);

app.use('/i/api', internal_api_router);
app.use('/e/api', external_api_router);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
    console.log('running on ' + app.get('port') + '...');
});

