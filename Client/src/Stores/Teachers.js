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

const TeachersStore = {
    getTeachers: (search) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const url = search
            ? `/api/teachers?search=${search}`
            : '/api/teachers';

        const request = new Request(url, {
            credentials: 'include',
            method: 'GET',
            headers: headers
        });

        return fetch(request).then(responseHandler);
    },


    getTeacher: (username) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const request = new Request(`/api/teachers/${username}`, {
          credentials: 'include',
          method: 'GET',
          headers: headers
      });

      return fetch(request).then(responseHandler);
    },

    updateTeacher: (teacher) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const request = new Request(`/api/teachers/${teacher.username}`, {
          credentials: 'include',
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(teacher),
      });

      return fetch(request).then(responseHandler);
    },

    removeTeacher: (username) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const request = new Request(`/api/teachers/${username}`, {
          credentials: 'include',
          method: 'DELETE',
          headers: headers,
      });

      return fetch(request).then(responseHandler);
    },

    addTeacher: (teacher) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const request = new Request(`/api/teachers`, {
          credentials: 'include',
          method: 'POST',
          headers: headers,
          body: JSON.stringify(teacher),
      });

      return fetch(request).then(responseHandler);
    },

};

export default TeachersStore;
