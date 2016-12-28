const CoursesStore = {
    getCourses: (search) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const url = search
            ? `http://localhost:8081/api/courses?search=${search}`
            : 'http://localhost:8081/api/courses';

        const request = new Request(url, {
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

    getCourse: (courseCode) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`http://localhost:8081/api/courses/${courseCode}`, {
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

    updateCourse: (course) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`http://localhost:8081/api/courses/${course.code}`, {
            credentials: 'include',
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(course)
        });

        return fetch(request).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                return Promise.reject();
            }

        });
    },

    removeCourse: (courseCode) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`http://localhost:8081/api/courses/${courseCode}`, {
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

    addCourse: (course) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`http://localhost:8081/api/courses`, {
            credentials: 'include',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(course)
        });

        return fetch(request).then(resp => {
            if (resp.ok) {
                return resp.json();
            } else {
                return Promise.reject();
            }

        });
    },

    setTeachers: (course, usernames) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const teachersList = {
            teachers: Array.prototype.join.call(usernames, ',')
        };

        const request = new Request(`http://localhost:8081/api/courses/${course}/teachers`, {
            credentials: 'include',
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(teachersList)
        });

        return fetch(request).then(resp => {
            if (resp.ok) {
                return;
            } else {
                return Promise.reject();
            }

        });
    },

    addAttachments: (courseCode, files) => {
        const data = new FormData()
        let i = 1;
        Array.prototype.forEach.call(files, (file) => {
            data.append(`file${i}`, file);
            i++;
        });

        const request = new Request(`http://localhost:8081/api/courses/${courseCode}/attachment`, {
            credentials: 'include',
            method: 'POST',
            body: data
        });

        return fetch(request).then(resp => {
            if (resp.ok) {
                return;
            } else {
                return Promise.reject();
            }
        });
    }
}

export default CoursesStore;
