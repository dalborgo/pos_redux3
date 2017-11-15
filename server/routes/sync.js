import Swagger from 'swagger-client';
import config from '../../config/config.json';
import fs from 'fs';
import spec from '../../static/sg/sync-gateway-admin-1-4.json';
import {v4} from 'uuid';
spec.host = config.couchbase.sync_server_admin;
function getBase64(path){
    let img = fs.readFileSync(path);
    return img.toString('base64');
}
let client;
new Swagger({
    spec: spec,
    usePromise: true
}).then(function (res) {
    client = res;
    // Start getting changes at seq: 0
   /* getChanges(0);

    function getChanges(seq) {
        // Use the Swagger client to connect to the changes feed
        //filter: 'sync_gateway/bychannel',
        //channels: 'notification',
        client.apis.database.get__db___changes({
            db: 'risto',
            include_docs: true,
            active_only: true,
            since: seq,
            feed: 'longpoll',
            timeout: 0
        })
            .then(function (val) {
                const results = val.obj.results;
                console.log(results.length + ' change(s) received');
                processChanges(results);
                getChanges(val.obj.last_seq);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    function processChanges(results) {
        let doc;
        for (let i = 0; i < results.length; i++) {
            doc = results[i].doc;
            console.log(doc);
        }
        return doc;
    }*/
});

