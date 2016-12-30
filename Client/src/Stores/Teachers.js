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

      const request = new Request(`/api/teachers/${username}`, {
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

      const request = new Request(`/api/teachers/${teacher.username}`, {
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

      const request = new Request(`/api/teachers/${username}`, {
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

      const request = new Request(`/api/teachers`, {
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

};

export default TeachersStore;
