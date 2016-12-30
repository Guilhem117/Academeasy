const AnnouncementsStore = {
    getAnnouncements: (maxEntries) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const query = maxEntries ? `?count=${maxEntries}` : '';

        const request = new Request(`/api/announcements${query}`, {
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

    getAnnouncementsForCourse: (courseCode, maxEntries) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const courseQuery = `?course=${courseCode}`
        const query = maxEntries ? `${courseQuery}&count=${maxEntries}` : courseQuery;

        const request = new Request(`/api/announcements${query}`, {
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

    getAnnounce: (announceId) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/announcements/${announceId}`, {
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

    updateAnnounce: (announce) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/announcements/${announce.id}`, {
            credentials: 'include',
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(announce)
        });

        return fetch(request).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                return Promise.reject();
            }

        });
    },

    removeAnnounce: (announceId) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/announcements/${announceId}`, {
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

    addAnnounce: (announce) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/announcements`, {
            credentials: 'include',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(announce)
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

export default AnnouncementsStore;
