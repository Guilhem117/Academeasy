import React, {Component} from 'react';
import {
    Form,
    Col,
    ButtonToolbar,
    Button,
    FormGroup,
    ControlLabel,
    FormControl
} from 'react-bootstrap';
import Select from 'react-select';

class StudentDetails extends Component {

    onChangeCourses = (selection) => {
        if (this.props.onChange) {
            this.props.student.courses = selection;
            this.props.onChange(this.props.student);
        }
    }

    render() {
        return (
            <Form horizontal>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>Login</Col>
                    <Col sm={10}>
                        <FormControl type="text"/>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>Courses</Col>
                    <Col sm={10}>
                        <Select multi options={this.props.courses} value={this.props.student.courses} onChange={this.onChangeCourses}/>
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
                            <Button>Send Password</Button>
                        </ButtonToolbar>
                    </Col>
                </FormGroup>

            </Form>
        );
    }
}
StudentDetails.propTypes = {
    onChange: React.PropTypes.func
};

export default StudentDetails;
