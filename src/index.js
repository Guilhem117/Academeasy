import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRedirect, hashHistory, withRouter} from 'react-router';

import LoginDialog from './LoginDialog';
import NavBar from './NavBar';
import MainPage from './MainPage';
import CoursesList from './CoursesList';
import CourseDetails from './CourseDetails';
import ProfileDetails from './ProfileDetails';
import StudentsManagement from './StudentsManagement';
import TeachersManagement from './TeachersManagement';

import App from './App';

import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import 'react-select/dist/react-select.css';

import './index.css';
import './TableManagement.css';

function redirectToLogin(nextState, replace) {
  if (!localStorage.profile) {
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
        <Route path="course/:courseId" components={{navBar: withRouter(NavBar), content: CourseDetails}}/>
        <Route path="students" components={{navBar: withRouter(NavBar), content: StudentsManagement}}/>
        <Route path="teachers" components={{navBar: withRouter(NavBar), content: TeachersManagement}}/>
        <Route path="profile" components={{navBar: withRouter(NavBar), content: ProfileDetails}}/>
    </Route>
    <Route path="/login" component={LoginDialog}/>
</Router>, document.getElementById('root'));
