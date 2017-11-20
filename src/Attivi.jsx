import React from 'react';
//import 'whatwg-fetch';
import {v4} from 'uuid';
//import Swagger from 'swagger-client';
import config from '../config/config.json';
//import request from 'request';
import GridListExampleSingleLine from './GridListExampleSingleLine.jsx';

let moment = require('moment')
moment.locale('it');

//import spec from '../static/sg/sync-gateway-public-1-4_public.json';

import {Nav, NavItem, Grid, Row, Col, Thumbnail, Button} from 'react-bootstrap';


import api from './api'

const a = new api();

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
    //let tot = props.entries.reduce((a, b) => a[0] * a[1] + b[0] * b[1]);
    let tot = props.entries.reduce(function(a, b) {
        return a + b[0]*b[1];
    },0);
    const now = moment().format('YYYYMMDDHHmmss')
    const then = props.creating_date;
    const diff = moment.utc(moment(now, "YYYYMMDDHHmmss").diff(moment(then, "YYYYMMDDHHmmss"))).format("HH:mm")
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
    try{
        let Tables = props.tables.map(tab => <Row2 {...tab} key={tab.id}/>);
        return (
            <Grid>
                {Tables}
            </Grid>
        )
    }
    catch(err){
        return(<div></div>)
    }
}

export default class IssueList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tables: [],
            rooms: []
        };
        this.stopPolling = false
        this.tick = this.tick.bind(this);
    }

    tick() {
        this.forceUpdate()
    }

    componentWillMount() {

    }

    longpoll(that) {
        function getChanges(seq) {
            if (that.stopPolling)
                return
            console.log('seq %s', seq);
            let url = `http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}`;
            console.log('Attesa tavoli attivi...');
            fetch(url + `/_changes?include_docs=true&feed=longpoll&filter=sync_gateway/bychannel&channels=tables,orders&limit=1&since=${seq}`, {})
                .then((res) => res.json())
                .then((res) => {
                    if (that.stopPolling)
                        return
                    let m = res.results;
                    console.log('Tavoli attivi trovati ' + m.length);
                    if (m.length > 0) {
                        console.log('Carica...');
                        that.loadData(false);

                    }
                    getChanges(res.last_seq);
                    //clearTimeout(that.timer);
                });
        }

     /*   a.get_var().then(res => {
            getChanges(res)
        });*/
    }

    componentDidMount() {
        console.log('CARICA');
        this.longpoll(this);
        this.loadData('');
        this.interval = setInterval(this.tick, 60000);
    }

    componentWillUnmount() {
        this.stopPolling = true
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