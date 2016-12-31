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

const StudentsStore = {
    getStudents: (search) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const url = search
            ? `/api/students?search=${search}`
            : '/api/students';

        const request = new Request(url, {
            credentials: 'include',
            method: 'GET',
            headers: headers
        });

        return fetch(request).then(responseHandler);
    },

    getStudent: (username) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/students/${username}`, {
            credentials: 'include',
            method: 'GET',
            headers: headers
        });

        return fetch(request).then(responseHandler);
    },

    updateStudent: (student) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/students/${student.username}`, {
            credentials: 'include',
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(student)
        });

        return fetch(request).then(responseHandler);
    },

    removeStudent: (username) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/students/${username}`, {
            credentials: 'include',
            method: 'DELETE',
            headers: headers
        });

        return fetch(request).then(responseHandler);
    },

    addStudent: (student) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/students`, {
            credentials: 'include',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(student)
        });

        return fetch(request).then(responseHandler);
    },

    newPassword: (username) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/students/${username}/newpassword`, {
            credentials: 'include',
            method: 'GET',
            headers: headers
        });

        return fetch(request).then(responseHandler);
    },

    changePassword: (username, password, currentpassword) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/students/${username}/newpassword`, {
            credentials: 'include',
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({password,currentpassword})
        });

        return fetch(request).then(responseHandler);
    }

};

export default StudentsStore;
