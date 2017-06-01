function CriterionStringInput() {
        
    this._exists = false;         
    this._input = {};
    
    this._availableOperators = [
        'equalsTo', 'notEqualsTo',
        'isEmpty', 'isNotEmpty', 
        'beginsWith', 'endsWith', 'contains'
    ];    
        
    this.value = function(value) {
        if (value != null) {
            this.$input().$input.val(value);
        } else { 
            return this.$input().$input.val();
        }
    }
   
    this.$input = function() {
        var that = this, params;
        if (this._exists) {
            return this._input;
        } else {
            this._exists = true;
            var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
            var $input = $('<input class="k-textbox criterion-value-input"/>');
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
        return $input;
    }
    
    this.validation = function() {
        return this.value() != '';
    }
    
}