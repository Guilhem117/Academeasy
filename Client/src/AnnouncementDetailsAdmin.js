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
      courses: [],
      validation: {},
      startDateDisabled: false,
      endDateDisabled: false
    };
  }

  componentDidMount = () => {
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
      const now = new Date();
      announcement.start = announcement.start
        ? new Date(announcement.start)
        : announcement.start;
      announcement.end = announcement.end
        ? new Date(announcement.end)
        : announcement.end;
      this.setState({
        startDateDisabled: announcement.start < now,
        endDateDisabled: announcement.end < now,
        announcement,
        teachers,
        courses,
        validation: {
          text: null,
          start: null,
          end: null
        }
      });
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
        const now = new Date();
        announcement.start = announcement.start
          ? new Date(announcement.start)
          : announcement.start;
        announcement.end = announcement.end
          ? new Date(announcement.end)
          : announcement.end;
        this.setState({
          startDateDisabled: announcement.start < now,
          endDateDisabled: announcement.end < now,
          announcement,
          teachers,
          courses,
          validation: {
            text: null,
            start: null,
            end: null
          }
        });
      });
    }
  }

  onChange = (valueName) => {
    return (event) => {
      const value = event.target.value;
      this.setState((prevState, props) => {
        const {announcement} = prevState;
        announcement[valueName] = value;
        return {announcement, validation: this.validation(prevState)};
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
        if (typeof(newDate) === 'string') {
          announcement[which] = newDate;
        } else {
          announcement[which] = newDate.toDate();
        }
        return {announcement, validation: this.validation(prevState)};
      });
    }
  }

  onSave = _ => {
    const {announceId} = this.props.params;
    let promise;
    if (announceId === 'new') {
      promise = AnnouncementsStore.addAnnounce(this.state.announcement);
    } else {
      promise = AnnouncementsStore.updateAnnounce(this.state.announcement);
    }

    if (promise) {
      promise.then((resp) => {
        if (resp) {
          this.props.router.push('/announcements');
        } else {
          this.setState((prevState, props) => {
            return {validation: this.validation(prevState)};
          });
        }
      });
    }
  }

  onCancel = _ => {
    this.props.router.push('/announcements');
  }

  validation = (state) => {
    const {start, end, text} = state.announcement;
    return {
      text: text
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
    return this.state.startDateDisabled || (start && start.getTime && start.getFullYear() >= now.getFullYear() && start.getMonth() >= now.getMonth() && start.getDate() >= now.getDate());
  }

  isValidEndDate = (start, end) => {
    return this.state.endDateDisabled || (end && end.getTime && (!(start && start.getTime) || end > start));
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

    const formIsValid = !(this.state.validation.text || this.state.validation.start || this.state.validation.end);

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
            <FormGroup validationState={this.state.validation.text}>
              <Col componentClass={ControlLabel} sm={2}>Text</Col>
              <Col sm={10}>
                <FormControl type="text" value={this.state.announcement.text || ''} onChange={this.onChange('text')}/>
              </Col>
            </FormGroup>
            <FormGroup validationState={this.state.validation.start}>
              <Col componentClass={ControlLabel} sm={2}>Start</Col>
              <Col sm={10}>
                <Datetime inputProps={{
                  disabled: this.state.endDateDisabled
                }} timeConstraints={{
                  minutes: {
                    step: 15
                  }
                }} value={this.state.announcement.start} onChange={this.onChangeDate('start')}/>
              </Col>
            </FormGroup>
            <FormGroup validationState={this.state.validation.end}>
              <Col componentClass={ControlLabel} sm={2}>End</Col>
              <Col sm={10}>
                <Datetime inputProps={{
                  disabled: this.state.endDateDisabled
                }} timeConstraints={{
                  minutes: {
                    step: 15
                  }
                }} value={this.state.announcement.end} onChange={this.onChangeDate('end')}/>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <ButtonToolbar>
                  <Button onClick={this.onSave} disabled={!formIsValid}>Save</Button>
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
