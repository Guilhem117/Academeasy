import Alerts from '../Alerts';

const responseHandler = (resp) => {
    return resp.json().then((decoded) => {
        const {success, error, warning, info} = decoded;
        if (typeof(success) === 'string') {
            Alerts.showSuccess(success);
        }
        if (typeof(error) === 'string') {
            Alerts.showError(error);
        }
        if (typeof(warning) === 'string') {
            Alerts.showWarning(warning);
        }
        if (typeof(info) === 'string') {
            Alerts.showInfo(info);
        }

        if (resp.ok) {
            return decoded;
        } else {
            if (!error) {
                Alerts.showError('Unknown error');
            }
        }
    }, (err) => {
        Alerts.showError(`System error : ${err}`);
    });
}

const UsersStore = {
    getAdmins: _ => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request('/api/users/admins', {
            credentials: 'include',
            method: 'GET',
            headers: headers
        });

        return fetch(request).then(responseHandler);
    },

    getSession: _ => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request('/api/users/session', {
            credentials: 'include',
            method: 'GET',
            headers: headers
        });

        return fetch(request).then(responseHandler);
    },

    updateAdmin: (admin) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/users/admins/${admin.username}`, {
            credentials: 'include',
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(admin)
        });

        return fetch(request).then(responseHandler);
    },

    addAdmin: (admin) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/users/admins`, {
            credentials: 'include',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(admin)
        });

        return fetch(request).then(responseHandler);
    },

    loginUser: (username, password, remember) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request('/api/users/login', {
            credentials: 'include',
            method: 'POST',
            headers: headers,
            body: JSON.stringify({username, password, remember})
        });

        return fetch(request).then(responseHandler);
    },

    logoutUser: (username) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request('/api/users/logout', {
            credentials: 'include',
            method: 'POST',
            headers: headers,
            body: JSON.stringify({username})
        });

        return fetch(request).then(responseHandler);
    }
};

export default UsersStore;
