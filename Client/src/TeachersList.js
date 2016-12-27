import React, {Component} from 'react';
import {Grid, Panel, Row, Button} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import TeachersStore from './Stores/Teachers';

class TeachersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            teachers: []
        };

        this.selectRowProp = {
            mode: 'checkbox',
            clickToSelect: false,
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll
        };

    }

    componentWillMount() {
        TeachersStore.addListener(this.teachersStoreListener);
        this.teachersStoreListener();
    }
    componentWillUnmount() {
        TeachersStore.removeListener(this.teachersStoreListener);
    }

    teachersStoreListener = () => {
        this.setState({teachers: TeachersStore.getTeachers()});
    }

    onRowSelect = (row, isSelected, e) => {
        if (isSelected) {
            this.setState({
                selected: [
                    ...this.state.selected,
                    row.id
                ]
            });
        } else {
            this.setState({
                selected: this.state.selected.filter(it => it !== row.id)
            });
        }
    }

    onSelectAll = (isSelected, rows) => {
        if (isSelected) {
            this.setState({
                selected: rows.map((row) => row.id)
            });
        } else {
            this.setState({selected: []});
        }
    }

    onRowClick = (row) => {
      this.props.router.push(`/teacher/${row.id}`);
    }

    onDelete = () => {
        this.state.selected.forEach((teacherId) => TeachersStore.removeStudent(teacherId));
    }

    onAdd = () => {
        this.props.router.push('/teacher/new');
    }

    render() {
        return (
            <Grid className="table-background">
                <Panel header="Teachers list">
                  <Row>

                    <BootstrapTable data={this.state.teachers} options={{
                      onRowClick: this.onRowClick
                    }} remote selectRow={this.selectRowProp} search striped hover>
                        <TableHeaderColumn isKey dataField='id'>#</TableHeaderColumn>
                        <TableHeaderColumn dataField='login'>Login</TableHeaderColumn>
                        <TableHeaderColumn dataField='firstName'>First Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='lastName'>Last Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
                    </BootstrapTable>
                  </Row>
                  <Row>
                      <Button onClick={this.onAdd}>Add</Button>
                      <Button onClick={this.onDelete}>Delete</Button>
                  </Row>
                </Panel>
            </Grid>
        );
    }
}

export default TeachersList;
