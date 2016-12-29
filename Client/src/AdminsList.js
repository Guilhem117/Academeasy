import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {
    Grid,
    Row,
    Col,
    Panel,
    Button,
    Modal,
    Form,
    FormGroup,
    FormControl,
    ButtonToolbar,
    ControlLabel
} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import ChangePasswordDialog from './ChangePasswordDialog';

import UsersStore from './Stores/Users';

class AdminsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            admins: [],
            selectedAdmin: '',
            newusername: '',
            showAddDialog: false
        };

        this.selectRowProp = {
            mode: 'checkbox',
            clickToSelect: false,
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll
        };

    }

    componentWillMount() {
        UsersStore.getAdmins().then((admins) => {
            this.setState({admins});
        });
    }

    onChange = (valueName) => {
        return (event) => {
            const {value} = event.target;
            this.setState({[valueName]: value});
        }
    }

    onAddButton = _ => {
        this.setState({showAddDialog: true});
    }

    onCancelPassword = _ => {
        this.setState({selectedAdmin: ''});
    }

    onChangePassword = (value) => {
        const admin = {
            username: this.state.selectedAdmin,
            password: value.newpassword
        };
        UsersStore.updateAdmin(admin).then(_ => {
            this.setState({selectedAdmin: ''});
        });
    }

    onAddAdmin = _ => {
        const admin = {
            username: this.state.newusername,
            password: this.state.newpassword
        };

        UsersStore.addAdmin(admin).then(_ => {
            this.setState({showAddDialog: false, newusername: '', newpassword: ''});
        });

    }

    onCancelAdd = _ => {
        this.setState({showAddDialog: false, newusername: '', newpassword: ''});
    }

    onRowClick = (row) => {
        this.setState({selectedAdmin: row.username});
    }

    addAdminDialog = _ => {
        return (
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title style={{
                        textAlign: 'center'
                    }}>Add admin</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Username
                            </Col>
                            <Col sm={9}>
                                <FormControl type="text" placeholder="Username" value={this.state.newusername} onChange={this.onChange('newusername')}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Password
                            </Col>
                            <Col sm={9}>
                                <FormControl type="password" placeholder="Password" value={this.state.newpassword} onChange={this.onChange('newpassword')}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={3} sm={9}>
                                <ButtonToolbar>
                                    <Button onClick={this.onAddAdmin} disabled={!this.state.newusername}>Add</Button>
                                    <Button onClick={this.onCancelAdd}>Cancel</Button>
                                </ButtonToolbar>
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
            </Modal.Dialog>
        );
    }

    render() {
        return (
            <Grid className="table-background">
                {this.state.selectedAdmin && <ChangePasswordDialog onConfirm={this.onChangePassword} onCancel={this.onCancelPassword}/>}
                {this.state.showAddDialog && this.addAdminDialog()}
                <Panel header="Admins list">
                    <Row>
                        <BootstrapTable data={this.state.admins} options={{
                            onRowClick: this.onRowClick
                        }} remote selectRow={this.selectRowProp} search striped hover>
                            <TableHeaderColumn isKey dataField='username'>Username</TableHeaderColumn>
                        </BootstrapTable>
                    </Row>
                    <Row>
                        <Button onClick={this.onAddButton}>Add</Button>
                        <Button onClick={this.onDeleteButton}>Delete</Button>
                    </Row>
                </Panel>
            </Grid>
        );
    }
}

export default withRouter(AdminsList);
