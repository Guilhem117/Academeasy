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
import './LoginDialog.css'

class LoginDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loginData: {
                username: '',
                password: ''
            }
        };
    }

    onLogin = (event) => {
        localStorage.profile = this.state.loginData;
        if (location.state && location.state.nextPathname) {
            this.props.router.replace(location.state.nextPathname)
        } else {
            this.props.router.replace('/')
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
                                <FormControl type="text" placeholder="Login"/>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formHorizontalPassword">
                            <Col componentClass={ControlLabel} sm={2}>
                                Password
                            </Col>
                            <Col sm={10}>
                                <FormControl type="password" placeholder="Password"/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Checkbox>Remember me</Checkbox>
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <FormGroup>
                        <Button onClick={this.onLogin}>Sign in</Button>
                    </FormGroup>
                </Modal.Footer>

            </Modal.Dialog>

        );

    }
}

export default LoginDialog;
