const config = require('../../config/config');
import uniq from 'lodash/fp/uniq'
import compose from 'lodash/fp/compose'
import map from 'lodash/fp/map'
import {normalize, schema} from 'normalizr';
import md5 from 'md5'

const csv = require('csv-parser')
const fs = require('fs')
const url = `http://${config.couchbase.sync_server_admin}/${config.couchbase.sync_db}`;

function elabora(inp) {
    const comp = compose(
        uniq,
        map('stanza'),
    );
    let o = comp(inp).reduce(function (result, value) {
        result[value] = new schema.Entity(value, undefined, {idAttribute: 'tavolo'})
        return result;
    }, {});

    const myArray = new schema.Array(o, (input, parent, key) => input.stanza);

    const normalizedData = normalize(inp, myArray);

    //console.log(JSON.stringify(normalizedData, null, 2))
    let ne = normalizedData.entities, docs = []
    for (let e in ne) {
        let idr = `ROOM_${e}::${md5(e)}`
        let tables = [], index = 0
        for (let table in ne[e]) {
            index++
            let idt = `TABLE_${table}::${md5(table)}`
            tables.push({table: idt, index})
            let b = ne[e][table]
            let t = {
                _id: idt,
                display: table,
                room: b.stanza,
                colore: b.colore || null,
                rgb: [0, 0, 0],
                type: "Table"
            }
            docs.push(t)
        }
        let s = {
            _id: idr,
            display: e,
            tables,
            rgb: [0, 0, 0],
            type: "Room",
        }
        docs.push(s)
    }
    console.log(JSON.stringify(docs, null, 1))
  /*  fetch(url + '/_bulk_docs', {
        method: 'POST',
        body: JSON.stringify({docs: docs})
    }).then(res => res.json()).then(r => console.log(r))*/
}

const stream = csv({
    raw: false,
    separator: ';'
})

export default function importa() {
    let inp = []
    /*fs.createReadStream('../../static/csv/stanze.csv')
        .pipe(stream).on('data', function (data) {
        inp.push(data)
    }).on('end', function () {
    })*/
        elabora([{stanza:"ciao",tavolo:"miao"}]);
}
