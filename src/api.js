//import 'whatwg-fetch';
import config from '../config/config.json';
//import fs from 'fs';
import _ from 'underscore';
const path = require("path");
import {v4} from 'uuid';

export default class api {
    constructor() {
        this.url = `http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}`
        this.urlA = `http://${config.couchbase.sync_server_admin}/${config.couchbase.sync_db}`
    }

    getDoc(id) {
        return fetch(this.url + '/' + id, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json());
    }
    updateDoc(doc) {
        return fetch(this.url + '/' + doc._id + '?new_edits=true&rev=' + doc._rev, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doc)
        }).then(
            (res) => res.json()
        );
    }
    addTableToRoom(room_id, table_id){
        return this.getDoc(room_id).then(
            res=>{
                res.tables.push(table_id);
                this.updateDoc(res).then(
                    res=>'done'
                )
            }
        )
    }
    removeTableFromRoom(room_id, table_id){
        return this.getDoc(room_id).then(
            res=>{
                res.tables = _.without(res.tables,table_id);
                this.updateDoc(res).then(
                    res=>'done'
                )
            }
        )
    }
    deleteDoc(doc) {
        return fetch(this.url + '/' + doc._id + '?rev=' + doc._rev, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json());
    }
    createTable(doc) {
        return fetch('/api/sync/table/create', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doc)
        }).then((res) => res.json());
    }
    get_var(v){
        return fetch('/api/get/var', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({variable:v}),
        }).then((res) => res.json());
    }
    getView(ddoc, view,stale) {
        return fetch(this.url + '/_design/' + ddoc + '/_view/' + view + '?include_docs=true&stale='+stale, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json());
    }
};

