App.Server.Auth = {};

App.Server.Auth.login = function(auth, encrypted, done, fail) {
    App.Server.get('/login', { data: {
        auth: auth,
        encrypted: encrypted
    }}, done, fail);
}