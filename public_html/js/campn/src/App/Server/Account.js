App.Server.Account = function() {};

App.Server.savePreferences = function(preferences, done, fail) {
    App.Server.post('/account/preferences/save', preferences, done, fail);
}
