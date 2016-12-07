import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory, withRouter} from 'react-router';

import LoginDialog from './LoginDialog';
import NavBar from './NavBar';
import MainPage from './MainPage';
import CoursesManagement from './CoursesManagement';

import App from './App';
import './index.css';

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
        <IndexRoute components={{navBar: withRouter(NavBar), content: MainPage}}/>
        <Route path="courses" components={{navBar: withRouter(NavBar), content: CoursesManagement}}/>
    </Route>
    <Route path="/login" component={LoginDialog}/>
</Router>, document.getElementById('root'));
