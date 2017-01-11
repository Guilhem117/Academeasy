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
      teachers: [],
      validation: {
        course: null,
        start: null,
        end: null
      }
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

      this.setState({
        entry,
        courses,
        teachers,
        validation: {
          course: null,
          start: null,
          end: null
        }
      });
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
        this.setState({
          entry,
          courses,
          teachers,
          validation: {
            course: null,
            start: null,
            end: null
          }
        });
      });
    }
  }

  onSelectChange = (which) => {
    return (value) => {
      const newValue = value && value.value;
      this.setState((prevState, props) => {
        const {entry} = prevState;
        entry[which] = newValue;
        return {entry, validation: this.validation(prevState)};
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
        }
        return {entry, validation: this.validation(prevState)};
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
    promise.then((resp) => {
      if (resp) {
        this.props.router.push('/calendar');
      } else {
        this.setState((prevState, props) => {
          return {validation: this.validation(prevState)};
        });
      }
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

  validation = (state) => {
    const {start, end, course} = state.entry;
    return {
      course: course
        ? null
        : "error",
      start: this.isValidDate('start', start, end)
        ? null
        : "error",
      end: this.isValidDate('end', start, end)
        ? null
        : "error"
    }
  }

  isValidDate = (which, start, end) => {
    switch (which) {
      case 'start':
        return this.isValidStartDate(start, end);
      case 'end':
        return this.isValidEndDate(start, end);
      default:
        return false;
    }
  }

  isValidStartDate = (start, end) => {
    const now = new Date();
    return start && start.getTime && start.getFullYear() >= now.getFullYear() && start.getMonth() >= now.getMonth() && start.getDate() >= now.getDate();
  }

  isValidEndDate = (start, end) => {
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

    const formIsValid = !(this.state.validation.course || this.state.validation.start || this.state.validation.end);

    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title style={{
            textAlign: 'center'
          }}>Edit Calendar</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form horizontal>
            <FormGroup validationState={this.state.validation.course}>
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

            <FormGroup validationState={this.state.validation.start}>
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
            <FormGroup validationState={this.state.validation.end}>
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
