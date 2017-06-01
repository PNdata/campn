App.Server.DataModel = function() {};

/*App.Server.DataModel.load = function(session, name, done) {
    App.Server.get('/schema/'+name+'/load', null, done);
}*/

App.Server.DataModel.row = function(schema, id, done) {
    App.Server.get('/schema/'+schema+'/row', {id: id}, done);
}

App.Server.DataModel.load = function(done, fail) {
    return $.ajax({
        url: App.config.server.url+'/schema/load',
        data: {auth: App.account.auth }
    }).done(done).fail(fail);
}

App.Server.DataModel.data = function(data, done, fail) {
    return $.ajax({
        url: App.config.server.url+'/schema/data',
        data: {auth: App.account.auth, data: data }
    }).done(done).fail(fail);
}