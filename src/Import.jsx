import React, {Component} from 'react';
import PropTypes from 'prop-types';
import importa from './codes/import_tables.js'

class Import extends Component {

    constructor(props, context) {
        super(props, context);
    }

    vai(){
        importa()
    }

    render() {
        return (
            <div><button onClick={()=>this.vai()}>Importa</button></div>
        );
    }
}

Import.propTypes = {};
Import.defaultProps = {};

export default Import;
