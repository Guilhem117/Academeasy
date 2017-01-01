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

const CalendarStore = {
  getCalendar: (maxEntries) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const query = maxEntries
      ? `?count=${maxEntries}`
      : '';

    const request = new Request(`http://localhost:8081/api/calendar${query}`, {
      credentials: 'include',
      method: 'GET',
      headers: headers
    });

    return fetch(request).then(responseHandler, errorHandler);
  },

  getCalendarForCourse: (courseCode, maxEntries) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const courseQuery = `?course=${courseCode}`
    const query = maxEntries
      ? `${courseQuery}&count=${maxEntries}`
      : courseQuery;

    const request = new Request(`http://localhost:8081/api/calendar${query}`, {
      credentials: 'include',
      method: 'GET',
      headers: headers
    });

    return fetch(request).then(responseHandler, errorHandler);
  },

  getEntry: (entryId) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const request = new Request(`http://localhost:8081/api/calendar/${entryId}`, {
      credentials: 'include',
      method: 'GET',
      headers: headers
    });

    return fetch(request).then(responseHandler, errorHandler);
  },

  updateEntry: (entry) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const request = new Request(`http://localhost:8081/api/calendar/${entry.id}`, {
      credentials: 'include',
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(entry)
    });

    return fetch(request).then(responseHandler, errorHandler);
  },

  deleteEntry: (entryId) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const request = new Request(`http://localhost:8081/api/calendar/${entryId}`, {
      credentials: 'include',
      method: 'DELETE',
      headers: headers
    });

    return fetch(request).then(responseHandler, errorHandler);
  },

  addEntry: (entry) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const request = new Request(`http://localhost:8081/api/calendar`, {
      credentials: 'include',
      method: 'POST',
      headers: headers,
      body: JSON.stringify(entry)
    });

    return fetch(request).then(responseHandler, errorHandler);
  },

  updateAttendents: (entryId, attendents) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const request = new Request(`http://localhost:8081/api/calendar/${entryId}/attendents`, {
      credentials: 'include',
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({attendents})
    });

    return fetch(request).then(responseHandler, errorHandler);
  },
}

export default CalendarStore;
