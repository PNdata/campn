App.Server.Query = function() {};

App.Server.Query.create = function(session, query, done, fail) {
    App.Server.post('/query/create', { token: session.token(), label: query.label() }, done, fail);
};

App.Server.Query.compute = function(query, includeNodes, excludeQueries, done, fail) {
    App.Server.post('/query/compute', { data:{
        query: query,
        includeNodes: includeNodes,
        excludeQueries: excludeQueries
    }}, done, fail);
};

App.Server.Query.saveModel = function(id, label, excl, nodes, done, fail) {
    App.Server.post('/query/model/save', { id: id, label: label, excl: excl, nodes: nodes }, done, fail);
};

App.Server.Query.loadModel = function(id, done, fail) {
    App.Server.get('/query/model/load', { id: id }, done, fail);
};