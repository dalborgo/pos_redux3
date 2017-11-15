import SourceMapSupport from 'source-map-support';

SourceMapSupport.install();
import 'babel-polyfill';
import couchbase from 'couchbase';
import ottoman from 'ottoman';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import stampa from './stampa';
import config from '../config/config.json';
const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
/*const CouchbaseStore = require('connect-couchbase')(session);
const couchbaseStore = new CouchbaseStore({
    bucket: config.couchbase.bucket,               //optional
    host: config.couchbase.server,          //optional
    prefix: 'Sess|',
    ttl: 86400 //in secondi 86400
});

app.use(session({
    store: couchbaseStore,
    secret: config.salt,
    cookie: {maxAge: 24 * 60 * 60 * 1000},
    resave: false,
    saveUninitialized: true //stay open for 1 day of inactivity
}));*/

const myBucket = (new couchbase.Cluster(config.couchbase.server)).openBucket(config.couchbase.bucket);
ottoman.store = new ottoman.CbStoreAdapter(myBucket, couchbase);
module.exports = {store: ottoman.store, bucket: myBucket};
//module.exports.bucket = myBucket;

/*couchbaseStore.on('connect', function () {
    //console.log("Couchbase Session store is ready for use");
});*/

app.use(cookieParser());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, api_key, Authorization");
    next();
});

const user = require("./routes/sync")(app);
const standard = require("./routes/standard")(app);

//const print = require("./routes/print")(app);

function getChanges(seq) {
    console.log('seq %s', seq);
    let url = `http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}`;
    console.log('Attesa print');
    fetch(url + `/_changes?include_docs=true&feed=longpoll&filter=sync_gateway/bychannel&channels=prints&since=${seq}`, {})
        .then((res) => res.json())
        .then((res) => {
            let m = res.results;
            console.log('Print ' + m.length);
            if (m.length > 0) {
                console.log('PRINT ACCEPTED');
                m.map(r => {stampa(r)});
            }
            getChanges(res.last_seq);
        });
}


myBucket.get('_sync:seq', function (err, r) {
    getChanges(r.value);
});


app.get('/*', (req, res) => {
    res.sendFile(path.resolve('static/index.html'));
});

const Stampante = require('../models/printer');
/*var q = N1qlQuery.fromString("SELECT * FROM `risto` t WHERE _type='Stampante' AND ARRAY_CONTAINS(categories, 'bagno')");
var req = bucket.query(q);
req.on('row', function(row) {
    console.log('Got a row',row);
});*/



ottoman.ensureIndices(function (error) {
    if (error) {
        console.log(error);
    }
    const server = app.listen(3000, function () {
        console.log(config.couchbase);
        console.log("Listening on port %s...", server.address().port);
    });

});
