import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import {
  Button,
  Panel,
  Glyphicon,
  FormControl,
  Tabs,
  Tab,
  Well,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';

import Alerts from './Alerts';
import './ChatReact.css';

class ChatReact extends Component {

  constructor(props) {
    super(props);
    this.state = {
      webSocket: '',
      wsUri: "ws://localhost:1234",
      pseudo: '',
      id: '',
      conflist: [],
      userlist: [],
      newConf: '',
      message: '',
      selectedUser: [],
      allMessage: [],
      isConnected: false,
      isLeader: false,
      isVisible: false
    };
  }

  componentDidMount = () => {
    const {username} = sessionStorage;
    if (username) {
      var websocket = new WebSocket(this.state.wsUri);
      this.setState({websocket, pseudo: username});
      websocket.onopen = this.onIdentification;
      websocket.onmessage = this.onMessageReceived;
      websocket.onclose = this.onClose;
    }
  }

  onClose = (event) => {
    if (event.code === 1000) {
      Alerts.showInfo('Chat disconnected');
    } else {
      Alerts.showError('Chat error');
    }
    this.setState({
      webSocket: '',
      wsUri: "ws://localhost:1234",
      pseudo: '',
      id: '',
      conflist: [],
      userlist: [],
      newConf: '',
      message: '',
      selectedUser: [],
      allMessage: [],
      isConnected: false,
      isLeader: false
    });
  }

  onIdentification = (event) => {
    var websocket = this.state.websocket;
    var id = Math.random().toString().substr(2, 8);
    var messageSend = "SID " + id + this.state.pseudo;
    console.log("identification : " + messageSend);
    websocket.send(messageSend);
    this.setState({isConnected: true, id});
  }

  onDisconnection = (event) => {
    var websocket = this.state.websocket;
    var messageSend = "DECO" + this.state.id;
    console.log("deconnection : " + messageSend);
    websocket.send(messageSend);
    //websocket.close();
    this.setState({websocket: '', isConnected: false});

  }

  onMessageSend = (conf) => {
    return (event) => {
      var websocket = this.state.websocket;
      var messageSend = "MESS" + conf + this.state.message;
      var message = {};
      message.conferance = conf;
      message.pseudo = this.state.pseudo;
      message.content = this.state.message;

      console.log("messageSend : " + messageSend);
      websocket.send(messageSend);

      this.setState((prevState, props) => {
        const {allMessage} = prevState;
        allMessage.push(message);
        return {allMessage: allMessage, message: ''};
      });
    }
  }

  onAddUserConf = (conf) => {
    return (event) => {
      var websocket = this.state.websocket;
      var messageSend = "ACON" + conf + this.state.selectedUser;
      console.log("ACON : " + messageSend);
      websocket.send(messageSend);
    }
  }

  onRemoveUserConf = (conf) => {
    return (event) => {
      var websocket = this.state.websocket;
      var messageSend = "RCON" + conf + this.state.selectedUser;
      console.log("RCON : " + messageSend);
      websocket.send(messageSend);
    }
  }

  onNewConferanceSend = (event) => {
    if (this.state.pseudo !== "") {
      var websocket = this.state.websocket;
      this.setState({isLeader: true, newConf: ''});
      websocket.send("NCON " + this.state.newConf);
    }
  }

  onPromoteNewConfLeader = (conf) => {
    return (event) => {
      var websocket = this.state.websocket;
      var messageSend = "SCL " + conf + this.state.selectedUser;
      console.log("SCL : " + messageSend);
      websocket.send(messageSend);
    }
  }

  onChange = (valueName) => {
    return (event) => {
      const {value} = event.target;
      this.setState({[valueName]: value});
    }
  }

  onMessageReceived = (event) => {
    var type = event.data.substr(0, 4);
    var data = event.data.substr(4, event.length);
    switch (type) {
      case "SLC ":
        this.receiveUserListFromServer(data);
        break;
      case "NCON":
        console.log("NCON " + data);
        break;
      case "RCON":
        this.receiveLeaveConferanceFromServer(data);
        break;
      case "MESS":
        this.receiveMessageFromServer(data);
        break;
      case "INFO":
        console.log("INFO " + data);
        break;
      case "OK  ":
        console.log("OK " + data);
        break;
      case "MCON":
        this.receiveConferanceFromServer(data);
        break;
      default:
        break;
    }
  }

  receiveUserListFromServer = (data) => {
    console.log("SLC" + data);
    var parse = JSON.parse(data);
    this.setState({userlist: parse});
  }

  receiveLeaveConferanceFromServer = (data) => {
    console.log("RCON " + data);

    this.setState((prevState, props) => {
      var list = prevState.conflist;
      var i = this.getIndex(data, list, "conferance");
      list[i] = "";

      return {conflist: list};
    });
  }

  receiveConferanceFromServer = (data) => {
    console.log("MCON " + data);
    this.setState((prevState, props) => {
      var parse = JSON.parse(data);
      var conflist = prevState.conflist;
      var index = this.getIndex(parse.conferance, conflist, 'conferance');
      if (index === -1) {
        conflist.push(parse);
      } else {
        conflist[index] = parse;
      }
      return {conflist: conflist, isLeader: parse.leader};
    });
  }

  receiveMessageFromServer = (data) => {
    console.log("MESS " + data);
    this.setState((prevState, props) => {
      var parse = JSON.parse(data);
      var allMessage = this.state.allMessage;
      var message = {};
      message.conferance = parse.conferance;
      message.pseudo = parse.pseudo;
      message.content = parse.message;
      allMessage.push(message);
      return ({allMessage});
    });
  }

  getIndex = (value, arr, prop) => {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }

  changeVisibility = (event) => {
    this.setState((prevState, props) => {
      return {
        isVisible: !prevState.isVisible
      };
    })
  }

  generateAllTabPanelTab = (val) => {
    return this.state.conflist.map(val);
  }

  generateTabChat = (tab) => {
    return <Tab key={tab.conferance} eventKey={tab.conferance} title={tab.titre}>
      <Well>
        connected user:{this.generateSelectListUsers(tab.utilisateur)}
        {this.state.isLeader && tab.leader
          ? <div>
              <Button bsSize="xsmall" bsStyle="link" onClick={this.onRemoveUserConf(tab.conferance)}>
                remove user
              </Button>
              <Button bsSize="xsmall" bsStyle="link" onClick={this.onPromoteNewConfLeader(tab.conferance)}>
                promote
              </Button>
              <p>
                {this.generateSelectListUsers(this.state.userlist)}
                <Button bsSize="xsmall" bsStyle="link" onClick={this.onAddUserConf(tab.conferance)}>
                  Add users
                </Button>
              </p>
            </div>
          : <div/>
}
        <Scrollbars style={{
          height: '200px'
        }}>
          <ListGroup>
            {this.generateAllConfMessage(this.state.allMessage, tab.conferance)}
          </ListGroup>
        </Scrollbars>
        <FormControl type="text" className="message-input" value={this.state.message} onChange={this.onChange("message")}/>
        <Button bsSize="xsmall" bsStyle="link" onClick={this.onMessageSend(tab.conferance)}><Glyphicon bsSize="xsmall" glyph="send"/></Button>
      </Well>
    </Tab>;
  }

  generateAllConfMessage = (messages, conferance) => {
    var confmessage = [];
    confmessage = messages.filter(val => val.conferance === conferance);
    return confmessage.map(this.generateMessage);
  }

  generateMessage = (message, index) => {
    const isMe = message.pseudo === this.state.pseudo;
    return <ListGroupItem className={isMe
      ? "me"
      : "other"} key={index}>
      <div className="msg">
        <p>{message.content}</p>
        <p>
          <small>{message.pseudo}</small>
        </p>
      </div>
    </ListGroupItem>;
  }

  generateSelectListUsers = (users) => {
    return <FormControl componentClass="select" value={this.state.value} onChange={this.onChange("selectedUser")}>
    <option>All user</option>;
    {users.map(this.generateOptionUser)}
    </FormControl>;
  }

  generateOptionUser = (user) => {
    return <option key={user.id} value={user.id}>{user.pseudo}</option>;
  }

  generateUlListUsers = (users) => {
    return <ul>
    {users.map(this.generateLiUser)}
    </ul>;
  }

  generateLiUser = (user) => {
    return <li key={user.id}>{user.pseudo}</li>;
  }

  render() {
    const chatBar = <div>Chat<Glyphicon glyph={this.state.isVisible
      ? "chevron-down"
      : "chevron-up"} className="pull-right" onClick={this.changeVisibility}/>
    </div>;

    return (
      <div className="chat no-print">
        {this.state.isConnected && <Panel header={chatBar} bsStyle="primary" style={{
          width: '300px'
        }} collapsible expanded={this.state.isVisible}>
          <div>
            <Tabs id="rooms-tabs">
              {this.generateAllTabPanelTab(this.generateTabChat)}
            </Tabs>
            <FormControl type="text" className="conferance-input" value={this.state.newConf} onChange={this.onChange('newConf')}/>
            <Button onClick={this.onNewConferanceSend} bsSize="xsmall" bsStyle="link">new conferance</Button>
          </div>
        </Panel>}
      </div>
    );
  }

}

export default ChatReact;
