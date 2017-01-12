import React, {Component} from 'react';
import {withRouter} from 'react-router';

import moment from 'moment';

import {
  Grid,
  Panel,
  Row,
  FormControl,
  Well,
  Col,
  ButtonToolbar,
  Button
} from 'react-bootstrap';

import CoursesStore from './Stores/Courses'
import CalendarStore from './Stores/Calendar'

class CourseDetailsNonAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: {},
      teachers: [],
      nextdates: [],
      filesToRemove: []
    };
  }

  componentDidMount = () => {
    const {courseCode} = this.props.params;
    Promise.all([
      CoursesStore.getCourse(courseCode),
      CoursesStore.getTeachers(courseCode),
      CalendarStore.getCalendarForCourse(courseCode, 5)
    ]).then((values) => {
      const [course,
        teachers,
        nextdates] = values;
      this.setState({course, teachers, nextdates});
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.params.courseCode !== nextProps.params.courseCode) {
      const {courseCode} = nextProps.params;
      Promise.all([
        CoursesStore.getCourse(courseCode),
        CoursesStore.getTeachers(courseCode),
        CalendarStore.getCalendarForCourse(courseCode, 5)
      ]).then((values) => {
        const [course,
          teachers,
          nextdates] = values;
        this.setState({course, teachers, nextdates});
      });
    }
  }

  removeAttachement = (fileName) => {
    return (event) => {
      this.setState((prevState, props) => {
        const {filesToRemove} = prevState;
        if (filesToRemove.indexOf(fileName) === -1) {
          filesToRemove.push(fileName);
        }
        return {filesToRemove};
      });
    }
  }

  onChange = (valueName) => {
    return (event) => {
      if (event.target.files) {
        const {files} = event.target;
        this.setState({files: files});
      }
    }
  }

  onSave = _ => {
    const {courseCode} = this.props.params;
    const promises = [];
    if (this.state.files && this.state.files.length > 0) {
      promises.push(CoursesStore.addAttachments(courseCode, this.state.files));
    }
    if (this.state.filesToRemove && this.state.filesToRemove.length > 0) {
      promises.push(CoursesStore.removeAttachments(courseCode, this.state.filesToRemove));
    }
    Promise.all(promises).then(_ => {
      this.props.router.push('/courses')
    });
  }

  onCancel = _ => {
    this.props.router.push('/courses');
  }

  getAttachmentURL = (filename) => {
    return CoursesStore.getAttachmentURL(this.state.course.code, filename);
  }

  filesList = _ => {
    const {attachments} = this.state.course;
    const {filesToRemove} = this.state;
    const {role} = sessionStorage;

    return (attachments.filter((file) => filesToRemove.indexOf(file.name) === -1).map((file, idx) => (
      <li key={idx}>
        <p>
          <a href={this.getAttachmentURL(file.name)}>{file.name}</a>
          {role === 'teacher' && <Button bsClass="close" style={{
            display: 'inline-block',
            color: '#000'
          }} onClick={this.removeAttachement(file.name)}>
            <span>x</span>
          </Button>}
        </p>
      </li>
    )));
  }

  render() {
    const {role, username} = sessionStorage;
    const canUploadFiles = role === 'teacher' && this.state.teachers.findIndex((teacher) => teacher.username === username) > -1;
    const nextdates = this.state.nextdates.map((entry) => moment(entry.start).format('MMM Do hh:mm a')).join(', ');
    return (
      <Grid className="table-background">
        <Panel header={`Course ${this.state.course.code}`}></Panel>
        <Row>
          <Col sm={2}>
            <p className="text-right">Code</p>
          </Col>
          <Col sm={10}>
            <p>{this.state.course.code || ''}</p>
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <p className="text-right">Next dates</p>
          </Col>
          <Col sm={10}>
            <p>{nextdates}</p>
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <p className="text-right">Label</p>
          </Col>
          <Col sm={10}>
            <p>{this.state.course.label || ''}</p>
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <p className="text-right">Files</p>
          </Col>
          <Col sm={10}>
            {canUploadFiles && <FormControl type="file" multiple onChange={this.onChange('files')}/>}
            {this.state.files
              ? <Well>
                  <h5>New documents</h5>
                  <ul>{Array.prototype.map.call(this.state.files, (file) => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                </Well>
              : null}
            {this.state.course.attachments
              ? <ul>{this.filesList()}</ul>
              : null}
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <p className="text-right">Teachers</p>
          </Col>
          <Col sm={10}>
            {this.state.teachers.map((teacher) => `${teacher.lastName} ${teacher.firstName}`).join(' - ')}
          </Col>
        </Row>
        <Row>
          <Col smOffset={2} sm={10}>
            <ButtonToolbar>
              {canUploadFiles && <Button onClick={this.onSave}>Save</Button>}
              <Button onClick={this.onCancel}>{canUploadFiles
                  ? 'Cancel'
                  : 'Back'}</Button>
            </ButtonToolbar>
          </Col>
        </Row>

      </Grid>
    );
  }
}

export default withRouter(CourseDetailsNonAdmin);
