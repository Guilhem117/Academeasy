const UsersStore = {
    loginUser: (username, password) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request('http://localhost:8081/api/users/login', {
            credentials: 'include',
            method: 'POST',
            headers: headers,
            body: JSON.stringify({username, password}),
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
