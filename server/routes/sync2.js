import Swagger from 'swagger-client';
import fs from 'fs';
import config from '../../config/config.json';
import spec from '../../static/sg/sync-gateway-public-1-3_public.json';
import {v4} from 'uuid';

spec.host = config.couchbase.sync_server_admin;
let client;
new Swagger({
    spec: spec,
    usePromise: true
}).then(function (res) {
    client = res
});

const appRouter = function (app) {

    app.get('/api/sync/room/create', function (req, res) {
        let body = {
            "_id": "Room::" + v4(),
            "type": "Room",
            "name": "Room 1",
            "display": "Attico",
            "rgb": [0, 0, 0],
            "image": "",
            "index": 1,
            "tables": ["Table::" + v4(), "Table::" + v4()]
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });

    app.get("/api/sync/table/create", function (req, res) {
        let body = {
            "_id": "Table::e532a0d6-c59e-4610-a5fa-3226f73f46bc",
            "type": "Table",
            "name": "Table 2",
            "display": "Tavolo Esterno",
            "rgb": [0, 0, 0],
            "image": "",
            "index": 1,
            "Room": "Room::143be1d0-5bf4-4b53-9836-5abe377a99dc"
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });

    app.get("/api/sync/table/bulk_create", function (req, res) {
        let body = {
            "docs": [
                {
                    "_id": "Table::76e6e4ea-7d00-4999-a75d-aeb46ffe5702",
                    "type": "Table",
                    "name": "Table 1",
                    "display": "Tavolo Grande",
                    "rgb": [0, 0, 0],
                    "image": "",
                    "index": 1,
                    "_rev": "1-4197c9093866d10ff2c4e6e63ae63d5d",
                    "Room": "Room::1d633c4c-5a24-4632-add8-eddb94ecc434"
                }, {
                    "_id": "Table::6f5e484d-8e4f-41e6-9c68-40fc728e4eb0",
                    "type": "Table",
                    "name": "Table 2",
                    "display": "Tavolo Esterno",
                    "rgb": [0, 0, 0],
                    "image": "",
                    "index": 1,
                    "_rev": "1-cb24694463d95f6f06437676a454b60c",
                    "Room": "Room::1d633c4c-5a24-4632-add8-eddb94ecc434"
                },
                {
                    "_id": "Room::1983e957-11aa-4250-89c6-cfa2e0bb7aa2",
                    "type": "Room",
                    "name": "Room 1",
                    "display": "Attico",
                    "rgb": [0, 0, 0],
                    "image": "",
                    "index": 1,
                    "_rev": "1-22949e65aa1490b9e8d2d2014647eeca",
                    "tables": ["Table::76e6e4ea-7d00-4999-a75d-aeb46ffe5702", "Table::6f5e484d-8e4f-41e6-9c68-40fc728e4eb0"]
                }
            ],
            "new_edits": true
        };
        client.database.post_db_bulk_docs({
            db: config.couchbase.sync_db,
            BulkDocsBody: body
        }).then(function (userRes) {
            res.json(userRes);
        }).catch(function (err) {
            console.log(err);
            res.send("error");
        });
    });


    app.get("/api/bulk", function (req, res) {
        const body = {
            "docs": [
                {
                    "_id": "User::dalborgo",
                    "_rev": "9-9e2b0815883fba686cd4a1c5af98a531",
                }
            ],
            "new_edits": true
        };
        client.database.post_db_bulk_docs({
            db: config.couchbase.sync_db,
            BulkDocsBody: body
        }).then(function (userRes) {
            console.log(body2);
            res.json(userRes);
        }).catch(function (err) {
            console.log(err);
            res.send("error");
        });
    });


    app.get("/api/put", function (req, res) {
        client.document.put_db_doc({
            db: config.couchbase.sync_db, doc: "User::dalborgo", Document: {
                "key": "value444",
                "type": "foobar"
            }, rev: "8-14e00f2f1059bca2d82cc65e2d8f03f5", new_edits: true
        }).then(function (userRes) {
            res.send(userRes)
        })
            .catch(function (err) {
                console.log(err)
            });
    });

    app.get("/api/sync/table/bulk_get", function (req, res) {
        let body = {
            "docs": [
                {
                    "id": "User::dalborgo"
                }
            ]
        };
        client.database.post_db_bulk_get({
            db: config.couchbase.sync_db,
            BulkGetBody: body
        }).then(function (userRes) {
            //res.send(new Buffer(userRes));
        }).catch(function (err) {
            console.log(err);
            res.send("error");
        });
    });

    app.get("/api/sync/table/image", function (req, res) {
        let body = {
            "docs": [
                {
                    "id": "User::dalborgo"
                }
            ]
        };
        client.attachment.get_db_doc_attachment({
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

    app.get("/api/sync/user/create", function (req, res) {
        let type = "User";
        let body = {
            "_id": type + "::dalborgo",
            "type": type,
            "name": "Marco",
            "surname": "Dal Borgo",
            "user": "dalborgo",
            "password": "12345",
            "big_image": "",
            "small_image": "",
            "role": "administrator"
        };
        client.apis.document.post({db: config.couchbase.sync_db, body: body}).then(function (userRes) {
            console.log(userRes)
        }).catch(function (err) {
            console.log(err)
        });
        res.send(body)
    });


    app.get("/api/sync/user/create_img", function (req, res) {
        let type = "User";
        let img = fs.readFileSync('./static/imgs/frak96.png');
        let base64 = img.toString('base64');
        let doc = {
            "_id": type + "::dalborgo6",
            "type": type,
            "name": "Marco5",
            "surname": "Dal Borgo",
            "user": "dalborgo5",
            "password": "12345",
            "big_image": "",
            "small_image": "",
            "role": "administrator",
            "_attachments" : {
                "big_image": {
                    "content_type": 'image\/png',
                    "data": base64
                }
            }
        };
        client.database.post_db_bulk_docs({db: config.couchbase.sync_db, BulkDocsBody: {docs: [doc]}}).then(function (userRes) {
            console.log(userRes);
        }).catch(function (err) {
            console.log(err)
        });
        res.send(doc)
    });

    app.get("/api/sync/user/read_img", function (req, res) {
        client.document.get_db_doc({db: config.couchbase.sync_db, doc: "User::dalborgo6",attachments:true}).then(function (userRes) {
            console.log(userRes);
            const img = new Buffer(userRes.obj._attachments.big_image.data, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });
            res.end(img);
            //res.send(userRes.obj._attachments.image)
        }).catch(function (err) {
            console.log(userRes)
        });
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
            "big_image": "",
            "small_image": "",
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