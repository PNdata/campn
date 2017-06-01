function CriterionBooleanInput() {
    
    this._exists = false;  
    this._input = {};    
    this._availableOperators = [
        'equalsTo', 'notEqualsTo',
        'isEmpty', 'isNotEmpty', 
    ];    
        
    this.value = function(value) {
        if (value != null) {
            this.$input().$input.data('kendoComboBox').value(value);
        } else { 
            return this.$input().$input.data('kendoComboBox').value();
        }
    }

    this.$input = function($wrap) {
        var that = this, params;
        if (this._exists) {
            return this._input;
        } else {
            this._exists = true;
            var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
            var $input = $('<input class="criterion-value-input" data-id="'+this._uid+'"/>');
            $wrap.append($input);
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
        $input.kendoComboBox({
            dataTextField: 'text',
            dataValueField: 'value',
            dataSource: [
                {   text:'oui',
                    value:'1'  },
                {   text:'non',
                    value:'0'  }
            ],
            criterion: 'contains',
            placeholder: 'Valeur...',
            suggest: true
        });
        return $input;
    }
    
    this.validation = function() {
        return this.value() != '';
    }
    
}