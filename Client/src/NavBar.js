import React, {Component} from 'react';
import {withRouter, Link} from 'react-router';
import {Navbar, Nav, NavItem, Button, Image} from 'react-bootstrap';

import StudentsStore from './Stores/Students';
import TeachersStore from './Stores/Teachers';
import UsersStore from './Stores/Users';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.studentNavigation = ['home', 'courses', 'calendar'];
    this.teacherNavigation = ['home', 'courses', 'calendar', 'scan'];
    this.adminNavigation = [
      'home',
      'courses',
      'students',
      'teachers',
      'calendar',
      'announcements',
      'admin'
    ];
    this.pagesNames = {
      home: 'Home',
      courses: 'Courses',
      students: 'Students',
      teachers: 'Teachers',
      profile: 'Profile',
      calendar: 'Calendar',
      announcements: 'Announcement',
      scan: 'Scan Students',
      admin: 'Admin'
    };

    this.avatarNavStyle = {
      marginTop: '9px',
      marginBottom: '0px'
    };
  }

  getNavigation = (pages) => {
    return (
      <Nav>
        {pages.map((page, index) => <NavItem eventKey={index + 1} key={page} href={this.props.router.createHref(page)}>
          {this.pagesNames[page]}
        </NavItem>)}
      </Nav>
    );
  }

  logout = () => {
    UsersStore.logoutUser(sessionStorage.username).then(_ => {
      sessionStorage.clear();
      location.reload();
    }).catch(_ => {
      sessionStorage.clear();
      location.reload();
    });
  }

  render() {
    const {username, role} = sessionStorage;
    let navigation;
    let avatarURL;
    switch (role) {
      case 'admin':
        navigation = this.getNavigation(this.adminNavigation);
        avatarURL = undefined;
        break;
      case 'teacher':
        navigation = this.getNavigation(this.teacherNavigation);
        avatarURL = username && TeachersStore.getAvatarURL(username);
        break;
      case 'student':
        navigation = this.getNavigation(this.studentNavigation);
        avatarURL = username && StudentsStore.getAvatarURL(username);
        break;
      default:
        navigation = <Nav/>
        avatarURL = undefined;
    }

    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <img style={{
              padding: '7px'
            }} src="/logo.png" role="presentation"/>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          {navigation}
          {username && <Navbar.Text pullRight>
            <Button bsStyle="link" bsSize="xsmall" onClick={this.logout}>Logout</Button>
          </Navbar.Text>}
          {username && <Navbar.Text style={(role !== 'admin' && this.avatarNavStyle) || {}} pullRight>
            {role !== 'admin' && <Image src={avatarURL || '/student.png'} style={{
              width: 'auto',
              height: '50px'
            }} circle/>}
            {role === 'admin'
              ? username
              : <Link to='/profile'>{username}</Link>}
          </Navbar.Text>}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(NavBar);
