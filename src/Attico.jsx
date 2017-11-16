import React from 'react';
//import 'whatwg-fetch';
import {v4} from 'uuid';
import Swagger from 'swagger-client';
import config from '../config/config.json';
import request from 'request';
import GridListExampleSingleLine from './GridListExampleSingleLine.jsx';

let moment = require('moment')
moment.locale('it');

//import spec from '../static/sg/sync-gateway-public-1-4_public.json';

import {Nav, NavItem, Grid, Row, Col, Thumbnail, Button} from 'react-bootstrap';


import api from './api'

const a = new api();
const poll = {
    longpoll: function (that) {
        function getChanges(seq) {
            console.log('seq %s', seq);
            let url = `http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}`;
            console.log('Attesa tavoli');
            fetch(url + `/_changes?include_docs=true&feed=longpoll&filter=sync_gateway/bychannel&channels=tables,orders&limit=1&since=${seq}`, {})
                .then((res) => res.json())
                .then((res) => {
                    let m = res.results;
                    console.log('Tavoli ' + m.length);
                    if (m.length > 0) {
                        console.log('CARICA2');
                        that.loadData(false);

                    }
                    getChanges(res.last_seq);
                });
        }

        a.get_var('_sync:seq').then(res => {
            getChanges(res.value)
        });
    }
};

//spec.host = config.couchbase.sync_server;


const Table = (props) => (
    <div>
        <img
            src={`http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}/${props.tables.id}/` + (props.tables.value.order) ? 'tavolo_pieno_100' : 'tavolo_vuoto_100'}/><br/>{props.tables.value.order}
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

const Row2 = (props) => {
    let tot = props.entries.reduce((a, b) => a[0] * a[1] + b[0] * b[1]);
    const now = moment().format('YYYYMMDDHHmmss')
    const then = props.creating_date;
    const diff = moment.utc(moment(now, "YYYYMMDDHHmmss").diff(moment(then, "YYYYMMDDHHmmss"))).format("HH:mm:ss")
    return (<Row>
        <Col xs={6} md={4}>
            <Thumbnail src="/svg/tab_pieno.svg" alt="200x200">
                <h4>{props.display}</h4>
                <p>Tot: &euro; {tot / 1000}</p>
                <p>Tempo: {diff}</p>
            </Thumbnail>
        </Col>
    </Row>)
};

function Thumb(props) {

    let Tables = props.tables.map(tab => <Row2 {...tab} key={tab.id}/>);
    return (
        <Grid>
            {Tables}
        </Grid>
    )
}

export default class IssueList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tables: [],
            rooms: []
        };
        this.tick = this.tick.bind(this);
    }
    tick() {
        this.forceUpdate()
    }
    componentWillMount() {
        console.log('CARICA');
        poll.longpoll(this);
        this.loadData('');
    }

    componentDidMount() {
        this.interval = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    loadData(stale) {

        a.getTableOrder().then(r => {
            console.log(r)
            this.setState({tables: r});
        })
    }


    render() {
        return (
            <div>
                <Thumb tables={this.state.tables}/>
            </div>

        );
    }
}