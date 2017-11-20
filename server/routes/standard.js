/*var bcrypt = require("bcryptjs");
var UserModel = require("../models/user");*/
import {bucket, N1qlQuery} from "../server";
import Stampante from "../../models/printer"

const appRouter = function (app) {
    app.get("/api/sync/table/multi", function (req, res) {
        bucket.getMulti(['Table::0dbae660-79cb-4a58-bf09-e4d751cc4536', 'Table::6f5e484d-8e4f-41e6-9c68-40fc728e4eb0'], function (errors, results) {
            if (errors > 0) {
                res.writeHead(500);
                res.end();
            } else {
                const rants = [];
                for (let i in results) {
                    const result = results[i];
                    if (result.value)
                        rants.push(result.value);
                }
                res.json(rants); // write the rants array to the response
            }

        });
    });


    app.post("/api/set/var", function (req, res) {

    });
    app.post("/api/get/var", function (req, res) {
        bucket.get(req.body.variable, function (err, r) {
            res.send(r)
        })
    });
    app.get("/api/get/query", function (req, res) {
        let q = "SELECT meta(table).id id, table.`order`,table.display, `order`[0].creating_date, ARRAY [r.product_price,r.product_qta] FOR r in `order`[0].entries END entries FROM afame table NEST afame `order` ON KEYS table.`order` WHERE table.type= 'Table' AND table.Room = 'Room::fe276048-67f3-4cc6-94b3-c13575620e75' AND meta(table).id NOT LIKE \"_sync%\"";
        const query = N1qlQuery.fromString(q);
        bucket.query(query, function (err, prn) {
            res.json(prn)
        });

    });

    app.get("/api/get/vista", function (req, res2) {
        fetch('http://10.0.2.28:4984/afame/_design/tables/_view/all?include_docs=true&stale=', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res2.send(res.json()));
    });
    app.post("/api/stampante/create", function (req, res) {
        const m = new Stampante({
            name: req.body.name,
            ip: req.body.ip,
            categories: req.body.category
        });
        m.save(function (error, result) {
            if (error) {
                return res.status(400).send(error);
            }
            res.send(m);
        });
    });

};

module.exports = appRouter;