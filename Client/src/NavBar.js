import React, {Component} from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            studentNavigation: [
                'home', 'courses', 'profile'
            ],
            teacherNavigation: [
                'home', 'courses', 'profile'
            ],
            adminNavigation: [
                'home', 'courses', 'students', 'teachers', 'calendar'
            ],

            pagesNames: {
                home: 'Home',
                courses: 'Courses',
                students: 'Students',
                teachers: 'Teachers',
                profile: 'Profile',
                calendar: 'Calendar'
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

    render() {
        let navigation;
        switch (localStorage.role) {
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
                navigation = (
                    <Navbar.Collapse>
                        <Navbar.Text pullRight>
                            AcademEasy
                        </Navbar.Text>
                    </Navbar.Collapse>
                )
        }
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
                {navigation}
            </Navbar>

        );
    }
}

export default NavBar;
