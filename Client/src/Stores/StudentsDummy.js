let students = [
    {
        id: 1,
        login: 'nicolas',
        firstName: 'Nicolas',
        lastName: 'Fromage',
        email: 'amirazighmi@yahoo.com',
        year: 'M2',
        courses: []
    }, {
        id: 2,
        login: 'laura',
        firstName: 'Laura',
        lastName: 'Lala',
        year: 'M1',
        courses: []
    }
];

let listeners = [];

const StudentsStore = {
    getStudents: _ => {
        return students.slice();
    },

    getStudent: (studentId) => {
        const arrayPos = students.findIndex((s) => {
            return studentId === s.id;
        });
        return arrayPos > -1
            ? students[arrayPos]
            : null;
    },

    updateStudent: (student) => {
        const arrayPos = students.findIndex((s) => {
            return student.id === s.id;
        });
        if (arrayPos > -1) {
            students[arrayPos] = student;
            StudentsStore.notify();
        }
    },

    removeStudent: (studentId) => {
        const arrayPos = students.findIndex((s) => {
            return studentId === s.id;
        });
        if (arrayPos > -1) {
            students.splice(arrayPos, 1);
            StudentsStore.notify();
        }
    },

    addStudent: (student) => {
        let max = 0;
        students.forEach((s) => {
            if (s.id > max)
                max = s.id;
            }
        );
        student.id = max + 1;
        students.push(student);
        StudentsStore.notify();
        return student.id;
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

export default StudentsStore;
