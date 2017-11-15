import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
//import Swagger from 'swagger-client';
import config from '../config/config.json';
/*import spec from '../static/sg/sync-gateway-public-1-4_admin.json';
spec.host = config.couchbase.sync_server_admin;*/
import api from './api'
const a = new api();
import 'whatwg-fetch';

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        display: 'flex',
        flexWrap: 'nowrap',
        //width: '100%'
        //overflowX: 'auto'
    },
    titleStyle: {
        color: 'white',

    },
    gridTile: {
        border: 'solid 1px lightgray',
        borderRadius: '20px',
        width: '200px',
        height: '200px'
    }
};


function GridListExampleSingleLine(props) {
    function carica(id) {

        a.getDoc(id).then(
            (res)=> {
                a.deleteDoc(res);
                a.removeTableFromRoom(res.Room, res._id);
            })
       /* let url = `http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}`;
        fetch(url + '/' + id, {})
            .then((res) => res.json())
            .then((res) => {
                let {_rev} = res;
                console.log(_rev);

            });*/
    }

    let tilesData = props.tables;

    function tav(p) {
        return (p)?'tavolo_pieno_100':'tavolo_vuoto_100'
    }

    return (
        <div style={styles.root}>
            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <GridList style={styles.gridList} cellHeight={'auto'}>
                    {tilesData.map((tile) => (
                        <GridTile
                            key={tile.id}
                            title={tile.value.display}
                            actionIcon={<IconButton onClick={() => carica(tile.id)}><StarBorder
                                color="white"/></IconButton>}
                            titleStyle={styles.titleStyle}
                            titleBackground="linear-gradient(to top, rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                            style={styles.gridTile}
                        >
                            <img
                                src={`http://${config.couchbase.sync_server_public}/${config.couchbase.sync_db}/${tile.id}/`+tav(tile.value.order)}/>
                        </GridTile>
                    ))}
                </GridList>
            </MuiThemeProvider>
        </div>
    )
}

export default GridListExampleSingleLine;