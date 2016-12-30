import React, {Component} from 'react';
import {
    Form,
    FormGroup,
    Col,
    FormControl,
    Checkbox,
    Button,
    ControlLabel,
    Modal
} from 'react-bootstrap';
import './LoginDialog.css';

import UsersStore from './Stores/Users';

class LoginDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            remember: false
        };
    }

    onLogin = (event) => {
        const username = this.state.username.toLowerCase();
        const {password, remember} = this.state;
        UsersStore.loginUser(username, password, remember).then((loginAction) => {
            if (loginAction.success) {
                localStorage.role = loginAction.role;
                localStorage.username = username;
                if (location.state && location.state.nextPathname) {
                    this.props.router.replace(location.state.nextPathname);
                } else {
                    this.props.router.replace('/');
                }
            }
        });
    }

    onChange = (valueName) => {
        return (event) => {
            const {value} = event.target;
            this.setState({[valueName]: value});
        }
    }

    onChangeCheckbox = (valueName) => {
        return (event) => {
            let {checked} = event.target;
            this.setState({[valueName]: checked});
        }
    }

    render() {
        return (
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title style={{
                        textAlign: 'center'
                    }}>Welcome back!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form horizontal>
                        <FormGroup controlId="formHorizontalEmail">
                            <Col componentClass={ControlLabel} sm={2}>
                                Login
                            </Col>
                            <Col sm={10}>
                                <FormControl type="text" placeholder="Login" value={this.state.username} onChange={this.onChange('username')}/>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formHorizontalPassword">
                            <Col componentClass={ControlLabel} sm={2}>
                                Password
                            </Col>
                            <Col sm={10}>
                                <FormControl type="password" placeholder="Password" value={this.state.password} onChange={this.onChange('password')}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Checkbox checked={this.state.remember} onChange={this.onChangeCheckbox('remember')}>Remember me</Checkbox>
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onLogin}>Sign in</Button>
                </Modal.Footer>

            </Modal.Dialog>

        );

    }
}

export default LoginDialog;
