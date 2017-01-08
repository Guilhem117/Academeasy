import React, {Component} from 'react';
import ChatReact from './ChatReact';

class App extends Component {

  render() {
    const {navBar, content} = this.props;
    return (
      <div>
        {navBar}
        {content}
        <ChatReact/>
      </div>
    );
  }
}

export default App;
