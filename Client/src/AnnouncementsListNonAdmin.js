import React, {Component} from 'react';
import {Grid, Panel, ListGroup, ListGroupItem, Checkbox} from 'react-bootstrap';

import AnnouncementsStore from './Stores/Announcements';

class AnnouncementsListNonAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      announcements: [],
      mycourses: true
    };

  }

  componentWillMount() {
    AnnouncementsStore.getAnnouncements(this.state.mycourses).then((announcements) => {
      this.setState({announcements});
    });
  }

  componentWillReceiveProps() {
    AnnouncementsStore.getAnnouncements(this.state.mycourses).then((announcements) => {
      this.setState({announcements});
    });
  }

  onChangeMyCourses = (event) => {
    const {checked} = event.target;
    AnnouncementsStore.getAnnouncements(checked).then((announcements) => {
      this.setState({announcements, mycourses: checked});
    });
  }

  render() {
    return (
      <Grid className="table-background">
        <Panel header="Announcements">
          <Checkbox checked={this.state.mycourses} onChange={this.onChangeMyCourses}>
            Only for my courses
          </Checkbox>
          {(this.state.announcements && this.state.announcements.length > 0)
            ? <ListGroup>
                {this.state.announcements.map((announcement) => {
                  const {courses} = announcement;
                  return (
                    <ListGroupItem key={announcement.id}>
                      <strong>{courses.join(', ')}</strong>: {announcement.text}
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
            : <h3>No Announcement</h3>}
        </Panel>
      </Grid>

    );
  }
}

export default AnnouncementsListNonAdmin;
