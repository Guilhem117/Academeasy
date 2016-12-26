const courses = [
    {
        id: 'MASCOUR1',
        label: 'Cours de blable',
        color: '#ff0000'
    }, {
        id: 'MASCOUR2',
        label: 'Cours de kaka',
        color: '#e2b300'
    }, {
        id: 'MASCOUR3',
        label: 'Super Cours !',
        color: '#e236a1'
    }, {
        id: 'MASCOUR4',
        label: 'Wooow',
        color: '#2a36a1'
    }, {
        id: 'MASCOUR5',
        label: 'Bien ça !!!',
        color: '#3fd963'
    }
];

const CoursesStore = {
    getCourses: _ => {
        return courses.slice();
    },
}

export default CoursesStore;
