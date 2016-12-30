import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRedirect, hashHistory} from 'react-router';

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
import AnnouncementsList from './AnnouncementsList';
import AnnouncementDetails from './AnnouncementDetails';
import Timetable from './Timetable';
import AdminsList from './AdminsList';

import App from './App';

import UsersStore from './Stores/Users';

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'react-select/dist/react-select.css';

import './index.css';
import './TableManagement.css';

function redirectToLogin(nextState, replace, callback) {
    UsersStore.getSession().then((session) => {
        let {role, username} = session;
        if (role && username) {
            sessionStorage.role = role;
            sessionStorage.username = username;
        } else {
            return Promise.reject();
        }
    }).then(_ => {
        callback();
    }).catch(_ => {
        replace('/login');
        callback();
    });
}

ReactDOM.render(
    <Router history={hashHistory}>
    <Route path="/" component={App} onEnter={redirectToLogin}>
        <IndexRedirect to="home"/>
        <Route path="home" components={{
            navBar: NavBar,
            content: MainPage
        }}/>
        <Route path="courses" components={{
            navBar: NavBar,
            content: CoursesList
        }}/>
        <Route path="course/:courseCode" components={{
            navBar: NavBar,
            content: CourseDetails
        }}/>
        <Route path="students" components={{
            navBar: NavBar,
            content: StudentsList
        }}/>
        <Route path="student/:studentId" components={{
            navBar: NavBar,
            content: StudentDetails
        }}/>
        <Route path="teachers" components={{
            navBar: NavBar,
            content: TeachersList
        }}/>
        <Route path="teacher/:teacherId" components={{
            navBar: NavBar,
            content: TeacherDetails
        }}/>
        <Route path="profile" components={{
            navBar: NavBar,
            content: ProfileDetails
        }}/>
        <Route path="calendar" components={{
            navBar: NavBar,
            content: Timetable
        }}/>
        <Route path="calendar/:eventId" components={{
            navBar: NavBar,
            content: Timetable
        }}/>
        <Route path="announcements" components={{
            navBar: NavBar,
            content: AnnouncementsList
        }}/>
        <Route path="announcement/:announceId" components={{
            navBar: NavBar,
            content: AnnouncementDetails
        }}/>
        <Route path="admin" components={{
            navBar: NavBar,
            content: AdminsList
        }}/>
    </Route>
    <Route path="/login" component={LoginDialog}/>
</Router>, document.getElementById('root'));
