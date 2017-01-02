import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Grid, Panel, Row, Button, ButtonToolbar} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import StudentsStore from './Stores/Students';
import YearsStore from './Stores/Years';

class StudentsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      students: [],
      years: []
    };

    this.selectRowProp = {
      mode: 'checkbox',
      clickToSelect: false,
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll
    };

  }

  componentWillMount() {
    Promise.all([YearsStore.getYears(), StudentsStore.getStudents()]).then((values) => {
      const [years,
        students] = values;
      this.setState({years, students});
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
    this.props.router.push(`/student/${row.username}`);
  }

  onDelete = () => {
    Promise.all(this.state.selected.map((studentId) => {
      return StudentsStore.removeStudent(studentId);
    })).then((results) => {
      return StudentsStore.getStudents();
    }, (err) => {
      return StudentsStore.getStudents();
    }).then((students) => {
      this.setState({students, selected: []});
    });
  }

  onAdd = () => {
    this.props.router.push('/student/new');
  }

  onSearchChange = (searchText, colInfos, multiColumnSearch) => {
    StudentsStore.getStudents(searchText).then((students) => {
      this.setState({students});
    });
  }

  render() {
    const yearsFilter = this.state.years.reduce((result, item) => {
      result[item] = item;
      return result;
    }, {});

    return (
      <Grid className="table-background">
        <Panel header={(
          <h3>Students</h3>
        )}>
          <Row>
            <BootstrapTable data={this.state.students} options={{
              onRowClick: this.onRowClick,
              onSearchChange: this.onSearchChange
            }} remote selectRow={this.selectRowProp} search striped hover>
              <TableHeaderColumn isKey dataField='username'>Username</TableHeaderColumn>
              <TableHeaderColumn dataField='firstName'>First Name</TableHeaderColumn>
              <TableHeaderColumn dataField='lastName'>Last Name</TableHeaderColumn>
              <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
              <TableHeaderColumn dataField='year' filter={yearsFilter}>Year</TableHeaderColumn>
            </BootstrapTable>
          </Row>
          <Row>
            <ButtonToolbar>
              <Button onClick={this.onAdd}>Add</Button>
              <Button onClick={this.onDelete}>Delete</Button>
            </ButtonToolbar>
          </Row>
        </Panel>
      </Grid>
    );
  }
}

export default withRouter(StudentsList);
