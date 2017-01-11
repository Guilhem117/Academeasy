import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Grid, Panel, Row, Col} from 'react-bootstrap';

import TeachersStore from './Stores/Teachers';
import CoursesStore from './Stores/Courses';

class TeacherDetailsNonAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teacher: {},
      courses: []
    };

  }

  componentDidMount = () => {
    const {teacherId} = this.props.params;
    Promise.all([TeachersStore.getTeacher(teacherId), CoursesStore.getCourses()]).then((values) => {
      const [teacher,
        courses] = values;
      this.setState({
        teacher,
        courses: (teacher.courses && courses.map((course) => {
          return courses.find((c) => c.code === course.code).label;
        }).join(', ')) || ''
      });

    })

  }

  componentWillReceiveProps = (nextProps) => {
    const {teacherId} = nextProps.params;
    if (teacherId !== this.state.teacher.id) {
      Promise.all([TeachersStore.getTeacher(teacherId), CoursesStore.getCourses()]).then((values) => {
        const [teacher,
          courses] = values;
        this.setState({
          teacher,
          courses: (teacher.courses && courses.map((course) => {
            return courses.find((c) => c.code === course.code).label;
          }).join(', ')) || ''
        });
      });

    }
  }

  render() {
    return (
      <Grid className="table-background">
        <Panel header={`Teacher ${this.state.teacher.username}`}>
          <Row>
            <Col md={6}>
              <Row>
                <Col sm={3}>
                  <p>Courses</p>
                </Col>
                <Col sm={9}>
                  <p>{this.state.courses}</p>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <p>First Name</p>
                </Col>
                <Col sm={9}>
                  <p>{this.state.teacher.firstName}</p>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <p>Last Name</p>
                </Col>
                <Col sm={9}>
                  <p>{this.state.teacher.lastName}</p>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <p>Email</p>
                </Col>
                <Col sm={9}>
                  <p>{this.state.teacher.email}</p>
                </Col>
              </Row>
            </Col>
            <Col md={3}>
              <Row style={{
                textAlign: 'center'
              }}>
                <h3>Avatar</h3>
              </Row>
              <Row style={{
                textAlign: 'center'
              }}>
                <img src={this.state.teacher.avatar || '/student.png'} role="presentation"/>
              </Row>
            </Col>
          </Row>
        </Panel>
      </Grid>
    );
  }
}

export default withRouter(TeacherDetailsNonAdmin);
