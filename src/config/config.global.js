const apiServer = 'http://AUBOTD9X94HD2:3001'

module.exports = {
    showClientDevelopmentErros: true,
    cookieExpiresIn: 14,
    app: {
        name: 'IBOS'
    },
    theme: {
        boxRadius: '12px',
        buttonRadius: '6px'
    },
    urls: {
        home: {
            path: '/',
            name: 'Home'
        },
        user : {
            signIn: {
                path: '/signin',
                name: 'Sign in'
            },
            changePassword: {
                path: '/changepassword',
                name: 'Change password'
            }
        },
        drawings: { 
            path: '/drawings',
            name: 'Loop PDFs'
        },
        error: {
            path: '/error',
            name: 'Error'
        },
        public: {
            path: '/public',
            name: 'Welcome'
        }
    },
    api: {
        urls: {
            user: {
                signIn: apiServer + '/signin',
                verifyPassword: apiServer + '/user/me/verifypassword',
                changePassword: apiServer + '/user/me/changepassword',
                emailResetPasswordLink: apiServer + '/user/me/emailpasswordresetlink',
                generateToken: apiServer + '/user/me/generatetoken',
                verifyToken: apiServer + '/user/me/verifytoken',
                userProfile: apiServer + '/users',
            },
            getDrawings: apiServer + '/getdrawings',
            verifyToken: apiServer + '/verifytoken',
        }

    }
}