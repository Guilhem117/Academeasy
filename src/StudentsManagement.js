import React, {Component} from 'react';
import {Grid, Panel, Row} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import StudentDetails from './StudentDetails';

class StudentsManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: [
                {
                    id: 1,
                    login: 'azighmi',
                    firstName: 'Amira',
                    lastName: 'Zighmi',
                    email: 'amirazighmi@yahoo.com',
                    year: 'M2',
                    courses: []
                }, {
                    id: 2,
                    login: 'toto',
                    firstName: 'Toto',
                    lastName: 'Lala',
                    year: 'M1',
                    courses: []
                }
            ],
            courses: [
                {
                    value: 'MASCOUR1',
                    label: 'Cours de blable'
                }, {
                    value: 'MASCOUR2',
                    label: 'Cours de kaka'
                }, {
                    value: 'MASCOUR3',
                    label: 'Super Cours !'
                }, {
                    value: 'MASCOUR4',
                    label: 'Wooow'
                }, {
                    value: 'MASCOUR5',
                    label: 'Bien ça !!!'
                }
            ]
        };
    }

    updateStudent = (student) => {
        this.setState((prevState, props) => {
            let index = prevState.students.findIndex(s => s.id === student.id);
            if (index > -1) {
                prevState.students[index] = student;
                return {students: prevState.students};
            }
        });
    }

    sendPassword = (student) => {
      console.log('Send password to ', student.email);
    }

    detailsComponent = (student) => {
        return (<StudentDetails courses={this.state.courses} student={student} onChange={this.updateStudent} onSendPassword={this.sendPassword}/>);
    }

    render() {
        return (
            <Grid className="table-background">
                <Panel header="Students list">
                    <Row>
                        <BootstrapTable data={this.state.students} options={{
                            expandRowBgColor: 'rgb(242, 255, 163)',
                        }} insertRow expandableRow={(row) => true} expandComponent={this.detailsComponent} search striped hover>
                            <TableHeaderColumn dataField='id' isKey autoValue>#</TableHeaderColumn>
                            <TableHeaderColumn dataField='login' editable={{
                                type: 'textarea'
                            }}>Login</TableHeaderColumn>
                            <TableHeaderColumn dataField='firstName' editable={{
                                type: 'textarea'
                            }}>First Name</TableHeaderColumn>
                            <TableHeaderColumn dataField='lastName' editable={{
                                type: 'textarea'
                            }}>Last Name</TableHeaderColumn>
                            <TableHeaderColumn dataField='email' editable={{
                                type: 'textarea'
                            }}>Email</TableHeaderColumn>
                            <TableHeaderColumn dataField='year' filter={{
                                type: 'SelectFilter',
                                options: {
                                    'M1': 'M1',
                                    'M2': 'M2'
                                }
                            }} editable={{
                                type: 'select',
                                options: {
                                    values: ['M1', 'M2']
                                }
                            }}>
                                Year
                            </TableHeaderColumn>
                        </BootstrapTable>
                    </Row>
                </Panel>
            </Grid>
        );
    }
}

export default StudentsManagement;
