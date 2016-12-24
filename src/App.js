import React, {Component} from 'react';

class App extends Component {

    render() {
        const {navBar, content} = this.props;
        return (
            <div>
                {navBar}
                {content}
            </div>
        );
    }
}

export default App;
