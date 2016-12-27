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
      TeachersStore.getTeachers().then((teachers) => {
          this.setState({teachers});
      });
    }

    onRowSelect = (row, isSelected, e) => {
        if (isSelected) {
            this.setState({
                selected: [
                    ...this.state.selected,
                    row.username
                ]
            });
        } else {
            this.setState({
                selected: this.state.selected.filter(it => it !== row.username)
            });
        }
    }

    onSelectAll = (isSelected, rows) => {
        if (isSelected) {
            this.setState({
                selected: rows.map((row) => row.username)
            });
        } else {
            this.setState({selected: []});
        }
    }

    onRowClick = (row) => {
      this.props.router.push(`/teacher/${row.username}`);
    }

    onDelete = () => {
        this.state.selected.forEach((teacherId) => TeachersStore.removeTeacher(teacherId));
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
                        <TableHeaderColumn isKey dataField='username'>Username</TableHeaderColumn>
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
