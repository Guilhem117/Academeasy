import React, {Component} from 'react';
import {withRouter} from 'react-router';

import {
    Grid,
    Panel,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    Well,
    Col,
    ButtonToolbar,
    Button
} from 'react-bootstrap';
import Select from 'react-select';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

import CoursesStore from './Stores/Courses'
import TeachersStore from './Stores/Teachers'

class CourseDetailsAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: {},
            selectedTeachers: [],
            teachers: [],
            files: undefined
        };
    }

    componentWillMount = () => {
        const {courseCode} = this.props.params;

        Promise.all([
            courseCode === 'new'
                ? {}
                : CoursesStore.getCourse(courseCode),
            TeachersStore.getTeachers()
        ]).then((values) => {
            const [course,
                teachers] = values;
            const selectedTeachers = teachers.filter((teacher) => {
                return teacher.courses.includes(course.code);
            }).map((teacher) => teacher.username);
            this.setState({course, teachers, selectedTeachers});
        });
    }

    componentWillReceiveProps = (nextProps) => {

        if (this.props.params.courseCode !== nextProps.params.courseCode) {
            const {courseCode} = nextProps.params;
            Promise.all([
                courseCode === 'new'
                    ? {}
                    : CoursesStore.getCourse(courseCode),
                TeachersStore.getTeachers()
            ]).then((values) => {
                const [course,
                    teachers] = values;
                const selectedTeachers = teachers.filter((teacher) => {
                    return teacher.courses.includes(course.code);
                }).map((teacher) => teacher.username);
                this.setState({course, teachers, selectedTeachers});
            });
        }
    }

    onChange = (valueName) => {
        return (event) => {
            if (event.target.files) {
                const {files} = event.target;
                this.setState({files: files});
            } else {
                const value = event.target.value;
                this.setState((prevState, props) => {
                    const {course} = prevState;
                    course[valueName] = value;
                    return {course};
                });
            }
        }
    }

    onChangeColor = (colors) => {
        this.setState((prevState, props) => {
            prevState.course.color = colors.color;
            return {course: prevState.course};
        });
    }

    onChangeTeachers = (teachers) => {
        this.setState({
            selectedTeachers: teachers.map((teacher) => teacher.value)
        });
    }

    onSave = _ => {
        const {courseCode} = this.props.params;
        delete this.state.course.attachments;
        if (courseCode === 'new') {
            CoursesStore.addCourse(this.state.course);
        } else {
            CoursesStore.updateCourse(this.state.course);
        }
        CoursesStore.setTeachers(this.state.course.code, this.state.selectedTeachers);

        if (this.state.files && this.state.files.length > 0) {
            CoursesStore.addAttachments(this.state.course.code, this.state.files);
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
        const allTeachers = this.state.teachers.map((teacher) => {
            return {label: `${teacher.lastName} ${teacher.firstName}`, value: teacher.username};
        });

        return (
            <Grid className="table-background">
                <Panel header={this.state.course.code
                    ? `Course ${this.state.course.code}`
                    : 'New course'}></Panel>
                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Code</Col>
                        <Col sm={10}>
                            <FormControl type="text" onChange={this.onChange('code')} value={this.state.course.code || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Label</Col>
                        <Col sm={10}>
                            <FormControl type="text" onChange={this.onChange('label')} value={this.state.course.label || ''}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Files</Col>
                        <Col sm={10}>
                            <FormControl type="file" multiple onChange={this.onChange('files')}/> {this.state.files
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
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Color</Col>
                        <Col sm={10}>
                            <ColorPicker className="form-control" color={this.state.course.color || '#36c'} onChange={this.onChangeColor}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Teachers</Col>
                        <Col sm={10}>
                            <Select multi options={allTeachers} value={this.state.selectedTeachers || []} onChange={this.onChangeTeachers}/>
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

            </Grid>
        );
    }
}

export default withRouter(CourseDetailsAdmin);
