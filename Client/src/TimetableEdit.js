import React, {Component} from 'react';
import {
    Modal,
    Form,
    FormGroup,
    ControlLabel,
    Col,
    Button
} from 'react-bootstrap';
import Select from 'react-select';
import Datetime from 'react-datetime';

import 'react-datetime/css/react-datetime.css';

import CalendarStore from './Stores/Calendar';
import TeachersStore from './Stores/Teachers';
import CoursesStore from './Stores/Courses';

class TimetableEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            entry: {},
            courses: [],
            teachers: []
        };
    }

    componentWillMount = () => {
        const {entryId} = this.props;
        Promise.all([
            entryId === 'new'
                ? {
                    start: parseInt(this.props.location.query.start, 10),
                    end:  parseInt(this.props.location.query.end, 10),
                }
                : CalendarStore.getEntry(entryId),
            CoursesStore.getCourses(),
            TeachersStore.getTeachers()
        ]).then((values) => {
            const [entry,
                courses,
                teachers] = values;

            entry.start = entry.start
                ? new Date(entry.start)
                : '';
            entry.end = entry.end
                ? new Date(entry.end)
                : '';
            this.setState({entry, courses, teachers});
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.entryId !== nextProps.entryId) {
            const {entryId} = nextProps;
            Promise.all([
                entryId === 'new'
                    ? {
                      start: parseInt(this.props.location.query.start, 10),
                      end:  parseInt(this.props.location.query.end, 10),
                    }
                    : CalendarStore.getEntry(entryId),
                CoursesStore.getCourses(),
                TeachersStore.getTeachers()
            ]).then((values) => {
                const [entry,
                    courses,
                    teachers] = values;

                entry.start = entry.start
                    ? new Date(entry.start)
                    : '';
                entry.end = entry.end
                    ? new Date(entry.end)
                    : '';
                this.setState({entry, courses, teachers});
            });
        }
    }

    onSelectChange = (which) => {
        return (value) => {
            const newValue = value.value;
            this.setState((prevState, props) => {
                const entry = prevState.entry;
                entry[which] = newValue || '';
                return {entry};
            });
        }
    }

    onDateChange = (which) => {
        return (newDate) => {
            this.setState((prevState, props) => {
                const entry = prevState.entry;
                entry[which] = newDate.toDate();
                return {entry};
            });
        }
    }

    onSave = _ => {
        if (this.state.entry.id) {
            CalendarStore.updateEntry(this.state.entry);
        } else {
            CalendarStore.addEntry(this.state.entry);
        }
        this.props.router.push('/calendar');
    }

    onCancel = _ => {
        this.props.router.push('/calendar');
    }

    render() {
        const courses = this.state.courses.map((course) => {
            return {label: course.label, value: course.code};
        });

        const teachers = this.state.teachers.filter((teacher) => {
            return teacher.courses.includes(this.state.entry.course);
        }).map((teacher) => {
            return {label: `${teacher.lastName} ${teacher.firstName}`, value: teacher.username};
        });

        return (
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title style={{
                        textAlign: 'center'
                    }}>Edit Calendar</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Course
                            </Col>
                            <Col sm={10}>
                                <Select options={courses} value={this.state.entry.course} onChange={this.onSelectChange('course')}/>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Teacher
                            </Col>
                            <Col sm={10}>
                                <Select options={teachers} value={this.state.entry.teacher} onChange={this.onSelectChange('teacher')}/>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Start
                            </Col>
                            <Col sm={10}>
                                <Datetime timeConstraints={{
                                    minutes: {
                                        step: 15
                                    }
                                }} value={this.state.entry.start} onChange={this.onDateChange('start')}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                End
                            </Col>
                            <Col sm={10}>
                                <Datetime timeConstraints={{
                                    minutes: {
                                        step: 15
                                    }
                                }} value={this.state.entry.end} onChange={this.onDateChange('end')}/>
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onSave}>Save</Button>
                    <Button onClick={this.onCancel}>Cancel</Button>
                </Modal.Footer>

            </Modal.Dialog>
        );
    }
}

export default TimetableEdit;
