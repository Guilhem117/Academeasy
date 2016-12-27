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
        CoursesStore.addListener(this.coursesStoreListener);
        this.coursesStoreListener();
    }

    componentWillUnmount() {
        CoursesStore.removeListener(this.coursesStoreListener);
    }

    coursesStoreListener = () => {
        this.setState({courses: CoursesStore.getCourses()});
    }


    render() {
        return (
            <Grid>
                <Row style={{
                    marginBottom: '15px'
                }}>
                  {this.state.courses.map(course => (
                    <Col xs={6} md={3} key={course.id}>
                        <Link to={`/course/${course.id}`}>
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
