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
            events: []
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

    eventStyler = (event) => {
        const course = this.courses.find((c) => {
            return c.id === event.course;
        });

        return {
            style: {
                backgroundColor: course.color
            }
        }
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
                        <BigCalendar events={this.state.events} timeslots={10} titleAccessor='course' selectable onSelectEvent={this.onSelectEvent} onSelectSlot={this.onSelectSlot} eventPropGetter={this.eventStyler}/>
                    </Row>
                    {eventId && <TimetableEdit entryId={eventId} {...this.props}/>}
                </Panel>
            </Grid>
        );
    }
};

export default Timetable;
