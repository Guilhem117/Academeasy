import Alerts from '../Alerts';

const responseHandler = (resp) => {
  if (resp.status === 204) {
    return;
  }
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

const errorHandler = (err) => {
  Alerts.showError(`System error : ${err}`);
}

const AnnouncementsStore = {
  getAnnouncements: (myCourses, maxEntries) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    let query = maxEntries
      ? `?count=${maxEntries}`
      : '';

    if (myCourses) {
      query += query
        ? '&mycourses=true'
        : '?mycourses=true';
    }

    const request = new Request(`http://localhost:8081/api/announcements${query}`, {
      credentials: 'include',
      method: 'GET',
      headers: headers
    });

    return fetch(request).then(responseHandler, errorHandler);
  },

  getAnnouncementsForCourse: (courseCode, maxEntries) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const courseQuery = `?course=${courseCode}`
    const query = maxEntries
      ? `${courseQuery}&count=${maxEntries}`
      : courseQuery;

    const request = new Request(`http://localhost:8081/api/announcements${query}`, {
      credentials: 'include',
      method: 'GET',
      headers: headers
    });

    return fetch(request).then(responseHandler, errorHandler);
  },

  getAnnounce: (announceId) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const request = new Request(`http://localhost:8081/api/announcements/${announceId}`, {
      credentials: 'include',
      method: 'GET',
      headers: headers
    });

    return fetch(request).then(responseHandler, errorHandler);
  },

  updateAnnounce: (announce) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const request = new Request(`http://localhost:8081/api/announcements/${announce.id}`, {
      credentials: 'include',
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(announce)
    });

    return fetch(request).then(responseHandler, errorHandler);
  },

  removeAnnounce: (announceId) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const request = new Request(`http://localhost:8081/api/announcements/${announceId}`, {
      credentials: 'include',
      method: 'DELETE',
      headers: headers
    });

    return fetch(request).then(responseHandler, errorHandler);
  },

  addAnnounce: (announce) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const request = new Request(`http://localhost:8081/api/announcements`, {
      credentials: 'include',
      method: 'POST',
      headers: headers,
      body: JSON.stringify(announce)
    });

    return fetch(request).then(responseHandler, errorHandler);
  }
}

export default AnnouncementsStore;
