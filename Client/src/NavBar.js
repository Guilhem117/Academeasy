import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Navbar, Nav, NavItem, Button} from 'react-bootstrap';

import UsersStore from './Stores/Users';

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            studentNavigation: [
                'home', 'courses', 'profile', 'calendar'
            ],
            teacherNavigation: [
                'home', 'courses', 'profile', 'calendar', 'scan'
            ],
            adminNavigation: [
                'home',
                'courses',
                'students',
                'teachers',
                'calendar',
                'announcements',
                'admin'
            ],

            pagesNames: {
                home: 'Home',
                courses: 'Courses',
                students: 'Students',
                teachers: 'Teachers',
                profile: 'Profile',
                calendar: 'Calendar',
                announcements: 'Announcement',
                scan: 'Scan Students',
                admin: 'Admin'
            }
        };
    }

    getNavigation = (pages) => {
        return (
            <Nav>
                {pages.map((page, index) => <NavItem eventKey={index + 1} key={page} href={this.props.router.createHref(page)}>
                    {this.state.pagesNames[page]}
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
        let navigation;
        switch (sessionStorage.role) {
            case 'admin':
                navigation = this.getNavigation(this.state.adminNavigation);
                break;
            case 'teacher':
                navigation = this.getNavigation(this.state.teacherNavigation);
                break;
            case 'student':
                navigation = this.getNavigation(this.state.studentNavigation);
                break;
            default:
                navigation = <Nav/>
        }

        const {username} = sessionStorage;

        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <img style={{
                            padding: '0px'
                        }} src="/logo.png" role="presentation"/>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    {navigation}
                    {username && <Navbar.Text pullRight>
                        <Button bsStyle="link" bsSize="xsmall" onClick={this.logout}>Logout</Button>
                    </Navbar.Text>}
                    {username && <Navbar.Text pullRight>
                        {username}
                    </Navbar.Text>}
                </Navbar.Collapse>
            </Navbar>

        );
    }
}

export default withRouter(NavBar);
