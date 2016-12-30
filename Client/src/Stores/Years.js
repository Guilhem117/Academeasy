
const YearsStore = {
  getYears:(search) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const url = search
          ? `/api/years?search=${search}`
          : '/api/years';

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
