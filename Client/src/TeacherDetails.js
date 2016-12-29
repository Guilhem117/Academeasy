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

        this.state = {
            teacher: {},
            courses: []
        };

    }

    componentWillMount = () => {
        const {teacherId} = this.props.params;
        if (teacherId !== 'new') {
            TeachersStore.getTeacher(teacherId).then((teacher) => {
                this.setState({teacher});
            });
        }

        CoursesStore.getCourses().then((courses) => {
            this.setState({
                courses: courses.map((course) => {
                    return {label: course.label, value: course.code};
                })
            });
        });

    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.params.teacherId !== nextProps.params.teacherId) {
            const {teacherId} = this.props.params;
            if (teacherId !== 'new') {
                TeachersStore.getTeachers(teacherId).then((teacher) => {
                    this.setState({teacher});
                });
            }
        }

    }

    onChangeCourses = (courses) => {
        const coursesValues = courses.map((course) => course.value);
        this.setState((prevState, props) => {
            const teacher = prevState.teacher;
            teacher.courses = coursesValues;
            return {teacher};
        });
    }

    onChange = (valueName) => {
        return (event) => {
            const {value} = event.target;
            this.setState((prevState, props) => {
                const teacher = prevState.teacher;
                teacher[valueName] = value;
                return {teacher};
            });
        }
    }

    onUpdate = () => {
        const {teacherId} = this.props.params;
        if (teacherId === 'new') {
            TeachersStore.addTeacher(this.state.teacher).then((teacher) => {
                this.props.router.push('/teachers');
            });
        } else {
            TeachersStore.updateTeacher(this.state.teacher).then((teacher) => {
                this.props.router.push('/teachers');
            });
        }
    }

    sendPassword = () => {
        if (this.props.onSendPassword) {
            this.props.onSendPassword(this.state);
        }
    }

    render() {
        const {teacherId} = this.props.params;

        return (
            <Grid className="table-background">
                <Panel header={this.state.teacher.username
                    ? `Teacher ${this.state.teacher.username}`
                    : 'New teacher'}></Panel>

                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Login</Col>
                        <Col sm={10}>
                            <FormControl type="text" onChange={this.onChange('username')} value={this.state.teacher.username || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Courses</Col>
                        <Col sm={10}>
                            <Select multi options={this.state.courses} value={this.state.teacher.courses || []} onChange={this.onChangeCourses}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>First Name</Col>
                        <Col sm={10}>
                            <FormControl type="text" onChange={this.onChange('firstName')} value={this.state.teacher.firstName || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Last Name</Col>
                        <Col sm={10}>
                            <FormControl type="text" onChange={this.onChange('lastName')} value={this.state.teacher.lastName || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Email</Col>
                        <Col sm={10}>
                            <FormControl type="email" onChange={this.onChange('email')} value={this.state.teacher.email || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <ButtonToolbar>
                                <Button onClick={this.onUpdate} disabled={!this.state.teacher.username}>{teacherId === 'new'
                                        ? 'Add'
                                        : 'Update'}</Button>
                                <Button onClick={this.sendPassword} disabled={!this.state.teacher.email}>Send Password</Button>
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
