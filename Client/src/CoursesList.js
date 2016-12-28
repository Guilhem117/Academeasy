import React, {Component} from 'react';
import {Grid, Row, Col, Thumbnail} from 'react-bootstrap';
import {Link} from 'react-router';

import CoursesStore from './Stores/Courses';

class CoursesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          courses: []
        };
    }

    componentWillMount() {
      CoursesStore.getCourses().then((courses) => {
        this.setState({courses: courses});
      });
    }

    render() {
        return (
            <Grid>
                <Row style={{
                    marginBottom: '15px'
                }}>
                  {this.state.courses.map(course => (
                    <Col xs={6} md={3} key={course.code}>
                        <Link to={`/course/${course.code}`}>
                            <Thumbnail src="/Books.jpg">
                                <p className="text-center">{course.label}</p>
                            </Thumbnail>
                        </Link>
                    </Col>

                  ))}
                </Row>
            </Grid>
        );
    }
}

export default CoursesList;
