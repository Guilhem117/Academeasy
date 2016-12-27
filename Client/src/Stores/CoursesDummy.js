let courses = [
    {
        id: 0,
        code: 'MASCOUR1',
        label: 'Cours de blable',
        color: '#ff0000'
    }, {
        id: 1,
        code: 'MASCOUR2',
        label: 'Cours de kaka',
        color: '#e2b300'
    }, {
        id: 2,
        code: 'MASCOUR3',
        label: 'Super Cours !',
        color: '#e236a1'
    }, {
        id: 3,
        code: 'MASCOUR4',
        label: 'Wooow',
        color: '#2a36a1'
    }, {
        id: 4,
        code: 'MASCOUR5',
        label: 'Bien ça !!!',
        color: '#3fd963'
    }
];

let listeners = [];

const CoursesStore = {
    getCourses: _ => {
        return courses.slice();
    },

    getCourse: (courseId) => {
        const arrayPos = courses.findIndex((s) => {
            return courseId === s.id;
        });
        return arrayPos > -1
            ? courses[arrayPos]
            : null;
    },

    updateCourse: (course) => {
        const arrayPos = courses.findIndex((s) => {
            return course.id === s.id;
        });
        if (arrayPos > -1) {
            courses[arrayPos] = course;
            CoursesStore.notify();
        }
    },

    removeCourse: (courseId) => {
        const arrayPos = courses.findIndex((s) => {
            return courseId === s.id;
        });
        if (arrayPos > -1) {
            courses.splice(arrayPos, 1);
            CoursesStore.notify();
        }
    },

    addCourse: (course) => {
        let max = 0;
        courses.forEach((s) => {
            if (s.id > max)
                max = s.id;
            }
        );
        course.id = max + 1;
        courses.push(course);
        CoursesStore.notify();
        return course.id;
    },

    addListener: (callback) => {
        listeners.push(callback);
    },

    removeListener: (callback) => {
        listeners = listeners.filter((l) => l !== callback);
    },

    notify: _ => {
        listeners.forEach((callback) => callback());
    }

}

export default CoursesStore;
