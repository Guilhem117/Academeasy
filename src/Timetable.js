import React, {Component} from 'react';
import {Grid, Panel, Row} from 'react-bootstrap';
import BigCalendar from 'react-big-calendar';
import TimetableEdit from './TimetableEdit';

import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import CalendarStore from './Stores/Calendar';
import CoursesStore from './Stores/Courses';

BigCalendar.momentLocalizer(moment);

class Timetable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            calendarView: localStorage.calendarView || 'month'
        }
        this.courses = CoursesStore.getCourses();
    }

    componentWillMount() {
        CalendarStore.addListener(this.calendarStoreListener);
        this.calendarStoreListener();
    }

    componentWillUnmount() {
        CalendarStore.removeListener(this.calendarStoreListener);
    }

    calendarStoreListener = () => {
        this.setState({events: CalendarStore.getCalendar()});
    }

    onCalendarView = (view) => {
      localStorage.calendarView = view;
      this.setState({calendarView: view});
    }

    entryStyler = (entry) => {
        const course = this.courses.find((c) => {
            return c.id === entry.course;
        });

        return {
            style: {
                backgroundColor: course.color
            }
        }
    }

    entryLabel = (entry) => {
      const course = this.courses.find((c) => {
          return c.id === entry.course;
      });

      return course.code;
    }

    onSelectSlot = (slotInfo) => {
      this.props.router.push(`/calendar/new`);
    }

    onSelectEvent = (event) => {
      this.props.router.push(`/calendar/${event.id}`);
    }

    render() {
        const {eventId} = this.props.params;

        return (
            <Grid className="table-background">
                <Panel header="Courses timetable">
                    <Row style={{
                        height: '500px'
                    }}>
                        <BigCalendar events={this.state.events} view={this.state.calendarView} onView={this.onCalendarView} timeslots={10} titleAccessor={this.entryLabel} selectable onSelectEvent={this.onSelectEvent} onSelectSlot={this.onSelectSlot} eventPropGetter={this.entryStyler}/>
                    </Row>
                    {eventId && <TimetableEdit entryId={eventId} {...this.props}/>}
                </Panel>
            </Grid>
        );
    }
};

export default Timetable;
