import React, {Component} from 'react';
import {Grid, Row, Col, Thumbnail} from 'react-bootstrap';
import {Link} from 'react-router';

class CoursesList extends Component {

    render() {
        return (
            <Grid>
                <Row style={{
                    marginBottom: '15px'
                }}>
                    <Col xs={6} md={3}>
                        <Link to={`/course/${1}`}>
                            <Thumbnail src="/Books.jpg">
                                <p className="text-center">Description</p>
                            </Thumbnail>
                        </Link>
                    </Col>
                    <Col xs={6} md={3}>
                        <Thumbnail href="#" src="/Books.jpg">
                            <p className="text-center">Description</p>
                        </Thumbnail>
                    </Col>
                    <Col xs={6} md={3}>
                        <Thumbnail href="#" src="/Books.jpg">
                            <p className="text-center">Description</p>
                        </Thumbnail>
                    </Col>
                    <Col xs={6} md={3}>
                        <Thumbnail href="#" src="/Books.jpg">
                            <p className="text-center">Description</p>
                        </Thumbnail>
                    </Col>
                </Row>
                <Row style={{
                    marginBottom: '15px'
                }}>
                    <Col xs={6} md={3}>
                        <Thumbnail href="#" src="/Books.jpg">
                            <p className="text-center">Description</p>
                        </Thumbnail>
                    </Col>
                    <Col xs={6} md={3}>
                        <Thumbnail href="#" src="/Books.jpg">
                            <p className="text-center">Description</p>
                        </Thumbnail>
                    </Col>
                    <Col xs={6} md={3}>
                        <Thumbnail href="#" src="/Books.jpg">
                            <p className="text-center">Description</p>
                        </Thumbnail>
                    </Col>
                    <Col xs={6} md={3}>
                        <Thumbnail href="#" src="/Books.jpg">
                            <p className="text-center">Description</p>
                        </Thumbnail>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default CoursesList;
