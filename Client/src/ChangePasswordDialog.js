import React, {Component} from 'react';
import {
    Modal,
    Col,
    Button,
    Form,
    FormGroup,
    FormControl,
    ButtonToolbar,
    ControlLabel
} from 'react-bootstrap';

class ChangePasswordDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentpassword: '',
            newpassword: '',
            confirmpassword: ''
        };

    }

    onChange = (valueName) => {
        return (event) => {
            const {value} = event.target;
            this.setState({[valueName]: value});
        }
    }

    onConfirm = _ => {
        if (this.props.onConfirm) {
            this.props.onConfirm(this.state);
        }
    }

    onCancel = _ => {
        if (this.props.onCancel) {
            this.props.onCancel(this.state);
        }
    }

    render() {
        return (
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title style={{
                        textAlign: 'center'
                    }}>Change password</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form horizontal>
                        {this.props.current && <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Current password
                            </Col>
                            <Col sm={9}>
                                <FormControl type="password" placeholder="Current" value={this.state.currentpassword} onChange={this.onChange('currentpassword')}/>
                            </Col>
                        </FormGroup>}
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                New password
                            </Col>
                            <Col sm={9}>
                                <FormControl type="password" placeholder="Password" value={this.state.newpassword} onChange={this.onChange('newpassword')}/>
                            </Col>
                        </FormGroup>
                        {this.props.confirm && <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Confirm password
                            </Col>
                            <Col sm={9}>
                                <FormControl type="password" placeholder="Confirm" value={this.state.confirmpassword} onChange={this.onChange('confirmpassword')}/>
                            </Col>
                        </FormGroup>}
                        <FormGroup>
                            <Col smOffset={3} sm={9}>
                                <ButtonToolbar>
                                    <Button onClick={this.onConfirm} disabled={!(this.state.newpassword && (!this.props.confirm || (this.state.newpassword === this.state.confirmpassword)))}>Change</Button>
                                    <Button onClick={this.onCancel}>Cancel</Button>
                                </ButtonToolbar>
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
            </Modal.Dialog>
        );
    }
}

ChangePasswordDialog.propTypes = {
    current: React.PropTypes.bool,
    confirm: React.PropTypes.bool,
    onConfirm: React.PropTypes.func,
    onCancel: React.PropTypes.func,
};

export default ChangePasswordDialog;
