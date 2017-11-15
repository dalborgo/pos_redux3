import { combineReducers } from 'redux';
import createList, * as fromList from './createList';
/*const listByFilter = combineReducers({
    all: createList()
});*/

const todos = combineReducers({
    createList
});

export default todos;

export const getVisibleTodos = (state, filter) => fromList.getIds(state);