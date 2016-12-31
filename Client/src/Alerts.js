import React, {Component} from 'react';
import {ToastContainer, ToastMessage} from 'react-toastr';

class Alerts {
    constructor() {
        this.containers = [];
    }

    registerContainer = (container) => {
        if (this.containers.indexOf(container) < 0) {
            this.containers.push(container);
        }
    }

    unregisterContainer = (container) => {
        const pos = this.containers.indexOf(container);
        if (pos > -1) {
            this.containers[pos] = undefined;
        }
    }

    showInfo = (message) => {
        this.containers.forEach((container) => {
            container.info(message);
        });
    }

    showError = (message) => {
        this.containers.forEach((container) => {
            container.error(message);
        });
    }

    showSuccess = (message) => {
        this.containers.forEach((container) => {
            container.success(message);
        });
    }

    showWarning = (message) => {
        this.containers.forEach((container) => {
            container.warning(message);
        });
    }
}

const instance = new Alerts();
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

export class ReactAlert extends Component {
    componentDidMount() {
        instance.registerContainer(this.refs.container);
    }

    componentWillUnmount() {
        instance.unregisterContainer(this.refs.container);
    }

    render() {
        return (<ToastContainer toastMessageFactory={ToastMessageFactory} ref="container" {...this.props}/>);
    }
}

export default instance;
