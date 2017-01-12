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
import QRCode from 'qrcode.react';
import Alerts from './Alerts';
import ChangePasswordDialog from './ChangePasswordDialog';
import StudentsStore from './Stores/Students';
import TeachersStore from './Stores/Teachers';

class ProfileDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: {},
      displayPasswordDialog: false
    };

  }

  componentDidMount = () => {
    const {role, username} = sessionStorage;
    switch (role) {
      case 'student':
        StudentsStore.getStudent(username).then((student) => {
          this.setState({profile: student});
        });
        break;
      case 'teacher':
        TeachersStore.getTeacher(username).then((teacher) => {
          this.setState({profile: teacher});
        });
        break;
    }
  }

  onChange = (valueName) => {
    return (event) => {
      const {value} = event.target;
      this.setState((prevState, props) => {
        const {profile} = prevState;
        profile[valueName] = value;
        return {profile};
      });
    }
  }

  onChangeAvatar = (event) => {
    const [file] = event.target.files;
    if (file) {
      if (file.size < 1048576) {
        if (!/^image\//.test(file.type)) {
          event.target.value = null;
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const {result} = e.target;
          this.setState((prevState, props) => {
            const {profile} = prevState;
            profile.avatar = result;
            return {profile};
          });
        };
        reader.readAsDataURL(file);
      } else {
        Alerts.showWarning('Picture too large (max 1mb)');
      }
    }
  }

  onChangePassword = _ => {
    this.setState({displayPasswordDialog: true});
  }

  onChangePasswordConfirm = (form) => {
    const {currentpassword, newpassword} = form;
    const {username} = sessionStorage;
    StudentsStore.changePassword(username, newpassword, currentpassword).then(_ => {
      this.setState({displayPasswordDialog: false});
    });
  }

  onChangePasswordCancel = _ => {
    this.setState({displayPasswordDialog: false});
  }

  onUpdate = _ => {
    const {role} = sessionStorage;
    let promise;
    switch (role) {
      case 'student':
        promise = StudentsStore.updateStudent(this.state.profile);
        break;
      case 'teacher':
        promise = TeachersStore.updateTeacher(this.state.profile);
        break;
    }
    if (promise) {
      promise.then((resp) => {
        if (resp) {
          location.reload();
        }
      });
    }
  }

  render() {
    const {username} = sessionStorage;

    return (
      <Grid className="table-background">
        {this.state.displayPasswordDialog && <ChangePasswordDialog confirm current onCancel={this.onChangePasswordCancel} onConfirm={this.onChangePasswordConfirm}/>}
        <Panel header="My profile">
          <Row>
            <Col md={6}>
              <Form horizontal>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3}>Username</Col>
                  <Col sm={9}>
                    <FormControl type="text" disabled onChange={this.onChange('username')} value={this.state.profile.username || ''}/>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3}>First Name</Col>
                  <Col sm={9}>
                    <FormControl type="text" onChange={this.onChange('firstName')} value={this.state.profile.firstName || ''}/>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3}>Last Name</Col>
                  <Col sm={9}>
                    <FormControl type="text" onChange={this.onChange('lastName')} value={this.state.profile.lastName || ''}/>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={3}>Email</Col>
                  <Col sm={9}>
                    <FormControl type="email" onChange={this.onChange('email')} value={this.state.profile.email || ''}/>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col smOffset={3} sm={9}>
                    <ButtonToolbar>
                      <Button onClick={this.onUpdate}>Update</Button>
                      <Button onClick={this.onChangePassword}>Change password</Button>
                    </ButtonToolbar>
                  </Col>
                </FormGroup>
              </Form>
            </Col>
            <Col md={3}>
              <Row style={{
                textAlign: 'center'
              }}>
                <h3>Avatar</h3>
              </Row>
              <Row style={{
                textAlign: 'center'
              }}>
                <Thumbnail src={this.state.profile.avatar || '/student.png'}>
                  <p className="text-center">
                    <FormControl type="file" onChange={this.onChangeAvatar}/>
                  </p>
                </Thumbnail>
              </Row>
            </Col>
            <Col md={3}>
              <Row style={{
                textAlign: 'center'
              }}>
                <h3>QR Code</h3>
              </Row>
              <Row style={{
                textAlign: 'center'
              }}>
                <QRCode value={username} level='M' size={200}/>
              </Row>
            </Col>
          </Row>
        </Panel>
      </Grid>
    );
  }
}

export default ProfileDetails;
