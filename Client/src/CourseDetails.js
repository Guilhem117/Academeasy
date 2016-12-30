import React, {Component} from 'react';

import CourseDetailsAdmin from './CourseDetailsAdmin';
import CourseDetailsNonAdmin from './CourseDetailsNonAdmin';

class CourseDetails extends Component {

    render() {
        const {role} = sessionStorage;

        let component = null;
        switch (role) {
            case 'admin':
                component = <CourseDetailsAdmin/>
                break;
            default:
                component = <CourseDetailsNonAdmin/>
        }

        return component;
    }
}

export default CourseDetails;
