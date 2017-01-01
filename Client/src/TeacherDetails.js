import React, {Component} from 'react';

import TeacherDetailsAdmin from './TeacherDetailsAdmin';
import TeacherDetailsNonAdmin from './TeacherDetailsNonAdmin';

class CourseDetails extends Component {

    render() {
        const {role} = sessionStorage;

        let component = null;
        switch (role) {
            case 'admin':
                component = <TeacherDetailsAdmin/>
                break;
            default:
                component = <TeacherDetailsNonAdmin/>
        }

        return component;
    }
}

export default CourseDetails;
