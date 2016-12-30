import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {
    Grid,
    Panel,
    Row,
    Col,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import QrReader from 'react-qr-reader';
import moment from 'moment';

import CalendarStore from './Stores/Calendar';
import StudentsStore from './Stores/Students';

class StudentsScan extends Component {
    constructor(props) {
        super(props)
        this.state = {
            students: [],
            calendarEntries: []
        }
    }

    componentWillMount = () => {
        CalendarStore.getCalendar(20).then((calendarEntries) => {
            this.setState({calendarEntries});
        })
    }

    handleScan = (data) => {
        this.setState((prevState, props) => {
            const {students} = prevState;
            if (!students.includes(data)) {
                students.push(data);
            }
            return {students};
        });
    }

    onRowClick = (row) => {
        this.props.router.push(`/scan/${row.id}`);
    }

    handleError = (err) => {}

    render() {
        const {eventId} = this.props.params;

        if (eventId) {
            return (
                <Grid className="table-background">
                    <Panel header="Scan students">
                        <Row>
                            <QrReader previewStyle={{
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: 320,
                                height: 240
                            }} handleScan={this.handleScan} handleError={this.handleError}/>
                        </Row>
                        <Row>
                            <Col smOffset={4} sm={4}>
                                <h4>Scanned students :</h4>
                                <ListGroup>
                                    {this.state.students.map((student, idx) => {
                                        return <ListGroupItem key={idx}>{student}</ListGroupItem>
                                    })}
                                </ListGroup>
                            </Col>
                        </Row>
                    </Panel>
                </Grid>
            );
        } else {
            return (
                <Grid className="table-background">
                    <Panel header="Courses list">
                        <Row>
                            <BootstrapTable data={this.state.calendarEntries} options={{
                                onRowClick: this.onRowClick,
                                onSearchChange: this.onSearchChange
                            }} remote search striped hover>
                                <TableHeaderColumn isKey hidden dataField='id'/>
                                <TableHeaderColumn dataField='course'>Course</TableHeaderColumn>
                                <TableHeaderColumn dataField='teacher'>Teacher</TableHeaderColumn>
                                <TableHeaderColumn dataField='start' dataFormat={(cell) => moment(cell).format('MMM Do hh:mm a')}>Start</TableHeaderColumn>
                                <TableHeaderColumn dataField='end' dataFormat={(cell) => moment(cell).format('MMM Do hh:mm a')}>Start</TableHeaderColumn>
                            </BootstrapTable>
                        </Row>
                    </Panel>
                </Grid>
            );
        }
    }

}

export default withRouter(StudentsScan);
