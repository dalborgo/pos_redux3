import React  from 'react'
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
    Link,
    browserHistory
} from 'react-router-dom'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Glyphicon, Table, Panel, Form, FormControl, Button} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import UserForm from './UserForm.jsx'
import IssueAddNavItem from './IssueAddNavItem.jsx'
import Room from './Room.jsx';
import Attico from './Attico.jsx';
import Redux from './components/Redux.jsx';
const NoMatch = () => <p>Page Not Found</p>;

const Header = () => (
    <Navbar fluid>
        <Navbar.Header>
            <Navbar.Brand><Link to={"./"}> <img src={"/imgs/ico.png"} width={"28%"}/> Risto Asten</Link></Navbar.Brand>
        </Navbar.Header>
        <Nav>
            <LinkContainer to="/room">
                <NavItem>Rooms</NavItem>
            </LinkContainer>
            <LinkContainer to="/vuoto">
                <NavItem>Reports</NavItem>
            </LinkContainer>
            <LinkContainer to="/redux/User::dalborgo">
                <NavItem>Redux</NavItem>
            </LinkContainer>
            <LinkContainer to="/attico">
                <NavItem>Tavoli Attivi</NavItem>
            </LinkContainer>
        </Nav>
        <Nav pullRight>
            <IssueAddNavItem />
            <NavDropdown id="user-dropdown" title={<Glyphicon glyph="option-horizontal"/>} noCaret>
                <MenuItem>Logout</MenuItem>
            </NavDropdown>
        </Nav>
    </Navbar>
);

const setDefault = (room) => {
    return (room)?room:'Room::fe276048-67f3-4cc6-94b3-c13575620e75';
}
const BasicExample = () => (
    <Router history={browserHistory}>
        <div>
            <Header/>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/room">
                    <Room setDefault={setDefault} />
                </Route>
                <Route path="/redux/:filter" component={Redux} />
                <Route path="/attico" component={Attico} />
                <Redirect from="/stanze" to="/room"/>
                <Route component={NoMatch}/>
            </Switch>
        </div>
    </Router>
);

const Home = () => (
    <div>
        <UserForm/>
        <Panel collapsible header="Panel">
            <h2>Home</h2>
        </Panel>
        <Table bordered condensed hover responsive>
            <thead>
            <tr>
                <th>Id</th>
                <th>Status</th>
                <th>Owner</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>ciao</td>
                <td>miao</td>
                <td>bau</td>
            </tr>
            <tr>
                <td>ciao</td>
                <td>miao</td>
                <td>bau</td>
            </tr>
            </tbody>
        </Table>
    </div>
);


export default BasicExample