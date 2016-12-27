import React, {Component} from 'react';
import {
    Form,
    Grid,
    Panel,
    Col,
    ButtonToolbar,
    Button,
    FormGroup,
    ControlLabel,
    FormControl
} from 'react-bootstrap';
import Select from 'react-select';

import StudentsStore from './Stores/Students';
import CoursesStore from './Stores/Courses';
import YearsStore from './Stores/Years';

class StudentDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            student: {},
            courses: [],
            years: []
        };

    }

    componentWillMount = () => {
        const {studentId} = this.props.params;
        if (studentId !== 'new') {
            StudentsStore.getStudent(studentId).then((student) => {
                this.setState({student});
            });
        }

        CoursesStore.getCourses().then((courses) => {
            this.setState({
                courses: courses.map((course) => {
                    return {label: course.label, value: course.code};
                })
            });
        });

        YearsStore.getYears().then((years) => {
            this.setState({
                years: years.map((year) => {
                    return {label: year.label, value: year.code};
                })
            });
        });

    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.params.studentId !== nextProps.params.studentId) {
            const {studentId} = this.props.params;
            if (studentId !== 'new') {
                StudentsStore.getStudent(studentId).then((student) => {
                    this.setState(student);
                });
            }
        }

    }

    onChangeCourses = (courses) => {
        const coursesValues = courses.map((course) => course.value);
        this.setState((prevState, props) => {
            const student = prevState.student;
            student.courses = coursesValues;
            return {student};
        });
    }

    onChangeYear = (year) => {
        const yearValue = year
            ? year.value
            : '';
        this.setState((prevState, props) => {
            const student = prevState.student;
            student.year = yearValue;
            return {student};
        });
    }

    onChange = (valueName) => {
        return (event) => {
            const value = event.target.value;
            this.setState((prevState, props) => {
              const student = prevState.student;
              student[valueName] = value;
              return {student};
            });
        }
    }

    onUpdate = () => {
        const {studentId} = this.props.params;
        if (studentId === 'new') {
            StudentsStore.addStudent(this.state.student).then((student) => {
                this.props.router.push('/students');
            });
        } else {
            StudentsStore.updateStudent(this.state.student).then((student) => {
                this.props.router.push('/students');
            });
        }
    }

    sendPassword = () => {
        if (this.props.onSendPassword) {
            this.props.onSendPassword(this.state);
        }
    }

    render() {
        const {studentId} = this.props.params;

        return (
            <Grid className="table-background">
                <Panel header={this.state.username
                    ? `Student ${this.state.username}`
                    : 'New student'}></Panel>
                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Username</Col>
                        <Col sm={10}>
                            <FormControl type="text" onChange={this.onChange('username')} value={this.state.student.username || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>First Name</Col>
                        <Col sm={10}>
                            <FormControl type="text" onChange={this.onChange('firstName')} value={this.state.student.firstName || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Last Name</Col>
                        <Col sm={10}>
                            <FormControl type="text" onChange={this.onChange('lastName')} value={this.state.student.lastName || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Email</Col>
                        <Col sm={10}>
                            <FormControl type="email" onChange={this.onChange('email')} value={this.state.student.email || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Year</Col>
                        <Col sm={10}>
                            <Select options={this.state.years} value={this.state.student.year || ''} onChange={this.onChangeYear}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Courses</Col>
                        <Col sm={10}>
                            <Select multi options={this.state.courses} value={this.state.student.courses || []} onChange={this.onChangeCourses}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <ButtonToolbar>
                                <Button onClick={this.onUpdate} disabled={!this.state.student.username}>{studentId === 'new'
                                        ? 'Add'
                                        : 'Update'}</Button>
                                <Button onClick={this.sendPassword} disabled={!this.state.student.email}>Send Password</Button>
                            </ButtonToolbar>
                        </Col>
                    </FormGroup>

                </Form>
            </Grid>
        );
    }
}

StudentDetails.propTypes = {
    isNew: React.PropTypes.bool,
    onSendPassword: React.PropTypes.func
};

export default StudentDetails;
