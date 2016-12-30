import React, {Component} from 'react';
import {
    Grid,
    Row,
    Col,
    Panel,
    Form,
    ButtonToolbar,
    Button,
    FormGroup,
    ControlLabel,
    FormControl,
    Thumbnail
} from 'react-bootstrap';
import ChangePasswordDialog from './ChangePasswordDialog';
import StudentsStore from './Stores/Students';
import TeachersStore from './Stores/Teachers';

class ProfileDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: {},
            displayPasswordDialog: false
        };

    }

    componentWillMount = () => {
        const {role, username} = sessionStorage;
        switch (role) {
            case 'student':
                StudentsStore.getStudent(username).then((student) => {
                    this.setState({profile: student});
                });
                break;
            case 'teacher':
                TeachersStore.getTeacher(username).then((teacher) => {
                    this.setState({profile: teacher});
                });
                break;
        }
    }

    onChange = (valueName) => {
        return (event) => {
            const {value} = event.target;
            this.setState((prevState, props) => {
                const {profile} = prevState;
                profile[valueName] = value;
                return {profile};
            });
        }
    }

    onChangeAvatar = (event) => {
        const [file] = event.target.files;
        if (file) {
            if (!/^image\//.test(file.type)) {
                event.target.value = null;
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const {result} = e.target;
                this.setState((prevState, props) => {
                    const {profile} = prevState;
                    profile.avatar = result;
                    return {profile};
                });
            };
            reader.readAsDataURL(file);
        }
    }

    onChangePassword = _ => {
        this.setState({displayPasswordDialog: true});
    }

    onChangePasswordConfirm = (form) => {
        const {currentpassword, newpassword} = form;
        const {username} = sessionStorage;
        StudentsStore.changePassword(username, newpassword, currentpassword).then(_ => {
            this.setState({displayPasswordDialog: false});
        });
    }

    onChangePasswordCancel = _ => {
        this.setState({displayPasswordDialog: false});
    }

    onUpdate = _ => {
        const {role} = sessionStorage;
        switch (role) {
            case 'student':
                StudentsStore.updateStudent(this.state.profile).then(_ => {});
                break;
            case 'teacher':
                TeachersStore.updateTeacher(this.state.profile).then(_ => {});
                break;
        }
    }

    render() {
        return (
            <Grid className="table-background">
                {this.state.displayPasswordDialog && <ChangePasswordDialog confirm current onCancel={this.onChangePasswordCancel} onConfirm={this.onChangePasswordConfirm}/>}
                <Panel header="My profile">
                    <Row>
                        <Col md={8}>
                            <Form horizontal>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={3}>Username</Col>
                                    <Col sm={8}>
                                        <FormControl type="text" onChange={this.onChange('username')} value={this.state.profile.username || ''}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={3}>First Name</Col>
                                    <Col sm={8}>
                                        <FormControl type="text" onChange={this.onChange('firstName')} value={this.state.profile.firstName || ''}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={3}>Last Name</Col>
                                    <Col sm={8}>
                                        <FormControl type="text" onChange={this.onChange('lastName')} value={this.state.profile.lastName || ''}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={3}>Email</Col>
                                    <Col sm={8}>
                                        <FormControl type="email" onChange={this.onChange('email')} value={this.state.profile.email || ''}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col smOffset={3} sm={8}>
                                        <ButtonToolbar>
                                            <Button onClick={this.onUpdate}>Update</Button>
                                            <Button onClick={this.onChangePassword}>Change password</Button>
                                        </ButtonToolbar>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col md={4}>
                            <Thumbnail src={this.state.profile.avatar || '/student.png'}>
                                <p className="text-center">
                                    <FormControl type="file" onChange={this.onChangeAvatar}/>
                                </p>
                            </Thumbnail>
                        </Col>
                    </Row>
                </Panel>
            </Grid>
        );
    }
}

export default ProfileDetails;
