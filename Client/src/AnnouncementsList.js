import React, {Component} from 'react';

import AnnouncementsListAdmin from './AnnouncementsListAdmin';
import AnnouncementsListNonAdmin from './AnnouncementsListNonAdmin';

class AnnouncementsList extends Component {

    render() {
        const {role} = sessionStorage;

        let component = null;
        switch (role) {
            case 'admin':
                component = <AnnouncementsListAdmin/>;
                break;
            default:
                component = <AnnouncementsListNonAdmin/>;
        }

        return component;
    }
}

export default AnnouncementsList;
