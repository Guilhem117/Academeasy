const CalendarStore = {
    getCalendar: _ => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request('http://localhost:8081/api/calendar', {
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

    getEntry: (entryId) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`http://localhost:8081/api/calendar/${entryId}`, {
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

    updateEntry: (entry) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`http://localhost:8081/api/calendar/${entry.id}`, {
            credentials: 'include',
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(entry)
        });

        return fetch(request).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                return Promise.reject();
            }

        });
    },

    removeEntry: (entryId) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`http://localhost:8081/api/calendar/${entryId}`, {
            credentials: 'include',
            method: 'DELETE',
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

    addEntry: (entry) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`http://localhost:8081/api/calendar`, {
            credentials: 'include',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(entry)
        });

        return fetch(request).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                return Promise.reject();
            }

        });
    }
}

export default CalendarStore;
