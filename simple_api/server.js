var path = require('path');
var express = require('express');
var api = require(path.resolve('simple_api/api'));
var bodyParser = require('body-parser');
var port = 9091;

var app = express();

app.use(bodyParser.json());
app.use(express.static(path.resolve('public')));
app.use('/api', api)

app.listen(port, 'localhost', function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at http://localhost:' + port);
});
