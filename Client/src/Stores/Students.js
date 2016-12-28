const StudentsStore = {
    getStudents: (search) => {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        const url = search
            ? `http://localhost:8081/api/students?search=${search}`
            : 'http://localhost:8081/api/students';

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


    getStudent: (username) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const request = new Request(`http://localhost:8081/api/students/${username}`, {
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

    updateStudent: (student) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const request = new Request(`http://localhost:8081/api/students/${student.username}`, {
          credentials: 'include',
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(student),
      });

      return fetch(request).then(resp => {
          if (resp.ok) {
              return resp.json();
          } else {
              return Promise.reject();
          }

      });
    },

    removeStudent: (username) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const request = new Request(`http://localhost:8081/api/students/${username}`, {
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

    addStudent: (student) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const request = new Request(`http://localhost:8081/api/students`, {
          credentials: 'include',
          method: 'POST',
          headers: headers,
          body: JSON.stringify(student),
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

export default StudentsStore;
