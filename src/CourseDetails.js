import React, {Component} from 'react';
import {
    Grid,
    Panel,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    Col,
    ButtonToolbar,
    Button
} from 'react-bootstrap';

class CourseDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'MASCOUR5',
            label: 'Bien ça !!!'
        };
    }

    onChange = (valueName) => {
        return (event) => {
            if(event.target.files) {
              this.setState({[valueName]: event.target.files});
            }
            else {
              this.setState({[valueName]: event.target.value});
            }
        }
    }

    render() {
        return (
            <Grid className="table-background">
                <Panel header={`Course ${this.state.label}`}></Panel>
                <Form horizontal>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>Label</Col>
                        <Col sm={10}>
                            <FormControl type="text" onChange={this.onChange('label')} value={this.state.label}/>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>files</Col>
                        <Col sm={10}>
                            <FormControl type="file" multiple onChange={this.onChange('files')}/>
                            {this.state.files ?
                              <ul>{
                                Array.prototype.map.call(this.state.files, file => (
                                  <li key={file.name}>{file.name}</li>
                                ))}
                              </ul> : null}
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

            </Grid>
        );
    }
}

export default CourseDetails;
