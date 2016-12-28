import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRedirect, hashHistory, withRouter} from 'react-router';

import LoginDialog from './LoginDialog';
import NavBar from './NavBar';
import MainPage from './MainPage';
import CoursesList from './CoursesList';
import CourseDetails from './CourseDetails';
import ProfileDetails from './ProfileDetails';
import TeachersList from './TeachersList';
import TeacherDetails from './TeacherDetails';
import StudentsList from './StudentsList';
import StudentDetails from './StudentDetails';
import Timetable from './Timetable';

import App from './App';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-select/dist/react-select.css';

import './index.css';
import './TableManagement.css';

function redirectToLogin(nextState, replace) {
  if (!localStorage.role) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

ReactDOM.render(
    <Router history={hashHistory}>
    <Route path="/" component={withRouter(App)} onEnter={redirectToLogin}>
        <IndexRedirect to="home" />
        <Route path="home" components={{navBar: withRouter(NavBar), content: MainPage}}/>
        <Route path="courses" components={{navBar: withRouter(NavBar), content: CoursesList}}/>
        <Route path="course/:courseCode" components={{navBar: withRouter(NavBar), content: withRouter(CourseDetails)}}/>
        <Route path="students" components={{navBar: withRouter(NavBar), content: withRouter(StudentsList)}}/>
        <Route path="student/:studentId" components={{navBar: withRouter(NavBar), content: withRouter(StudentDetails)}}/>
        <Route path="teachers" components={{navBar: withRouter(NavBar), content: withRouter(TeachersList)}}/>
        <Route path="teacher/:teacherId" components={{navBar: withRouter(NavBar), content: withRouter(TeacherDetails)}}/>
        <Route path="profile" components={{navBar: withRouter(NavBar), content: ProfileDetails}}/>
        <Route path="calendar" components={{navBar: withRouter(NavBar), content: withRouter(Timetable)}}/>
        <Route path="calendar/:eventId" components={{navBar: withRouter(NavBar), content: withRouter(Timetable)}}/>
    </Route>
    <Route path="/login" component={LoginDialog}/>
</Router>, document.getElementById('root'));
