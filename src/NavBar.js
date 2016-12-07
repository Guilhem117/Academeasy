import React, {Component} from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';


class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
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
                {localStorage.profile
                    ? <Nav>
                            <NavItem eventKey={1} href={this.props.router.createHref('/')}>Home</NavItem>
                            <NavItem eventKey={2} href={this.props.router.createHref('/courses')}>Courses management</NavItem>
                            <NavItem eventKey={3} href={this.props.router.createHref('/')}>Students management</NavItem>
                            <NavItem eventKey={4} href={this.props.router.createHref('/')}>>Teachers management</NavItem>
                        </Nav>
                    : <Navbar.Collapse>

                        <Navbar.Text pullRight>
                            AcademEasy
                        </Navbar.Text>
                    </Navbar.Collapse>
}
            </Navbar>

        );
    }
}

export default NavBar;
