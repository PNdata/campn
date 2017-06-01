function CriterionEntiereInput(schema, key) {
    
    this._schema = schema;
    this._key = key;
    this._exists = false;  
    this._input = {};    
    this._availableOperators = [
        'equalsTo', 'notEqualsTo',
        'isEmpty', 'isNotEmpty', 
    ];    
    this._dataItem = null;
        
    this.value = function(value) {
        if (value != null) {
            this.$input().$input.data('kendoComboBox').value(value);
        } else {
            return this._dataItem.code;
        }
    }

    this.$input = function($wrap) {
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
    
    this.init = function($input) {
        var that = this;
        var dataSource = new kendo.data.DataSource({
            transport: { read: { url: App.config.server.url+'/schema/'+this._schema+'/data',
                data: { data: {  orderBy: { name: 'short_text', way: 'asc' }},
                        auth: App.account.auth
                }}
            }
        });
        var dataItem = null;
        var kendoParams = {
            dataSource: dataSource, dataTextField: 'text', dataValueField: this._key,
            autoBind: true, filter: 'contains', placeholder: 'Valeur...', suggest: false,
            select: function(e) {
                that._dataItem = this.dataItem(e.item.index());
            }
        };
        $input.kendoComboBox(kendoParams);
        return $input;
    }
    
    this.validation = function() {
        return this.value() != '';
    }
    
}