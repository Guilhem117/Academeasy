import React, {Component} from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    onChangePage = (page) => {
        return (event) => {
            if (this.props.onChangePage) {
                this.props.onChangePage(page);
            }
        }
    }

    render() {
        return (
            <Navbar>

                <Navbar.Header>
                    <Navbar.Brand>
                        <img style={{
                            padding: '0px'
                        }} src="/logo.png"/>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                {this.props.profile
                    ? <Nav>
                            <NavItem eventKey={1} href="#" onClick={this.onChangePage('Home')}>Home</NavItem>
                            <NavItem eventKey={2} href="#" onClick={this.onChangePage('Courses')}>Courses management</NavItem>
                            <NavItem eventKey={3} href="#" onClick={this.onChangePage('Students')}>Students management</NavItem>
                            <NavItem eventKey={4} href="#" onClick={this.onChangePage('Teachers')}>Teachers management</NavItem>
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
