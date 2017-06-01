function DataReferential(schema, keyName) {

    this._schema = schema;
    this._keyName = keyName;
    this._data = [];
    this._loaded = false;
    
    this.schema = function(schema) {
        if (schema != null) { this._schema = schema; return this; }
        else { return this._schema; }
    };
    
    this.keyName = function(keyName) {
        if (keyName != null) { this._keyName = keyName; return this; }
        else { return this._keyName; }
    };
    
    this.data = function(data) {
        if (data != null) { this._data = data; return this; }
        else { return this._data; }
    };
    
    this.loaded = function(loaded) {
        if (loaded != null) { this._loaded = loaded; return this; }
        else { return this._loaded; }
    };
    
    this.load = function() {
        var that = this;
        return App.Server.get(
            '/schema/'+this.schema()+'/data',
            {data: { keyName: keyName }},
            function(data) {
                that.loaded(true);
                that.data(data);
            }
        );        
    };
    
    this.row = function(id) {
        var that = this;
        var value = null;
        $.each (this.data(), function(i, row) {
            if (row.v == id) {
                value = row
                return false;
            }
        });        
        return value;
    }
    
};