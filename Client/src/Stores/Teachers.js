let teachers = [
    {
        id: 1,
        login: 'azighmi',
        firstName: 'Amira',
        lastName: 'Zighmi',
        email: 'amirazighmi@yahoo.com',
        courses: []
    }, {
        id: 2,
        login: 'toto',
        firstName: 'Toto',
        lastName: 'Lala',
        courses: []
    }
];

let listeners = [];

const TeachersStore = {
    getTeachers: _ => {
        return teachers.slice();
    },

    getTeachersForCourse: (course) => {
        return teachers.filter((teacher) => {
            return teacher.courses.includes(course);
        });
    },

    getTeacher: (teacherId) => {
        const arrayPos = teachers.findIndex((s) => {
            return teacherId === s.id;
        });
        return arrayPos > -1
            ? teachers[arrayPos]
            : null;
    },

    addCourseToTeacher: (teacherId, courseId) => {
        const arrayPos = teachers.findIndex((s) => {
            return teacherId === s.id;
        });
        if (arrayPos > -1 && !teachers[arrayPos].courses.includes(courseId)) {
            teachers[arrayPos].courses = [
                ...teachers[arrayPos].courses,
                courseId
            ]
            TeachersStore.notify();
        }
    },

    updateTeacher: (teacher) => {
        const arrayPos = teachers.findIndex((s) => {
            return teacher.id === s.id;
        });
        if (arrayPos > -1) {
            teachers[arrayPos] = teacher;
            TeachersStore.notify();
        }
    },

    removeTeacher: (teacherId) => {
        const arrayPos = teachers.findIndex((s) => {
            return teacherId === s.id;
        });
        if (arrayPos > -1) {
            teachers.splice(arrayPos, 1);
            TeachersStore.notify();
        }
    },

    addTeacher: (teacher) => {
        let max = 0;
        teachers.forEach((s) => {
            if (s.id > max)
                max = s.id;
            }
        );
        teacher.id = max + 1;
        teachers.push(teacher);
        TeachersStore.notify();
        return teacher.id;
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
};

export default TeachersStore;
