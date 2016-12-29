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

import StudentsStore from './Stores/Students';

class ProfileDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            student: {}
        };

    }

    componentWillMount = () => {
        const {username} = localStorage;
        StudentsStore.getStudent(username).then((student) => {
            this.setState({student});
        });

    }

    onChange = (valueName) => {
        return (event) => {
            const {value} = event.target;
            this.setState((prevState, props) => {
                const student = prevState.student;
                student[valueName] = value;
                return {student};
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
                    const {student} = prevState;
                    student.avatar = result;
                    return {student};
                });
            };
            reader.readAsDataURL(file);
        }
    }

    onUpdate = _ => {
        StudentsStore.updateStudent(this.state.student).then(_ => {});
    }

    render() {
        return (
            <Grid className="table-background">
                <Panel header="My profile">
                    <Row>
                        <Col md={8}>
                            <Form horizontal>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={3}>Username</Col>
                                    <Col sm={8}>
                                        <FormControl type="text" onChange={this.onChange('username')} value={this.state.student.username || ''}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={3}>First Name</Col>
                                    <Col sm={8}>
                                        <FormControl type="text" onChange={this.onChange('firstName')} value={this.state.student.firstName || ''}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={3}>Last Name</Col>
                                    <Col sm={8}>
                                        <FormControl type="text" onChange={this.onChange('lastName')} value={this.state.student.lastName || ''}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={3}>Email</Col>
                                    <Col sm={8}>
                                        <FormControl type="email" onChange={this.onChange('email')} value={this.state.student.email || ''}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col smOffset={3} sm={8}>
                                        <ButtonToolbar>
                                            <Button onClick={this.onUpdate}>Update</Button>
                                        </ButtonToolbar>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col md={4}>
                            <Thumbnail src={this.state.student.avatar || '/student.png'}>
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
