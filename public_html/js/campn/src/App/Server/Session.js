App.Server.Session = function() {};

App.Server.Session.init = function(username, password, mode, callback) {
  return App.Server.post('/session/init', {username: username, password: password, mode: mode}, callback);
};

App.Server.Session.load = function(id, done, fail) {
  return App.Server.get('/session/load', { data: { id: id }}, done, fail);
};

App.Server.Session.save = function(id, name, desc, queries, done, fail) {
  return App.Server.post('/session/save', { id: id, name: name, desc: desc, queries: queries }, done, fail);
};

App.Server.Session.delete = function(id, done, fail) {
  return App.Server.post('/session/delete', { id: id }, done, fail);
};

App.Server.Session.list = function(session, status, done, fail) {
  return App.Server.get('/session/list', { data: { token: session.token(), status: status } }, done, fail);
};

App.Server.Session.export = function(params, paths, queries, done, fail) {
  return App.Server.get('/export/execute', { data: { params: params, paths: paths, queries: queries } }, done, fail);
};

App.Server.Session.exportDl = function(file, done, fail) {
  return App.Server.get('/export.txt', { data: { file: file } }, done, fail);
};

App.Server.Session.saveSettings = function(settings, done, fail) {
  return App.Server.post('/settings/save', { data: settings }, done, fail);
};

App.Server.Session.loadSettings = function(done, fail) {
  return App.Server.get('/settings/load', { data: {} }, done, fail);
};