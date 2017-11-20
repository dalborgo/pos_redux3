import React from 'react';
import {v4} from 'uuid';
import config from '../config/config.json';
import _ from 'underscore'
let moment = require('moment')
moment.locale('it');
import {Nav, NavItem, Grid, Row, Col, Thumbnail, Button} from 'react-bootstrap';
import Feed from './feed'
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
    if (props.order) {
        console.log(props.order.doc.entries)
        let tot = props.order.doc.entries.reduce(function (a, b) {
            return a + b.product_price * b.product_qta;
        }, 0);
        console.log(tot)
        const now = moment().format('YYYYMMDDHHmmss')
        const then = props.order.doc.creating_date;
        const diff = moment.utc(moment(now, "YYYYMMDDHHmmss").diff(moment(then, "YYYYMMDDHHmmss"))).format("HH:mm")
        return (
            <Col xs={6} md={4}>
                <Thumbnail src="/svg/tab_pieno.svg" alt="200x200">
                    <span style={{fontWeight: 'bold'}}>{props.table.value.display}</span>
                    <span style={{float: 'right'}}>{`Coperti: ${props.order.doc.coperti}`}</span><br/>
                    <span>Tot: &euro; {tot / 1000}</span>
                    <span style={{float: 'right'}}>Tempo: {diff}</span>
                </Thumbnail>
            </Col>
        )
    } else {
        return (
            <Col xs={6} md={4}>
                <Thumbnail src="/svg/tab_vuoto.svg" alt="200x200">
                    <p style={{fontWeight: 'bold', textAlign: 'center'}}>{props.table.value.display}</p>
                </Thumbnail>
            </Col>
        )
    }
};

function Thumb(props) {

    let Tables = props.tables.map(tab => <Row2 {...tab} key={tab.table.id}/>);
    return (
        <Grid>
            <Row>
                {Tables}
            </Row>
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
        this.url = `http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}`;
        this.tick = this.tick.bind(this);
    }

    tick() {
        this.forceUpdate()
    }
    componentWillMount() {
    }
    componentDidMount() {
        a.get_db().then(res => {
            this.loadData(false);
            this.feed = new Feed(res.update_seq, () => {
                this.loadData(false);
            });
        });
        this.interval = setInterval(this.tick, 60000);
    }

    componentWillUnmount() {
        this.feed.stop();
        console.log('unmount')
        clearInterval(this.interval);
    }

    loadData(stale) {
        let o = []
        a.getView('tables', 'all', stale).then(
            (res) => {
                let s = res.rows.filter(t => t.value.Room === 'Room::fe276048-67f3-4cc6-94b3-c13575620e75')
                let ids = s.map(a => a.value.order);
                ids = _.compact(ids)

                console.log(ids)
                a.getAllDocs(ids).then(r => {
                    s.forEach(h => {
                        console.log(r.rows)
                        let y = _.find(r.rows, function (n) {
                            try {
                                return h.id === n.doc.table
                            } catch (err) {
                                return undefined
                            }
                        })
                        o.push({
                            table: h,
                            order: y
                        })
                    })
                    console.log(o)
                    this.setState({tables: o});
                })
            }
        )
    }

    render() {
        return (
            <div>
                <Thumb tables={this.state.tables}/>
            </div>
        );
    }
}