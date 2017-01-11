import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Grid, Panel, Row, Button, Glyphicon} from 'react-bootstrap';
import BigCalendar from 'react-big-calendar';
import TimetableEdit from './TimetableEdit';

import moment from 'moment';
import './Timetable.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import CalendarStore from './Stores/Calendar';
import CoursesStore from './Stores/Courses';

BigCalendar.momentLocalizer(moment);

class Timetable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      courses: [],
      calendarView: sessionStorage.calendarView || 'month'
    }
  }

  componentDidMount() {
    Promise.all([CoursesStore.getCourses(), CalendarStore.getCalendar()]).then((values) => {
      const [courses,
        events] = values;
      events.forEach((event) => {
        event.start = event.start
          ? new Date(event.start)
          : '';
        event.end = event.end
          ? new Date(event.end)
          : '';
        return event;
      });
      this.setState({events, courses});
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.params !== this.props.params) {
      Promise.all([CoursesStore.getCourses(), CalendarStore.getCalendar()]).then((values) => {
        const [courses,
          events] = values;
        events.forEach((event) => {
          event.start = event.start
            ? new Date(event.start)
            : '';
          event.end = event.end
            ? new Date(event.end)
            : '';
          return event;
        });
        this.setState({events, courses});
      });
    }
  }

  onCalendarView = (view) => {
    sessionStorage.calendarView = view;
    this.setState({calendarView: view});
  }

  entryStyler = (entry) => {
    const course = this.state.courses.find((c) => {
      return c.code === entry.course;
    });

    return {
      style: {
        backgroundColor: course.color
      }
    }
  }

  entryLabel = (entry) => {
    const course = this.state.courses.find((c) => {
      return c.code === entry.course;
    });

    return (course && course.label) || 'Unknown course';
  }

  onSelectSlot = (slotInfo) => {
    const {role} = sessionStorage;
    if (role === 'admin') {
      this.props.router.push(`/calendar/new?start=${slotInfo.start.getTime()}&end=${slotInfo.end.getTime()}`);
    }
  }

  onSelectEvent = (event) => {
    const {role} = sessionStorage;
    if (role === 'admin') {
      this.props.router.push(`/calendar/${event.id}`);
    }
  }

  render() {
    const {eventId} = this.props.params;

    const header = (
      <h3>
        <span>Courses timetable</span>
        <Button className="pull-right hidden-print" bsSize="small" onClick={window.print} style={{
          marginTop: '-8px'
        }}><Glyphicon glyph="print"/></Button>
      </h3>
    );

    return (
      <Grid className="table-background">
        <Panel header={header}>
          <Row className="my-calendar">
            <BigCalendar events={this.state.events} view={this.state.calendarView} onView={this.onCalendarView} timeslots={10} titleAccessor={this.entryLabel} selectable onSelectEvent={this.onSelectEvent} onSelectSlot={this.onSelectSlot} eventPropGetter={this.entryStyler}/>
          </Row>
          {eventId && <TimetableEdit entryId={eventId} {...this.props}/>}
        </Panel>
      </Grid>
    );
  }
};

export default withRouter(Timetable);
