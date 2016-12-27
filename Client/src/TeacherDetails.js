import React, {Component} from 'react';
import {
    Grid,
    Panel,
    Form,
    Col,
    ButtonToolbar,
    Button,
    FormGroup,
    ControlLabel,
    FormControl
} from 'react-bootstrap';
import Select from 'react-select';

import TeachersStore from './Stores/Teachers';
import CoursesStore from './Stores/Courses';

class TeacherDetails extends Component {
    constructor(props) {
        super(props);
        const {teacherId} = this.props.params;
        this.state = TeachersStore.getTeacher(parseInt(teacherId, 10)) || {};
    }

    onChangeCourses = (courses) => {
        this.setState({
            courses: courses.map((course) => course.value)
        });
    }

    onChange = (valueName) => {
        return (event) => {
            this.setState({[valueName]: event.target.value});
        }
    }

    update = () => {
        if (this.state.id) {
            TeachersStore.updateTeacher(this.state);
        } else {
            TeachersStore.addTeacher(this.state);
        }
        this.props.router.push('/teachers');
    }

    sendPassword = () => {
        if (this.props.onSendPassword) {
            this.props.onSendPassword(this.state);
        }
    }

    render() {
        const courses = CoursesStore.getCourses().map((course) => {
            return {label: course.label, value: course.id};
        });

        return (
            <Grid className="table-background">
                <Panel header={this.state.login
                    ? `Teacher ${this.state.login}`
                    : 'New teacher'}></Panel>

                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Login</Col>
                        <Col sm={10}>
                            <FormControl type="text" onChange={this.onChange('login')} value={this.state.login || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Courses</Col>
                        <Col sm={10}>
                            <Select multi options={courses} value={this.state.courses || []} onChange={this.onChangeCourses}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>First Name</Col>
                        <Col sm={10}>
                            <FormControl type="text" onChange={this.onChange('firstName')} value={this.state.firstName || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Last Name</Col>
                        <Col sm={10}>
                            <FormControl type="text" onChange={this.onChange('lastName')} value={this.state.lastName || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Email</Col>
                        <Col sm={10}>
                            <FormControl type="email" onChange={this.onChange('email')} value={this.state.email || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <ButtonToolbar>
                                <Button onClick={this.update} disabled={!this.state.login}>{this.state.id
                                        ? 'Update'
                                        : 'Add'}</Button>
                                <Button onClick={this.sendPassword} disabled={!this.state.email}>Send Password</Button>
                            </ButtonToolbar>
                        </Col>
                    </FormGroup>
                </Form>
            </Grid>
        );
    }
}

TeacherDetails.propTypes = {
    onChange: React.PropTypes.func,
    onSendPassword: React.PropTypes.func
};

export default TeacherDetails;
