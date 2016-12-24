import React, {Component} from 'react';
import {Grid, Panel, Row} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import TeacherDetails from './TeacherDetails';

class TeachersManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teachers: [
                {
                    id: 1,
                    login: 'azighmi',
                    firstName: 'Amira',
                    lastName: 'Zighmi',
                    email: 'amirazighmi@yahoo.com',
                    courses: []
                }, {
                    id: 2,
                    login: 'toto',
                    firstName: 'Toto',
                    lastName: 'Lala',
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

    updateTeacher = (teacher) => {
        this.setState((prevState, props) => {
            let index = prevState.teachers.findIndex(s => s.id === teacher.id);
            if (index > -1) {
                prevState.teachers[index] = teacher;
                return {teachers: prevState.teachers};
            }
        });
    }

    sendPassword = (student) => {
      console.log('Send password to ', student.email);
    }


    detailsComponent = (teacher) => {
      return (<TeacherDetails courses={this.state.courses} teacher={teacher} onChange={this.updateTeacher} onSendPassword={this.sendPassword}/>);
    }

    render() {
        return (
            <Grid className="table-background">
                <Panel header="Teachers list">
                  <Row>

                    <BootstrapTable data={this.state.teachers} options={{
                        expandRowBgColor: 'rgb(242, 255, 163)'
                    }} expandableRow={(row) => true} expandComponent={this.detailsComponent} search={true} striped hover>
                        <TableHeaderColumn isKey dataField='id'>#</TableHeaderColumn>
                        <TableHeaderColumn dataField='login'>Login</TableHeaderColumn>
                        <TableHeaderColumn dataField='firstName'>First Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='lastName'>Last Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
                    </BootstrapTable>
                  </Row>
                </Panel>
            </Grid>
        );
    }
}

export default TeachersManagement;
