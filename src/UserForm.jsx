import React from 'react'
//import 'whatwg-fetch';
import Toast from './Toast.jsx';
import {Form, FormControl, Button, ControlLabel} from 'react-bootstrap';

export default class UserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            password: '',
            toastVisible: false,
            toastMessage: '',
            toastType: 'success'
        };
        this.showSuccess = this.showSuccess.bind(this);
        this.showError = this.showError.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
        this.userInputChange = this.userInputChange.bind(this);
        this.passwordInputChange = this.passwordInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    showSuccess(message) {
        this.setState({
            toastVisible: true, toastMessage: message,
            toastType: 'success'
        });
    }

    showError(message) {
        this.setState({
            toastVisible: true, toastMessage: message,
            toastType: 'danger'
        });
    }

    dismissToast() {
        this.setState({toastVisible: false});
    }

    userInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    passwordInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    createUser(newIssue) {
        fetch('/api/sync/user/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newIssue),
        }).then(response => {
            if (response.ok) {
                response.json().then(updatedIssue => {
                    console.log(updatedIssue);
                    this.showSuccess('Updated issue successfully.');
                });
            } else {
                response.json().then(error => {
                    this.showError(`Failed to update issue: ${error.message}`);
                });
            }
        }).catch(err => {
            this.showError(`Error in sending data to server: ${err.message}`);
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.createUser({
            user: this.state.user,
            password: this.state.password
        });
        this.setState({
            user: '',
            password: ''
        });

    }

    render() {
        return (
            <Form inline name="issueAdd2" onSubmit={this.handleSubmit}>
                <ControlLabel>User</ControlLabel>
                <FormControl name="user" placeholder="User" value={this.state.user} onChange={this.userInputChange}/>
                <ControlLabel>Password</ControlLabel>
                <FormControl placeholder="Password"
                             name="password"
                             value={this.state.password}
                             onChange={this.passwordInputChange}/>


                <Button type="submit" bsStyle="primary">Send</Button>
                <Toast showing={this.state.toastVisible}
                message={this.state.toastMessage}
                onDismiss={this.dismissToast} bsStyle={this.state.toastType}
                />
            </Form>
        );
    }
}

