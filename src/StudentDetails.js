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
  constructor(props) {
      super(props);
      this.state = Object.assign({}, this.props.student);
    }

    onChangeCourses = (courses) => {
      this.setState({courses: courses});
    }

    onChange = (valueName) => {
        return (event) => {
            this.setState({[valueName]: event.target.value});
        }
    }

    update = () => {
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    }

    sendPassword = () => {
      if(this.props.onSendPassword) {
        this.props.onSendPassword(this.state);
      }
    }

    render() {
        return (
            <Form horizontal>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>Login</Col>
                    <Col sm={10}>
                        <FormControl type="text" onChange={this.onChange('login')} value={this.state.login}/>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>Courses</Col>
                    <Col sm={10}>
                        <Select multi options={this.props.courses} value={this.state.courses} onChange={this.onChangeCourses}/>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>First Name</Col>
                    <Col sm={10}>
                        <FormControl type="text" onChange={this.onChange('firstName')} value={this.state.firstName}/>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>Last Name</Col>
                    <Col sm={10}>
                        <FormControl type="text" onChange={this.onChange('lastName')} value={this.state.lastName}/>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>Email</Col>
                    <Col sm={10}>
                        <FormControl type="email" onChange={this.onChange('email')} value={this.state.email}/>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col smOffset={2} sm={10}>
                        <ButtonToolbar>
                            <Button onClick={this.update}>Update</Button>
                            <Button onClick={this.sendPassword}>Send Password</Button>
                        </ButtonToolbar>
                    </Col>
                </FormGroup>

            </Form>
        );
    }
}

StudentDetails.propTypes = {
    onChange: React.PropTypes.func,
    onSendPassword: React.PropTypes.func
};

export default StudentDetails;
