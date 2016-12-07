import React, {Component} from 'react';
import {Grid, Row, Col, Thumbnail} from 'react-bootstrap';

class CoursesManagement extends Component {

    render() {
        return (
            <Grid>
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

export default CoursesManagement;
