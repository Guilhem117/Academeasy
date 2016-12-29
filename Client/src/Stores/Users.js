const UsersStore = {
    getAdmins: _ => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request('http://localhost:8081/api/users/admins', {
            credentials: 'include',
            method: 'GET',
            headers: headers
        });

        return fetch(request).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                return Promise.reject();
            }

        });

    },

    updateAdmin: (admin) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`http://localhost:8081/api/users/admins/${admin.username}`, {
            credentials: 'include',
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(admin)
        });

        return fetch(request).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                return Promise.reject();
            }

        });
    },

    addAdmin: (admin) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`http://localhost:8081/api/users/admins`, {
            credentials: 'include',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(admin)
        });

        return fetch(request).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                return Promise.reject();
            }
        });
    },

    loginUser: (username, password) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request('http://localhost:8081/api/users/login', {
            credentials: 'include',
            method: 'POST',
            headers: headers,
            body: JSON.stringify({username, password})
        });

        return fetch(request).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                return Promise.reject();
            }

        });
    },

    logoutUser: (username) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request('http://localhost:8081/api/users/logout', {
            credentials: 'include',
            method: 'POST',
            headers: headers,
            body: JSON.stringify({username})
        });

        return fetch(request).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                return Promise.reject();
            }

        });
    }
};

export default UsersStore;
