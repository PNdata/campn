function Attribute(data) {
    
    // Propriétés autorisées
    this.allowedProperties = ['name', 'label', 'type', 'format', 'schema', 'path', 'dataType', 'linkCardinality', 'keyName', 'hugeData', 'enum', 'query'];    
            
    // Affectation des propriétés
    for (key in data) {  
        if ($.inArray(key, this.allowedProperties) > -1) {
            var obj = data[key];
            this['_'+key] = obj;
        }
    }
        
    // Getters / setters
    
    this.name = function(name) {
        if (name != null) { this._name = name; return this; }
        else { return this._name; }
    }    
    
    this.label = function(label) {
        if (label != null) { this._label = label; return this; }
        else { return this._label; }
    }   
    
    this.type = function(type) {
        if (type != null) { this._type = type; return this; }
        else { return this._type; }
    }    
    
    this.format = function(format) {
        if (format != null) { this._format = format; return this; }
        else { return this._format; }
    }
    
    this.path = function(path) {
        if (path != null) { this._path = path; return this; }
        else { return this._path; }
    }
    
    this.dataType = function(dataType) {
        if (dataType != null) { this._dataType = dataType; return this; }
        else { return this._dataType; }
    }
    
    this.linkCardinality = function(linkCardinality) {
        if (linkCardinality != null) { this._linkCardinality = linkCardinality; return this; }
        else { return this._linkCardinality; }
    }
    
    this.keyName = function(keyName) {
        if (keyName != null) { this._keyName = keyName; return this; }
        else { return this._keyName; }
    }
    
    this.schema = function(schema) {
        if (schema != null) { this._schema = schema; return this; }
        else { return this._schema; }
    }
    
    this.hugeData = function(hugeData) {
        if (hugeData != null) { this._hugeData = hugeData; return this; }
        else { return this._hugeData; }
    }
}