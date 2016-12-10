import React, {Component} from 'react';
import {Grid, Panel} from 'react-bootstrap';

class CourseDetails extends Component {
    render() {
        return (
            <Grid className="table-background">
                <Panel header={`Course ${this.props.params.courseId}`}></Panel>
            </Grid>
        );
    }
}

export default CourseDetails;
