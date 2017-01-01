import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Grid, Row, Panel, Button, ButtonToolbar} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import CoursesStore from './Stores/Courses';

class CoursesListAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      selected: []
    };

    this.selectRowProp = {
      mode: 'checkbox',
      clickToSelect: false,
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll
    };

  }

  componentWillMount() {
    CoursesStore.getCourses().then((courses) => {
      this.setState({courses});
    });
  }

  onRowSelect = (row, isSelected, e) => {
    if (isSelected) {
      this.setState({
        selected: [
          ...this.state.selected,
          row.code
        ]
      });
    } else {
      this.setState({
        selected: this.state.selected.filter(it => it !== row.code)
      });
    }
  }

  onRowClick = (row) => {
    this.props.router.push(`/course/${row.code}`);
  }

  onDelete = () => {
    Promise.all(this.state.selected.map((course) => {
      return CoursesStore.removeCourse(course);
    })).then((results) => {
      return CoursesStore.getCourses();
    }, (err) => {
      return CoursesStore.getCourses();
    }).then((courses) => {
      this.setState({courses, selected: []});
    });
  }

  onAdd = () => {
    this.props.router.push('/course/new');
  }

  onSelectAll = (isSelected, rows) => {
    if (isSelected) {
      this.setState({
        selected: rows.map((row) => row.code)
      });
    } else {
      this.setState({selected: []});
    }
  }

  onSearchChange = (searchText, colInfos, multiColumnSearch) => {
    CoursesStore.getCourses(searchText).then((courses) => {
      this.setState({courses});
    });
  }

  render() {
    return (
      <Grid className="table-background">
        <Panel header="Courses list">
          <Row>
            <BootstrapTable data={this.state.courses} options={{
              onRowClick: this.onRowClick,
              onSearchChange: this.onSearchChange
            }} remote selectRow={this.selectRowProp} search striped hover>
              <TableHeaderColumn isKey dataField='code'>Code</TableHeaderColumn>
              <TableHeaderColumn dataField='label'>Label</TableHeaderColumn>
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

export default withRouter(CoursesListAdmin);
