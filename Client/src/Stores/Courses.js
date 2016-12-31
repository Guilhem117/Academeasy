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

const CoursesStore = {
    getCourses: (search) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const url = search
            ? `/api/courses?search=${search}`
            : '/api/courses';

        const request = new Request(url, {
            credentials: 'include',
            method: 'GET',
            headers: headers
        });

        return fetch(request).then(responseHandler);
    },

    getCourse: (courseCode) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/courses/${courseCode}`, {
            credentials: 'include',
            method: 'GET',
            headers: headers
        });

        return fetch(request).then(responseHandler);
    },

    updateCourse: (course) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/courses/${course.code}`, {
            credentials: 'include',
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(course)
        });

        return fetch(request).then(responseHandler);
    },

    removeCourse: (courseCode) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/courses/${courseCode}`, {
            credentials: 'include',
            method: 'DELETE',
            headers: headers
        });

        return fetch(request).then(responseHandler);
    },

    addCourse: (course) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/courses`, {
            credentials: 'include',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(course)
        });

        return fetch(request).then(responseHandler);
    },

    setTeachers: (course, usernames) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const teachersList = {
            teachers: Array.prototype.join.call(usernames, ',')
        };

        const request = new Request(`/api/courses/${course}/teachers`, {
            credentials: 'include',
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(teachersList)
        });

        return fetch(request).then(responseHandler);
    },

    getTeachers: (course) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const request = new Request(`/api/courses/${course}/teachers`, {
            credentials: 'include',
            method: 'GET',
            headers: headers,
        });

        return fetch(request).then(responseHandler);
    },

    addAttachments: (courseCode, files) => {
        const data = new FormData()
        let i = 1;
        Array.prototype.forEach.call(files, (file) => {
            data.append(`file${i}`, file);
            i++;
        });

        const request = new Request(`/api/courses/${courseCode}/attachment`, {
            credentials: 'include',
            method: 'POST',
            body: data
        });

        return fetch(request).then(responseHandler);
    },

    getAttachmentURL: (courseCode, fileName) => {
      return `/api/courses/${courseCode}/attachment/${fileName}`;
    }
}

export default CoursesStore;
