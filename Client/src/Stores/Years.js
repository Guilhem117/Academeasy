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

      return fetch(request).then(responseHandler);
  },
};

export default YearsStore;
