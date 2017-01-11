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

  componentDidMount = () => {
    const {entryId} = this.props;
    Promise.all([
      entryId === 'new'
        ? {
          start: parseInt(this.props.location.query.start, 10),
          end: parseInt(this.props.location.query.end, 10)
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
            end: parseInt(this.props.location.query.end, 10)
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
      const newValue = value && value.value;
      this.setState((prevState, props) => {
        const {entry} = prevState;
        entry[which] = newValue || '';
        return {entry};
      });
    }
  }

  onDateChange = (which) => {
    return (newDate) => {
      this.setState((prevState, props) => {
        const {entry} = prevState;
        if (typeof(newDate) === 'string') {
          entry[which] = newDate;
        } else {
          entry[which] = newDate.toDate();
          if (!(entry.end && entry.end.getTime) || (entry.start && entry.start.getTime && entry.start > entry.end)) {
            entry.end = entry.start;
          }
        }
        return {entry};
      });
    }
  }

  onSave = _ => {
    let promise;
    if (this.state.entry.id) {
      promise = CalendarStore.updateEntry(this.state.entry);
    } else {
      promise = CalendarStore.addEntry(this.state.entry);
    }
    promise.then(_ => {
      this.props.router.push('/calendar');
    });
  }

  onDelete = _ => {
    const {entryId} = this.props;
    CalendarStore.deleteEntry(entryId).then(_ => {
      this.props.router.push('/calendar');
    });
  }

  onCancel = _ => {
    this.props.router.push('/calendar');
  }

  isValidStartDate = () => {
    const now = new Date();
    const {start} = this.state.entry;
    return start && start.getTime && start.getFullYear() >= now.getFullYear() && start.getMonth() >= now.getMonth() && start.getDate() >= now.getDate();
  }

  isValidEndDate = () => {
    const {start, end} = this.state.entry;
    return end && end.getTime && (!(start && start.getTime) || end > start);
  }

  render() {
    const {entryId} = this.props;

    const courses = this.state.courses.map((course) => {
      return {label: course.label, value: course.code};
    });

    const teachers = this.state.teachers.filter((teacher) => {
      return teacher.courses.includes(this.state.entry.course);
    }).map((teacher) => {
      return {label: `${teacher.lastName} ${teacher.firstName}`, value: teacher.username};
    });

    const {course, start, end} = this.state.entry;

    const startDateIsValid = this.isValidStartDate();
    const endDateIsValid = this.isValidEndDate();

    const formIsValid = course && startDateIsValid && endDateIsValid;

    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title style={{
            textAlign: 'center'
          }}>Edit Calendar</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form horizontal>
            <FormGroup validationState={this.state.entry.course ? null : "error"}>
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

            <FormGroup validationState={startDateIsValid
              ? null
              : "error"}>
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
            <FormGroup validationState={endDateIsValid
              ? null
              : "error"}>
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
          <Button onClick={this.onSave} disabled={!formIsValid}>Save</Button>
          {entryId !== 'new' && <Button onClick={this.onDelete}>Delete</Button>}
          <Button onClick={this.onCancel}>Cancel</Button>
        </Modal.Footer>

      </Modal.Dialog>
    );
  }
}

export default TimetableEdit;
