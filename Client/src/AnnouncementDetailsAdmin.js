import React, {Component} from 'react';
import {withRouter} from 'react-router';

import {
    Grid,
    Panel,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    Col,
    ButtonToolbar,
    Button
} from 'react-bootstrap';
import Select from 'react-select';
import Datetime from 'react-datetime';

import 'react-datetime/css/react-datetime.css';

import AnnouncementsStore from './Stores/Announcements';
import CoursesStore from './Stores/Courses'
import TeachersStore from './Stores/Teachers'

class AnnouncementDetailsAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            announcement: {},
            teachers: [],
            courses: []
        };
    }

    componentWillMount = () => {
        const {announceId} = this.props.params;

        Promise.all([
            announceId === 'new'
                ? {
                    courses: [],
                    teachers: []
                }
                : AnnouncementsStore.getAnnounce(announceId),
            TeachersStore.getTeachers(),
            CoursesStore.getCourses()
        ]).then((values) => {
            const [announcement,
                teachers,
                courses] = values;
            this.setState({announcement, teachers, courses});
        });
    }

    componentWillReceiveProps = (nextProps) => {

        if (this.props.params.courseCode !== nextProps.params.courseCode) {
            const {announceId} = nextProps.params;

            Promise.all([
                announceId === 'new'
                    ? {}
                    : AnnouncementsStore.getAnnounce(announceId),
                TeachersStore.getTeachers(),
                CoursesStore.getCourses()
            ]).then((values) => {
                const [announcement,
                    teachers,
                    courses] = values;
                this.setState({announcement, teachers, courses});
            });
        }
    }

    onChange = (valueName) => {
        return (event) => {
            const value = event.target.value;
            this.setState((prevState, props) => {
                const {announcement} = prevState;
                announcement[valueName] = value;
                return {announcement};
            });

        }
    }

    onChangeCourses = (courses) => {
        this.setState((prevState, props) => {
            const {announcement} = prevState;
            announcement.courses = courses.map((course) => course.value);
            return {announcement};
        });
    }

    onChangeTeachers = (teachers) => {
        this.setState((prevState, props) => {
            const {announcement} = prevState;
            announcement.teachers = teachers.map((teacher) => teacher.value);
            return {announcement};
        });
    }

    onChangeDate = (which) => {
        return (newDate) => {
            this.setState((prevState, props) => {
                const {announcement} = prevState;
                announcement[which] = newDate.toDate();
                return {announcement};
            });
        }
    }

    onSave = _ => {
        const {announceId} = this.props.params;
        if (announceId === 'new') {
            AnnouncementsStore.addAnnounce(this.state.announcement);
        } else {
            AnnouncementsStore.updateAnnounce(this.state.announcement);
        }
        this.props.router.push('/announcements');
    }

    onCancel = _ => {
        this.props.router.push('/announcements');
    }

    render() {

        const courses = this.state.courses.map((course) => {
            return {label: course.label, value: course.code};
        });

        const teachers = this.state.teachers.filter((teacher) => {
            return this.state.announcement.courses.every((course) => {
                return teacher.courses.includes(course);
            });
        }).map((teacher) => {
            return {label: `${teacher.lastName} ${teacher.firstName}`, value: teacher.username};
        });

        return (
            <Grid className="table-background">
                <Panel header='Announce'>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>Courses</Col>
                            <Col sm={10}>
                                <Select multi options={courses} value={this.state.announcement.courses || []} onChange={this.onChangeCourses}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>Teachers</Col>
                            <Col sm={10}>
                                <Select multi options={teachers} value={this.state.announcement.teachers || []} onChange={this.onChangeTeachers}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>Text</Col>
                            <Col sm={10}>
                                <FormControl type="text" value={this.state.announcement.text || ''} onChange={this.onChange('text')}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>Start</Col>
                            <Col sm={10}>
                                <Datetime timeConstraints={{
                                    minutes: {
                                        step: 15
                                    }
                                }} value={this.state.announcement.start} onChange={this.onChangeDate('start')}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>End</Col>
                            <Col sm={10}>
                                <Datetime timeConstraints={{
                                    minutes: {
                                        step: 15
                                    }
                                }} value={this.state.announcement.end} onChange={this.onChangeDate('end')}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <ButtonToolbar>
                                    <Button onClick={this.onSave}>Save</Button>
                                    <Button onClick={this.onCancel}>Cancel</Button>
                                </ButtonToolbar>
                            </Col>
                        </FormGroup>

                    </Form>
                </Panel>
            </Grid>
        );
    }
}

export default withRouter(AnnouncementDetailsAdmin);
