import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Grid, Panel, Row, Button, ButtonToolbar} from 'react-bootstrap';
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
    Promise.all(this.state.selected.map((teacherId) => {
      return TeachersStore.removeTeacher(teacherId);
    })).then((results) => {
      return TeachersStore.getTeachers();
    }, (err) => {
      return TeachersStore.getTeachers();
    }).then((teachers) => {
      this.setState({teachers, selected: []});
    });
  }

  onAdd = () => {
    this.props.router.push('/teacher/new');
  }

  onSearchChange = (searchText, colInfos, multiColumnSearch) => {
    TeachersStore.getTeachers(searchText).then((teachers) => {
      this.setState({teachers});
    });
  }

  render() {
    return (
      <Grid className="table-background">
        <Panel header={(
          <h3>Teachers</h3>
        )}>
          <Row>

            <BootstrapTable data={this.state.teachers} options={{
              onRowClick: this.onRowClick,
              onSearchChange: this.onSearchChange
            }} remote selectRow={this.selectRowProp} search striped hover>
              <TableHeaderColumn isKey dataField='username'>Username</TableHeaderColumn>
              <TableHeaderColumn dataField='firstName'>First Name</TableHeaderColumn>
              <TableHeaderColumn dataField='lastName'>Last Name</TableHeaderColumn>
              <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
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

export default withRouter(TeachersList);
