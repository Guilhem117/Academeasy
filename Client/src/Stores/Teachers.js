let listeners = [];

const TeachersStore = {
    getTeachers: (search) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const url = search
            ? `http://localhost:8081/api/teachers?search=${search}`
            : 'http://localhost:8081/api/teachers';

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


    getTeacher: (username) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const request = new Request(`http://localhost:8081/api/teachers/${username}`, {
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

    updateTeacher: (teacher) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const request = new Request(`http://localhost:8081/api/teachers/${teacher.username}`, {
          credentials: 'include',
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(teacher),
      });

      return fetch(request).then(resp => {
          if (resp.ok) {
              return resp.json();
          } else {
              return Promise.reject();
          }

      });
    },

    removeTeacher: (username) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const request = new Request(`http://localhost:8081/api/teachers/${username}`, {
          credentials: 'include',
          method: 'DELETE',
          headers: headers,
      });

      return fetch(request).then(resp => {
          if (resp.ok) {
              return resp.json();
          } else {
              return Promise.reject();
          }

      });
    },

    addTeacher: (teacher) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const request = new Request(`http://localhost:8081/api/teachers`, {
          credentials: 'include',
          method: 'POST',
          headers: headers,
          body: JSON.stringify(teacher),
      });

      return fetch(request).then(resp => {
          if (resp.ok) {
              return resp.json();
          } else {
              return Promise.reject();
          }

      });
    },

    addListener: (callback) => {
        listeners.push(callback);
    },

    removeListener: (callback) => {
        listeners = listeners.filter((l) => l !== callback);
    },

    notify: _ => {
        listeners.forEach((callback) => callback());
    }
};

export default TeachersStore;
