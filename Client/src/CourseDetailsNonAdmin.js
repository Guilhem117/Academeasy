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
            files: undefined
        };
    }

    componentWillMount = () => {
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
            Promise.all([CoursesStore.getCourse(courseCode), CoursesStore.getTeachers(courseCode)]).then((values) => {
                const [course,
                    teachers] = values;
                this.setState({course, teachers});
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
        if (this.state.files && this.state.files.length > 0) {
            CoursesStore.addAttachments(courseCode, this.state.files);
        }
        this.props.router.push('/courses');
    }

    onCancel = _ => {
        this.props.router.push('/courses');
    }

    getAttachmentURL = (filename) => {
        return CoursesStore.getAttachmentURL(this.state.course.code, filename);
    }

    render() {
        const {role, username} = localStorage;
        const canUploadFiles = role === 'teacher' && this.state.teachers.findIndex((teacher) => teacher.username === username) > -1;
        const nextdates = this.state.nextdates.map((entry) => moment(entry.start).format('MMM Do')).join(' - ');
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
                            ? <ul>{this.state.course.attachments.map((file) => (
                                        <li key={file.name}>
                                            <a href={this.getAttachmentURL(file.name)}>{file.name}</a>
                                        </li>
                                    ))}
                                </ul>
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
                                    : 'Close'}</Button>
                        </ButtonToolbar>
                    </Col>
                </Row>

            </Grid>
        );
    }
}

export default withRouter(CourseDetailsNonAdmin);