const appRouter = function (app) {

    app.get('/api/sync/change', function (req, res) {
        //res.end('ciao');
       /* getChanges(0);

        function getChanges(seq) {
            // Use the Swagger client to connect to the changes feed
            //filter: 'sync_gateway/bychannel',
            //channels: 'notification',
            client.apis.database.get__db___changes({
                db: 'risto',
                include_docs: true,
                active_only: true,
                since: seq,
                feed: 'longpoll',
                timeout: 0
            })
                .then(function (val) {
                    const results = val.obj.results;
                    console.log(results.length + ' change(s) received');
                    res.json(processChanges(results));
                    getChanges(val.obj.last_seq);
                })
                .catch(function (err) {
                    console.log(err);
                });
        }

        function processChanges(results) {
            let doc;
            for (let i = 0; i < results.length; i++) {
                doc = results[i].doc;
                //console.log(doc);
            }
            return doc;
        }*/
    });
    app.get('/api/sync/room/create', function (req, res) {
        let body = {
            "_id": "Room::" + v4(),
            "type": "Room",
            "name": "Room 2",
            "display": "Salone",
            "rgb": [0, 0, 0],
            "image": "",
            "tables": []
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });
    app.get('/api/sync/macro/create', function (req, res) {
        let type = 'Macro';
        let body = {
            "_id": type + "::" + v4(),
            "type": type,
            "name": "cibo",
            "display": "Mangiare",
            "rgb": [0, 0, 0],
            "image": "",
            "categories": []
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });

    app.get('/api/sync/category/create', function (req, res) {
        let type = 'Category';
        let body = {
            "_id": type + "::" + v4(),
            "type": type,
            "name": "primi",
            "display": "Primi Piatti",
            "rgb": [0, 0, 0],
            "image": "",
            "macrocategory": "",
            "products": [],
            "variants": []
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });

    app.post('/api/sync/get/tables', function (req, res) {
        client.apis.query.get__db___design__ddoc___view__view_({
            db: config.couchbase.sync_db,
            ddoc: "tables",
            view: "all",
            stale: req.body.stale.toString()
        }).then(function (userRes) {
            console.log(userRes);
            res.send(userRes);
        }).catch(function (err) {
            console.log(err);
        });
        //res.end()
    });

    app.get('/api/sync/product/create', function (req, res) {
        let type = 'Product';
        let body = {
            "_id": type + "::" + v4(),
            "type": type,
            "name": "spag-scoglio",
            "display": "Spaghetti allo Scoglio",
            "rgb": [0, 0, 0],
            "image": "",
            "category": "Category::80e7f07c-beaa-42aa-98ca-5ed4d701da09",
            "variants": [],
            "vat_department_id": "VAT::3b4e95f1-31de-426e-947c-22ff08151828",
            "price": [{catalog:"Catalog::865e2a9d-850b-4413-adf2-f1010331b903", price: 14000},{catalog:"Catalog::caf6f43a-0087-4d8f-90ff-2f5c81ce13a6", price: 12000}]
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });

    app.get('/api/sync/variant/create', function (req, res) {
        let type = 'Variant';
        let body = {
            "_id": type + "::" + v4(),
            "type": type,
            "name": "salpicc",
            "display": "Salamino Piccante",
            "rgb": [0, 0, 0],
            "image": "",
            "category": "",
            "price": ["Catalog::9bf9feb7-13c8-426d-a7f9-b0fa2cc5f8d1", 2000]
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });
    app.get("/api/table/img", function (req, res) {
        let tavolo=getBase64('./static/imgs/tavolo.png');
        res.send(tavolo);
    });
    app.post("/api/sync/table/create", function (req, res) {
        let tavolo=getBase64('./static/svg/tab_vuoto.svg');
        let tavolo2=getBase64('./static/svg/tab_pieno.svg');
        const name = req.body.name;
        const display = req.body.display;
        const room = req.body.room;
        let body = {
            "_id": "Table::" + v4(),
            "type": "Table",
            "name": name,
            "display": display,
            "rgb": [0, 0, 0],
            "Room": room,
            "_attachments" : {
                "tavolo_vuoto_100": {
                    "content_type": 'image\/svg+xml',
                    "data": tavolo
                },
                "tavolo_pieno_100": {
                    "content_type": 'image\/svg+xml',
                    "data": tavolo2
                }
            }
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });

    app.get("/api/sync/exit/create", function (req, res) {
        let type = 'Exit';
        let body = {
            "_id": type + "::" + v4(),
            "type": type,
            "display": "Uscita 3",
            "index": 3
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });

    app.get("/api/sync/table/bulk_create", function (req, res) {
        let img = fs.readFileSync('./static/imgs/tavolo.png');
        let tavolo = img.toString('base64');
        let img2 = fs.readFileSync('./static/imgs/tavolo2.png');
        let tavolo2 = img2.toString('base64');
        let body = {
            "docs": [
                {
                    "_id": "Table::76e6e4ea-7d00-4999-a75d-aeb46ffe5702",
                    "type": "Table",
                    "name": "Table 1",
                    "display": "Tavolo Grande",
                    "rgb": [0, 0, 0],
                    "image": "",
                    "Room": "Room::1983e957-11aa-4250-89c6-cfa2e0bb7aa2",
                    "_attachments" : {
                        "tavolo_vuoto_100": {
                            "content_type": 'image\/png',
                            "data": tavolo
                        },
                        "tavolo_pieno_100": {
                            "content_type": 'image\/png',
                            "data": tavolo2
                        }
                    }
                }, {
                    "_id": "Table::6f5e484d-8e4f-41e6-9c68-40fc728e4eb0",
                    "type": "Table",
                    "name": "Table 2",
                    "display": "Tavolo Esterno",
                    "rgb": [0, 0, 0],
                    "image": "",
                    "Room": "Room::1983e957-11aa-4250-89c6-cfa2e0bb7aa2",
                    "_attachments" : {
                        "tavolo_vuoto_100": {
                            "content_type": 'image\/png',
                            "data": tavolo
                        },
                        "tavolo_pieno_100": {
                            "content_type": 'image\/png',
                            "data": tavolo2
                        }
                    }
                },
                {
                    "_id": "Room::1983e957-11aa-4250-89c6-cfa2e0bb7aa2",
                    "type": "Room",
                    "name": "Room 1",
                    "display": "Attico",
                    "rgb": [0, 0, 0],
                    "image": "",
                    "tables": ["Table::76e6e4ea-7d00-4999-a75d-aeb46ffe5702", "Table::6f5e484d-8e4f-41e6-9c68-40fc728e4eb0"]
                }
            ]
        };
        client.apis.database.post__db___bulk_docs({
            db: config.couchbase.sync_db,
            BulkDocsBody: body
        }).then(function (userRes) {
            res.json(userRes);
        }).catch(function (err) {
            console.log(err);
            res.send("error");
        });
    });
    app.get("/api/sync/table/bulk_create_svg", function (req, res) {
        let img = fs.readFileSync('./static/svg/meal.svg');
        let tavolo = img.toString('base64');
        let img2 = fs.readFileSync('./static/svg/meal.svg');
        let tavolo2 = img2.toString('base64');
        let body = {
            "docs": [
                {
                    "_id": "Table::"+v4(),
                    "type": "Table",
                    "name": "Table 7",
                    "display": "Tavolo Rettangolare",
                    "rgb": [0, 0, 0],
                    "image": "",
                    "Room": "Room::1983e957-11aa-4250-89c6-cfa2e0bb7aa2",
                    "_attachments" : {
                        "tavolo_vuoto_100": {
                            "content_type": 'image\/svg+xml',
                            "data": tavolo
                        },
                        "tavolo_pieno_100": {
                            "content_type": 'image\/svg+xml',
                            "data": tavolo2
                        }
                    }
                }
            ]
        };
        client.apis.database.post__db___bulk_docs({
            db: config.couchbase.sync_db,
            BulkDocsBody: body
        }).then(function (userRes) {
            res.json(userRes);
        }).catch(function (err) {
            console.log(err);
            res.send("error");
        });
    });

    app.get("/api/sync/table/bulk_get", function (req, res) {
        let body = {
            "docs": [
                {
                    "id": "Room::1983e957-11aa-4250-89c6-cfa2e0bb7aa2"
                }
            ]
        };
        client.apis.database.post__db___bulk_get({
            db: config.couchbase.sync_db,
            BulkGetBody: body,
            attachments: false
        }).then(function (userRes) {
            //res.set('Content-Type', 'application/json');
            //const d=JSON.stringify(JSON.decode(new Uint8Array(userRes.data)),null,4)
            res.send(new Buffer(userRes.data).toString());
        }).catch(function (err) {
            console.log(err);
            res.send("error");
        });
    });


    app.get("/api/sync/table/image", function (req, res) {
        client.apis.attachment.get__db___doc___attachment_({
            db: config.couchbase.sync_db,
            doc: "User::dalborgo2",
            attachment: "image"
        }).then(function (userRes) {
            res.end(userRes.data);
        }).catch(function (err) {
            console.log(err);
            res.send("error");
        });
    });
    app.get("/api/sync/get/table/:id", function (req, res) {
        client.apis.document.get__db___doc_({
            db: config.couchbase.sync_db,
            doc: req.params.id
        }).then(function (userRes) {
            //console.log(userRes.data)
            res.json(userRes);
        }).catch(function (err) {
            console.log(err);
            res.send("error");
        });
    });

    app.post('/api/sync/delete/table', function (req, res) {
        let tavolo=req.body;
        client.apis.document.delete__db___doc_({
            db: config.couchbase.sync_db,
            rev: tavolo.rev,
            doc: tavolo.id
        }).then(function (userRes) {
            console.log(userRes);
            res.send(userRes);
        }).catch(function (err) {
            console.log(err);
        });
        //res.end()
    });
    app.get("/api/sync/create/views", function (req, res) {
        let body = {"views": {"all": {"map": "function(doc, meta) {if (doc.type == \"Room\") {emit(doc.display, null);}}"}}}
        client.apis.query.put__db___design__ddoc_({db: config.couchbase.sync_db, body: body,ddoc:'rooms'}).then(function (userRes) {
            console.log(userRes.statusText);
        }).catch(function (err) {
            console.log(err);
        });
        body = {"views": {"all": {"map": "function(doc, meta) {if (doc.type == \"Table\") {emit(doc.id, doc);}}"}}}
        client.apis.query.put__db___design__ddoc_({db: config.couchbase.sync_db, body: body,ddoc:'tables'}).then(function (userRes) {
            console.log(userRes.statusText);
        }).catch(function (err) {
            console.log(err);
        });
        res.send('ok')
    });
    app.post("/api/sync/user/create", function (req, res) {
        let type = "User";
        const user = req.body.user;
        const password = req.body.password;
        let body = {
            "_id": type + "::"+user,
            "type": type,
            "name": "Marco",
            "surname": "Dal Borgo",
            "user": "dalborgo",
            "password":password,
            "role": "administrator"
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes);
        }).catch(function (err) {
            console.log(err);
        });
        res.send(body)
    });
    app.post("/api/sync/user/create", function (req, res) {
        let post = req.body;
        let type = "User";
        let body = {
            "_id": type + "::" + post.user,
            "type": type,
            "name": "Marco",
            "surname": "Dal Borgo",
            "user": post.user,
            "password": post.password,
            "role": "administrator"
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            res.json(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        //res.send(body)
    });
};
module.exports = appRouter;