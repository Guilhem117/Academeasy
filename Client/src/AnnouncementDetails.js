import React, {Component} from 'react';

import AnnouncementDetailsAdmin from './AnnouncementDetailsAdmin';
//import AnnouncementDetailsNonAdmin from './AnnouncementDetailsNonAdmin';

class AnnouncementDetails extends Component {

    render() {
        const {role} = sessionStorage;

        let component = null;
        switch (role) {
            case 'admin':
                component = <AnnouncementDetailsAdmin/>
                break;
            default:
                component = <div/>
        }

        return component;
    }
}

export default AnnouncementDetails;
