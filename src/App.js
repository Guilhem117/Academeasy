import React, {Component} from 'react';

import LoginDialog from './LoginDialog';
import NavBar from './NavBar';
import MainPage from './MainPage';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: null,
            currentPage: null
        };
    }

    onLogin = (loginData) => {
        this.setState({profile: 'login'});
    }

    onChangePage = (page) => {
        this.setState({currentPage: page});
    }

    render() {
        var pageComponent;
        if (this.state.profile) {
            switch (this.state.currentPage) {
                case 'Home':
                    pageComponent = <HomePage/>
                    break;
                default:
                    pageComponent = <MainPage/>
            }
        } else {
            pageComponent = <LoginDialog onLogin={this.onLogin}/>;
        }

        return (
            <div>
                <NavBar profile={this.state.profile} onChangePage={this.onChangePage}/> {pageComponent}
            </div>
        );
    }
}

export default App;
