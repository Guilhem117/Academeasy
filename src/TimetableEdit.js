import React, {Component} from 'react';
import {
    Modal,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    Col,
    Button
} from 'react-bootstrap';
import Select from 'react-select';
import Datetime from 'react-datetime';

import 'react-datetime/css/react-datetime.css';

import CalendarStore from './Stores/Calendar';
import TeachersStore from './Stores/Teachers';
import CoursesStore from './Stores/Courses';

const emptyEntry = {
  id: null,
  course: null,
  teacher: null,
  start: null,
  end: null,
};

class TimetableEdit extends Component {

    constructor(props) {
        super(props);
        this.state = CalendarStore.getEntry(parseInt(this.props.entryId, 10)) || emptyEntry;
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.entryId !== nextProps.entryId) {
            this.setState(CalendarStore.getEntry(parseInt(nextProps.entryId, 10)) || emptyEntry);
        }
    }

    onSelectChange = (which) => {

        return (value) => {
            this.setState({
                [which]: value
                    ? value.value
                    : ''
            });
        }
    }

    onDateChange = (which) => {
        return (newDate) => {
            this.setState({[which]: newDate.toDate()});
        }
    }

    onSave = _ => {
        console.log(this.state);
        if (this.state.id) {
            CalendarStore.updateEntry(this.state);
        } else {
            CalendarStore.addEntry(this.state);
        }
        this.props.router.push('/calendar');
    }

    onCancel = _ => {
        this.props.router.push('/calendar');
    }

    render() {
        const courses = CoursesStore.getCourses().map((course) => {
            return {label: course.label, value: course.id};
        });

        const teachers = TeachersStore.getTeachers().filter((teacher) => {
            return teacher.courses.includes(this.state.course);
        }).map((teacher) => {
            return {label: `${teacher.lastName} ${teacher.firstName}`, value: teacher.id};
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
                                <Select options={courses} value={this.state.course || ''} onChange={this.onSelectChange('course')}/>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Teacher
                            </Col>
                            <Col sm={10}>
                                <Select options={teachers} value={this.state.teacher || ''} onChange={this.onSelectChange('teacher')}/>
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
                                }} value={this.state.start || ''} onChange={this.onDateChange('start')}/>
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
                                }} value={this.state.end || ''} onChange={this.onDateChange('end')}/>
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
