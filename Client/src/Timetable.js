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
            courses: [],
            calendarView: localStorage.calendarView || 'month'
        }
    }

    componentWillMount() {
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

    onCalendarView = (view) => {
        localStorage.calendarView = view;
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

        return course.code;
    }

    onSelectSlot = (slotInfo) => {
        console.log(slotInfo);
        this.props.router.push(`/calendar/new?start=${slotInfo.start.getTime()}&end=${slotInfo.end.getTime()}`);
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
