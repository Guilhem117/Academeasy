import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Grid, Row, Panel, Button, ButtonToolbar} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import moment from 'moment';

import AnnouncementsStore from './Stores/Announcements';

class AnnouncementsListAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      announcements: [],
      selected: []
    };

    this.selectRowProp = {
      mode: 'checkbox',
      clickToSelect: false,
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll
    };

  }

  componentDidMount() {
    AnnouncementsStore.getAnnouncements().then((announcements) => {
      this.setState({announcements});
    });
  }

  componentWillReceiveProps() {
    AnnouncementsStore.getAnnouncements().then((announcements) => {
      this.setState({announcements});
    });
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

  onRowClick = (row) => {
    this.props.router.push(`/announcement/${row.id}`);
  }

  onDelete = () => {
    Promise.all(this.state.selected.map((id) => {
      return AnnouncementsStore.removeAnnounce(id);
    })).then((results) => {
      return AnnouncementsStore.getAnnouncements();
    }, (err) => {
      return AnnouncementsStore.getAnnouncements();
    }).then((announcements) => {
      this.setState({announcements, selected: []});
    });

  }

  onAdd = () => {
    this.props.router.push('/announcement/new');
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

  render() {
    return (
      <Grid className="table-background">
        <Panel header="Announcements list">
          <Row>
            <BootstrapTable data={this.state.announcements} options={{
              onRowClick: this.onRowClick,
              onSearchChange: this.onSearchChange
            }} remote selectRow={this.selectRowProp} search striped hover>
              <TableHeaderColumn isKey dataField='id' hidden>#</TableHeaderColumn>
              <TableHeaderColumn dataField='start' width='150' dataFormat={(cell) => moment(cell).format('MMM Do hh:mm a')}>Start</TableHeaderColumn>
              <TableHeaderColumn dataField='end' width='150' dataFormat={(cell) => moment(cell).format('MMM Do hh:mm a')}>End</TableHeaderColumn>
              <TableHeaderColumn dataField='text'>Text</TableHeaderColumn>
              <TableHeaderColumn dataField='courses' width='100'>Courses</TableHeaderColumn>
              <TableHeaderColumn dataField='teachers' width='100'>Teachers</TableHeaderColumn>
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

export default withRouter(AnnouncementsListAdmin);
