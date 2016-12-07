import React, {Component} from 'react';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: null,
            currentPage: null
        };
    }

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
