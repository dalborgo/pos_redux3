import React, { PropTypes } from 'react';
//import PropTypes from 'prop-types';
import VisibleTodoList from './Redux'

const Rest = (props) => (
    <div>
      <VisibleTodoList/>
    </div>
);

Rest.propTypes = {
    params: PropTypes.shape({
        filter: PropTypes.string,
    }),
};

export default Rest;
