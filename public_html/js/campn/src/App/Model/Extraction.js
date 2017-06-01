if (!App.Model) {
  App.Model = {};
}

var Field = Backbone.Model.extend({  
});

var FieldCollection = Backbone.Collection.extend({
  model: Field
});

var Settings = Backbone.Model.extend({
  
  defaults: {    
    delimiter: ";",
    enclosure: "",
    header: true,
    targets: []
  },  
  
  initialize: function () {
    this.set("fields", new FieldCollection());
    this.set("targets", []);
  },
  
  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    json.fields = this.get("fields").toJSON();
    return json;
  }
  
});

App.Model.Extraction = Backbone.Model.extend({
  
  defaults: {
    name: null,
    filename: null,
    description: null,
    limit: null,
    state: null,
    paymentStatus: null,
    sessionId: null
  },
  
  urlRoot: function() {
    return App.config.server.url + '/extractions';
  },
  
  sync: function (method, model, options) {
    var data = {};
    if (model && (method === 'create' || method === 'update' || method === 'patch')) {
      options.contentType = 'application/json';
      data = options.attrs || model.toJSON();
    }
    if(method === "read") {
      options.data = $.param({auth: App.account.auth});
    } else {
      _.extend(data, {auth: App.account.auth});
      options.data = JSON.stringify(data);
    }
    return Backbone.sync.call(this, method, model, options);
  },
  
  initialize: function () {
    this.set("settings", new Settings());
  },
  
  toJSON: function() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    json.settings = this.get("settings").toJSON();
    return json;
  }

});

App.Model.ExtractionCollection = Backbone.Collection.extend({
  url: function () {
    var param = $.param({auth: App.account.auth});
    return App.config.server.url + '/extractions?' + param;
  }
});