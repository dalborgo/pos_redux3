import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Basic from './Router.jsx';
import configureStore from './configureStore';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom'

const NoMatch = () => <p>Page Not Found</p>;


const App = (props) => (
    <div>
        <div className="container-fluid">
            {props.children}
            <hr />
            <h5><small>
                Full source code available at this <a href="https://github.com/vasansr/pro-mern-stack">
                GitHub repository</a>.
            </small></h5>
        </div>
    </div>
);


const contentNode = document.getElementById('contents');
const store = configureStore();
ReactDOM.render(
    <Provider store={store}>
        <Basic/>
    </Provider>
    , contentNode);    // Render the component inside the content Node

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
        const nextRootReducer = require('./reducers/index');
        store.replaceReducer(nextRootReducer);
    });
}
