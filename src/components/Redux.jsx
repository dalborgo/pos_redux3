import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as actions from '../actions';
import {getVisibleTodos} from '../reducers';
import {Link} from 'react-router-dom';

//import TodoList from './TodoList';

class VisibleTodoList extends Component {
    componentDidMount() {
        this.fetchData();
        //  console.log(this.props)
    }

    componentDidUpdate(prevProps) {
        if (this.props.filter !== prevProps.filter) {
            this.fetchData();
        }
    }

    fetchData() {
        const {filter, fetchTodos} = this.props;
        console.log(filter)
        fetchTodos(filter);
    }

    render() {
        console.log(this.props)
        const {active} = this.props;
        return (

            <div>
                <Link to="User::repele">Paolo</Link><br/>
                <Link to="User::dalborgo">Borgo</Link><br/>
                <span>{active.createList[0]}</span>
            </div>

        );
    }
}

VisibleTodoList.propTypes = {

    fetchTodos: PropTypes.func.isRequired
};


const mapStateToProps = (state, props) => {
    const filter = props.match.params.filter || 'User:dalborgo'

    return {
        /* todos: getVisibleTodos(state, filter),*/
        filter,
        active: getVisibleTodos(state, filter)
    };
};

VisibleTodoList = withRouter(connect(
    mapStateToProps,
    actions
)(VisibleTodoList));

export default VisibleTodoList;
