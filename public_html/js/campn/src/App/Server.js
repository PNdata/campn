App.Server = function() {};
    
App.Server.get = function(command, data, done, fail) {
    if (App.account != undefined) data['auth'] = App.account.auth;
    return $.get(App.config.server.url + command, data, null, 'json').done(done).fail(fail);
}
    
App.Server.post = function(command, data, done, fail) {   
    if (App.account != undefined) data['auth'] = App.account.auth;
    return $.post(App.config.server.url + command, data, null, 'json').done(done).fail(fail);
}

