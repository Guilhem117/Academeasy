let users = [
    {
        id: 0,
        login: 'admin',
        password: 'admin',
        role: 'admin'
    }, {
        id: 1,
        login: 'azighmi',
        password: '1234',
        role: 'teacher'
    }, {
        id: 2,
        login: 'toto',
        password: '1234',
        role: 'teacher'
    }, {
        id: 3,
        login: 'nicolas',
        password: '1234',
        role: 'student'
    }, {
        id: 4,
        login: 'laura',
        password: '1234',
        role: 'student'
    }

];

const UsersStore = {
    loginUser: (username, password) => {
        const user = users.find((user) => user.login === username);
        return {
            success: !!user && user.password === password,
            role: user && user.role
        }
    }
};

export default UsersStore;
