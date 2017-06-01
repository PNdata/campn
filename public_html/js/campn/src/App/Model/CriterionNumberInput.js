function CriterionNumberInput(params) {
        
    if (params == null) params = {};    
    this._format = params.format != null ? params.format : null;
    this._type = params.type != null ? params.type : 'integer';
    this._exists = false;         
    this._input = {};
    this._availableOperators = [
        'equalsTo', 'notEqualsTo',
        'greaterThan', 'sGreaterThan',
        'lessThan', 'sLessThan',
        'isEmpty', 'isNotEmpty', 
        'between', 'notBetween',
        'in', 'notIn'
    ];    
        
    this.value = function(value) {
        if (value != null) {
            this.$input().$input.data('kendoNumericTextBox').value(value);
        } else { 
            return this.$input().$input.data('kendoNumericTextBox').value();
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
            };
            return this._input;
        }
    }
    
    this.init = function($input) {
        if (this._type == 'float') {  
            switch (this._format) {
                case 'percent':
                    params = {
                        format: 'p0',
                        min: 0,
                        max: 1,
                        step: 0.01
                    };
                    break;
                case 'amount':
                    params = {
                        format: '#.00 €'
                    };
                    break;
            }    
        } else if (this._type == 'integer') {                              
            params = {
                decimal: 0,
                step: 1
            };
        }                     
        $input.kendoNumericTextBox(params);
        return $input;
    }
    
    this.validation = function() {
        return this.value() != '';
    }
    
}