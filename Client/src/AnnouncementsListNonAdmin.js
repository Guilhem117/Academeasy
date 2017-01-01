import React, {Component} from 'react';
import {Grid, Panel, ListGroup, ListGroupItem} from 'react-bootstrap';

import AnnouncementsStore from './Stores/Announcements';

class AnnouncementsListNonAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      announcements: []
    };

  }

  componentWillMount() {
    AnnouncementsStore.getAnnouncements().then((announcements) => {
      this.setState({announcements});
    });
  }

  componentWillReceiveProps() {
    AnnouncementsStore.getAnnouncements().then((announcements) => {
      this.setState({announcements});
    });
  }

  render() {
    return (
      <Grid className="table-background">
        <Panel header="Announcements">
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
