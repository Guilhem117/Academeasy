import React, {Component} from 'react';
import {Grid, Panel, Row, Button} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import StudentsStore from './Stores/Students';
import YearsStore from './Stores/Years';

class StudentsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: [],
            students: []
        };

        this.selectRowProp = {
            mode: 'checkbox',
            clickToSelect: false,
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll
        };

    }

    componentWillMount() {
        StudentsStore.addListener(this.studentsStoreListener);
        this.studentsStoreListener();
    }
    
    componentWillUnmount() {
        StudentsStore.removeListener(this.studentsStoreListener);
    }

    studentsStoreListener = () => {
        this.setState({students: StudentsStore.getStudents()});
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
      this.props.router.push(`/student/${row.id}`);
    }

    onDelete = () => {
        this.state.selected.forEach((studentId) => StudentsStore.removeStudent(studentId));
    }

    onAdd = () => {
        this.props.router.push('/student/new');
    }

    render() {
        const yearsFilter = YearsStore.getYears().reduce((result, item) => {
            result[item] = item;
            return result;
        }, {});

        return (
            <Grid className="table-background">
                <Panel header="Students list">
                    <Row>
                        <BootstrapTable data={this.state.students} options={{
                            onRowClick: this.onRowClick
                        }} remote selectRow={this.selectRowProp} search striped hover>
                            <TableHeaderColumn dataField='id' isKey autoValue>#</TableHeaderColumn>
                            <TableHeaderColumn dataField='login'>Login</TableHeaderColumn>
                            <TableHeaderColumn dataField='firstName'>First Name</TableHeaderColumn>
                            <TableHeaderColumn dataField='lastName'>Last Name</TableHeaderColumn>
                            <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
                            <TableHeaderColumn dataField='year' filter={yearsFilter}>Year</TableHeaderColumn>
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

export default StudentsList;
