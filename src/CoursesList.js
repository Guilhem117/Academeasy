import React, {Component} from 'react';
import {Grid, Row, Col, Thumbnail} from 'react-bootstrap';
import {Link} from 'react-router';

class CoursesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          courses: [
              {
                  value: 'MASCOUR1',
                  label: 'Cours de blable'
              }, {
                  value: 'MASCOUR2',
                  label: 'Cours de kaka'
              }, {
                  value: 'MASCOUR3',
                  label: 'Super Cours !'
              }, {
                  value: 'MASCOUR4',
                  label: 'Wooow'
              }, {
                  value: 'MASCOUR5',
                  label: 'Bien ça !!!'
              }
          ]
        };
    }

    render() {
        return (
            <Grid>
                <Row style={{
                    marginBottom: '15px'
                }}>
                  {this.state.courses.map(cours => (
                    <Col xs={6} md={3} key={cours.value}>
                        <Link to={`/course/${cours.value}`}>
                            <Thumbnail src="/Books.jpg">
                                <p className="text-center">{cours.label}</p>
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
