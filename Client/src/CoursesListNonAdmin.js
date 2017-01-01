import React, {Component} from 'react';
import {Grid, Panel, Media} from 'react-bootstrap';
import {Link} from 'react-router';

import CoursesStore from './Stores/Courses';

class CoursesListNonAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      teachers: {}
    };
  }

  componentWillMount() {
    CoursesStore.getCourses().then((courses) => {
      this.setState({courses});
      courses.forEach((course) => {
        CoursesStore.getTeachers(course.code).then((teachersList) => {
          this.setState((prevState) => {
            const {teachers} = prevState;
            teachers[course.code] = teachersList;
          });
        });
      });
    });
  }

  teacherLink = (teacher) => {
    return <Link key={teacher.username} to={`/teacher/${teacher.username}`}>{`${teacher.lastName} ${teacher.firstName}`}</Link>;
  }

  render() {
    return (
      <Grid className="table-background">
        <Panel header="Courses list">
          {(this.state.courses && this.state.courses.length > 0)
            ? this.state.courses.map(course => (
              <Media key={course.code}>
                <Media.Body>
                  <Media.Heading><Link to={`/course/${course.code}`}>{course.year} - {course.code}</Link> / {course.label}</Media.Heading>
                  <p>{this.state.teachers[course.code] && this.state.teachers[course.code].map(this.teacherLink)}</p>
                </Media.Body>
              </Media>
            ))
            : <h3>No courses</h3>}
        </Panel>
      </Grid>
    );
  }
}

export default CoursesListNonAdmin;
