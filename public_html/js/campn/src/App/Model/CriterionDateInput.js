function CriterionDateInput() {
    
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
            var date = new Date(value.substr(0,4), value.substr(4,2), value.substr(6,2));
            this.$input().$input.data('kendoDatePicker').value(date);
        } else { 
            return $.format.date(this.$input().$input.data('kendoDatePicker').value(),'yyyyMMdd');
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
    
    this.init = function($input) {        
        $input.kendoDatePicker({
            format: 'dd/MM/yyyy',
            culture: 'fr-FR'
        });
        return $input;
    }
    
    this.validation = function() {
        return this.value() != '';
    }
    
}