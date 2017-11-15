import React from 'react';
//import 'whatwg-fetch';
import {v4} from 'uuid';
import Swagger from 'swagger-client';
import config from '../config/config.json';
import request from 'request';
import GridListExampleSingleLine from './GridListExampleSingleLine.jsx';
//import spec from '../static/sg/sync-gateway-public-1-4_public.json';
import {Nav, NavItem} from 'react-bootstrap';
import api from './api'

const a = new api();
const poll = {
    longpoll: function (that) {
        function getChanges(seq) {
            console.log('seq %s', seq);
            let url = `http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}`;
            console.log('Attesa tavoli');
            fetch(url + `/_changes?include_docs=true&feed=longpoll&filter=sync_gateway/bychannel&channels=tables,rooms&limit=1&since=${seq}`, {})
                .then((res) => res.json())
                .then((res) => {
                    let m = res.results;
                    console.log('Tavoli ' + m.length);
                    if (m.length > 0) {
                        console.log('CARICA2');
                        that.loadData(false);
                        getChanges(res.last_seq);
                    }
                });
        }

        a.get_var('_sync:seq').then(res => {
            getChanges(res.value)
        });
    },
    longpoll2: function (that) {
        const sync_gateway_url = `http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}/`;
        getChanges(0);

        function getChanges(seq) {
            console.log('seq %s', seq)
            const querystring = 'feed=normal&filter=sync_gateway/bychannel&channels=Tables&timeout=0&since=' + seq;
            const options = {
                url: sync_gateway_url + '_changes?' + querystring
            };
            request(options, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    const json = JSON.parse(body);
                    let m = json.results;
                    //let res2 = m.map((row) => row);
                    console.log('Tavoli ' + m.length);
                    if (m.length > 0)
                        that.loadData();
                    getChanges(json.last_seq);
                }
            });
        }
    }
};

//spec.host = config.couchbase.sync_server;


const Table = (props) => (
    <div>
        <img src={`http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}/${props.tables.id}/`+(props.tables.value.order)?'tavolo_pieno_100':'tavolo_vuoto_100'}/><br/>{props.tables.value.order}
    </div>
);

function Container(props) {
    let Tables = props.tables.map(tab => <Table key={tab.id} tables={tab}/>);
    return (
        <div>{Tables}</div>
    );
}

function Rooms(props) {
    let r = props.righe.map(tab => <NavItem eventKey={tab.id} key={tab.id}>{tab.key}</NavItem>);
    return (
        <Nav bsStyle="pills" activeKey={props.activeKey} onSelect={props.onSelect}>
            {r}
        </Nav>
    );
}

export default class IssueList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tables: [],
            rooms: [],
            room: this.props.setDefault()
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentWillMount() {
        console.log('CARICA');
        poll.longpoll(this);
        this.loadData('');
    }

    loadData(stale) {
        a.getView('rooms', 'all', stale).then(
            (res) => {
                let stanze = res.rows;
                this.setState({rooms: stanze});
            }
        );
        a.getView('tables', 'all', stale).then(
            (res) => {
                let s = res.rows.filter(t => t.value.Room === this.state.room)
                this.setState({tables: s});
            }
        )
    }

    loadData2(stale) {
        let url = '/api/sync/get/tables';
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({stale: stale})
        }).then(response => {
            if (response.ok) {
                response.json().then(val => {
                    //console.log(val.obj.rows);
                    let s = val.obj.rows.filter(t => t.value.Room === this.state.room)
                    this.setState({tables: s});
                });
            } else {
                response.json().then(error => {
                    alert("Failed to add issue: " + error.message)
                });
            }
        }).catch(err => {
            alert("Error in sending data to server: " + err.message);
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let form = document.forms.issueAdd;
        this.createIssue({
            user: form.user.value,
            password: form.password.value
        });
        form.user.value = "";
        form.password.value = "";
    }

    handleSelect(selectedKey) {
        let st = Object.assign({}, this.state);
        st.room = selectedKey;
        this.setState(st);
        this.loadData('');
    }

    render() {
        return (
            <div>
                <Rooms righe={this.state.rooms} activeKey={this.state.room} onSelect={this.handleSelect}/>
                <br/>
                <br/>
                {/*<Container tables={this.state.tables}/>*/}
                <GridListExampleSingleLine tables={this.state.tables}/>
            </div>

        );
    }
}