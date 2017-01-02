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
      Promise.all(courses.map((course) => CoursesStore.getTeachers(course.code))).then((teachersLists) => {
        const teachers = {};
        teachersLists.forEach((teachersList, idx) => {
          teachers[courses[idx].code] = teachersList;
        });
        this.setState({courses, teachers});
      });
    });
  }

  teacherLink = (teacher) => {
    return <Link key={teacher.username} to={`/teacher/${teacher.username}`}>{`${teacher.lastName} ${teacher.firstName}`}</Link>;
  }

  teacherLinkReducer = (acc, next, idx, array) => {
    const separator = (
      <span key={array.length + idx}> - </span>
    );
    const value = Array.isArray(acc)
      ? acc
      : [acc, separator];
    value.push(next);
    if (idx < array.length - 1) {
      value.push(separator);
    }
    return value;
  }

  render() {
    return (
      <Grid className="table-background">
        <Panel header={(
          <h3>Courses</h3>
        )}>
          {(this.state.courses && this.state.courses.length > 0)
            ? this.state.courses.map(course => (
              <Media key={course.code}>
                <Media.Body>
                  <Media.Heading>
                    <Link to={`/course/${course.code}`}>{course.year}
                      - {course.code}</Link>
                    / {course.label}</Media.Heading>
                  <p>{this.state.teachers[course.code] && this.state.teachers[course.code].map(this.teacherLink).reduce(this.teacherLinkReducer)}</p>
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
