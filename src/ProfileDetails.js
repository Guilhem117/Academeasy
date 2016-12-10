import React, {Component} from 'react';
import {
    Grid,
    Row,
    Col,
    Panel,
    Form,
    ButtonToolbar,
    Button,
    FormGroup,
    ControlLabel,
    FormControl,
    Thumbnail
} from 'react-bootstrap';

class ProfileDetails extends Component {
    render() {
        return (
            <Grid className="table-background">
                <Panel header="My profile">
                    <Row>
                        <Col md={6}>
                            <Form horizontal>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={2}>Login</Col>
                                    <Col sm={10}>
                                        <FormControl type="text"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={2}>First Name</Col>
                                    <Col sm={10}>
                                        <FormControl type="text"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={2}>Last Name</Col>
                                    <Col sm={10}>
                                        <FormControl type="text"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={2}>Email</Col>
                                    <Col sm={10}>
                                        <FormControl type="email"/>
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col smOffset={2} sm={10}>
                                        <ButtonToolbar>
                                            <Button>Update</Button>
                                        </ButtonToolbar>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col md={6}>
                            <Thumbnail src='/student.png'>
                                <p className="text-center">
                                    <Button>Change</Button>
                                </p>
                            </Thumbnail>
                        </Col>
                    </Row>
                </Panel>
            </Grid>
        );
    }
}

export default ProfileDetails;
