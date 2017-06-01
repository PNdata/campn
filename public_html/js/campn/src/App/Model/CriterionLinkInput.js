function CriterionLinkInput(schema, key) {
    
    this._schema = schema;
    this._key = key;
    //this._keyAlias = key.charAt(0);
    this._sequenced = false;
    this._exists = false;  
    this._input = {};    
    this._availableOperators = [
        'equalsTo', 'notEqualsTo',
        'isEmpty', 'isNotEmpty', 
    ];    
    this._dataItem = null;
        
    this.value = function(value) {
        if (value != null) {
            this.$input().$input.data(this._sequenced ? 'kendoMultiSelect' : 'kendoComboBox').value(value);
        } else {
            if (this._sequenced) {
                return this.$input().$input.data('kendoMultiSelect').value().join(',')
            } else {           
                if (this._dataItem == undefined) {
                    return this.$input().$input.data('kendoComboBox').dataItem().v;
                } else {
                    return this._dataItem.v;
                }
            }
        }
    }
   
    this.$input = function() {
        var that = this, params;
        if (this._exists) {
            return this._input;
        } else {
            this._exists = true;
            var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
            var $input = $('<input class="criterion-value-input"/>');         
            $wrap.append($input);             
            $input = this.init($input);            
            this._input = {
                $wrap: $wrap,
                $input: $input
            }
            return this._input;
        }
    }
    
    this.init = function($input, sequenced) {
        var that = this;
        if (sequenced != null) this._sequenced = sequenced;
        var dataSource = /*new kendo.data.DataSource({
            transport: { read: { url: App.config.server.url+'/schema/'+this._schema+'/data',
                data: { data: {  keyName: that._key, orderBy: { name: 'short_text', way: 'asc' }},
                        auth: App.account.auth
                }}
            }
        });*/ App.DataModel.referential(this._schema).data();
        var dataItem = null;
        var kendoParams = {
            dataSource: dataSource, dataTextField: 't', dataValueField: 'v',
            autoBind: true, filter: 'contains', placeholder: 'Valeur...', suggest: false,
            select: function(e) {
                that._dataItem = this.dataItem(e.item.index());
            }
        };
        if (this._sequenced) $input.kendoMultiSelect(kendoParams);
                        else $input.kendoComboBox(kendoParams);
        return $input;
    }
    
    this.validation = function() {
        return this.value() != '';
    }
    
}