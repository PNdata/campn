App.Server.Node = function() {};

App.Server.Node.deleteModel = function(id, done, fail) {
    App.Server.post('/node/model/delete', { id: id }, done, fail);
};

App.Server.Node.saveModel = function(id, label, criteria, done, fail) {
    App.Server.post('/node/model/save', { id: id, label: label, criteria: criteria }, done, fail);
};

App.Server.Node.loadModel = function(id, done, fail) {
    App.Server.get('/node/model/load', { id: id }, done, fail);
};

App.Server.Node.compute = function(node, includeNodes, excludeNodes, done, fail) {
    App.Server.post('/node/compute', { data: {
            node: node,
            includeNodes: includeNodes,
            excludeNodes: excludeNodes
    }}, done, fail);
};