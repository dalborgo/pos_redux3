import config from '../config/config.json';
export default class Feed {
    constructor(seq, callback) {
        this.url = `http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}`
        this.timeout = config.timeout
        this.getChanges(seq, callback);
    }
    getChanges(seq, callback) {
        fetch(`${this.url}/_changes?include_docs=true&feed=longpoll&filter=sync_gateway/bychannel&channels=tables,orders&timeout=${this.timeout}&limit=1&since=${seq}`, {})
            .then((res) => res.json())
            .then((res) => {
                if (!this.stopped) {
                    callback();
                    this.getChanges(res.last_seq, callback);
                }
            })
    }
    stop() {
        this.stopped = true;
    }
}