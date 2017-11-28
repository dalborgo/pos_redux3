import Swagger from 'swagger-client';
import config from '../config/config.json';
import spec from './sg/sync-gateway-admin-1-4.json';
spec.host = config.couchbase.sync_server_admin;

let client
new Swagger({
    spec: spec,
    usePromise: true
}).then(function (res) {
    client = res
})

const VIEWS = {
    views: {
        listsByName: {
            map: function (doc) {
                if (doc.type === 'Stampante') {
                    emit(doc.name, null);
                }
            }.toString()
        }
    }
};


module.exports = {
    startDatabaseOperations() {
        return client.apis.database.get__db__({db: config.couchbase.bucket})
            .then(() => {
                return client.apis.query.put__db___design__ddoc_({db: config.couchbase.bucket, ddoc: 'prova', body: VIEWS}).then(()=>'ok')
            })
            .catch(e => {
                if (e.status === 404) {
                    console.warn('Errore: database non trovato');
                }
            });
    }
}; 