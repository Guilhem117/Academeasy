import React, {Component} from 'react';
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
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

import CoursesStore from './Stores/Courses'
import TeachersStore from './Stores/Teachers'

const emptyEntry = {
    id: null,
    code: null,
    label: null,
    color: null,
    files: []
};

class CourseDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: CoursesStore.getCourse(parseInt(this.props.params.courseId, 10)) || emptyEntry,
            teachers: TeachersStore.getTeachersForCourse(parseInt(this.props.params.courseId, 10)).map((teacher) => {
                return teacher.id;
            }) || []
        };
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.params.courseId !== nextProps.params.courseId) {
            this.setState({
                course: CoursesStore.getCourse(parseInt(nextProps.params.courseId, 10)) || emptyEntry,
                teachers: TeachersStore.getTeachersForCourse(parseInt(nextProps.params.courseId, 10)).map((teacher) => {
                    return teacher.id;
                }) || []
            });
        }
    }

    onChange = (valueName) => {
        return (event) => {
            if (event.target.files) {
                const files = event.target.files;
                this.setState((prevState, props) => {
                    prevState.course[valueName] = files;
                    return {course: prevState.course};
                });
            } else {
                const value = event.target.value;
                this.setState((prevState, props) => {
                    prevState.course[valueName] = value;
                    return {course: prevState.course};
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
            teachers: teachers.map((teacher) => teacher.value)
        });
    }

    onSave = _ => {
        if (this.state.course.id > -1) {
            CoursesStore.updateCourse(this.state.course);
            this.state.teachers.forEach((teacherId) => {
                TeachersStore.addCourseToTeacher(teacherId, this.state.course.id);
            });
        } else {
            const courseId = CoursesStore.addCourse(this.state.course);
            this.state.teachers.forEach((teacherId) => {
                TeachersStore.addCourseToTeacher(teacherId, courseId);
            });
        }
        this.props.router.push('/courses');
    }

    onCancel = _ => {
        this.props.router.push('/courses');
    }

    render() {
        const allTeachers = TeachersStore.getTeachers().map((teacher) => {
            return {label: `${teacher.lastName} ${teacher.firstName}`, value: teacher.id};
        });

        return (
            <Grid className="table-background">
                <Panel header={`Course ${this.state.course.label}`}></Panel>
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
                            <FormControl type="file" multiple onChange={this.onChange('files')}/> {this.state.course.files
                                ? <ul>{Array.prototype.map.call(this.state.course.files, file => (
                                            <li key={file.name}>{file.name}</li>
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
                            <Select multi options={allTeachers} value={this.state.teachers || []} onChange={this.onChangeTeachers}/>
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

export default CourseDetails;
