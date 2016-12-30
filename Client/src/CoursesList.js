import React, {Component} from 'react';

import CoursesListAdmin from './CoursesListAdmin';
import CoursesListNonAdmin from './CoursesListNonAdmin';

class CoursesList extends Component {

    render() {
        const {role} = sessionStorage;

        let component = null;
        switch (role) {
            case 'admin':
                component = <CoursesListAdmin/>;
                break;
            default:
                component = <CoursesListNonAdmin/>;
        }

        return component;
    }
}

export default CoursesList;
