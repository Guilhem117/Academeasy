
const YearsStore = {
  getYears:(search) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const url = search
          ? `http://localhost:8081/api/years?search=${search}`
          : 'http://localhost:8081/api/years';

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
};

export default YearsStore;
