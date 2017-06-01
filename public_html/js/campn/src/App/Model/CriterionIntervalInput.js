function CriterionIntervalInput(criterionInput) {
    
    this._criterionInput = criterionInput;
    this._exists = false;         
    this._input = {};
    
    this.value = function(value) {
        if (value != null) {
            this.$input().input1.value(value.split('-')[0]);
            this.$input().input2.value(value.split('-')[1]);
        } else { 
            return this.$input().input1.value()+'-'+
                   this.$input().input2.value();
        }
    }

    this.$input = function() {
        var that = this;                 
        if (this._exists) {
            return this._input;
        } else {
            this._exists = true;
            var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
            var input1 = criterionInput.clone ? criterionInput.clone() : clone(criterionInput);
            var input2 = criterionInput.clone ? criterionInput.clone() : clone(criterionInput);
            var $input1 = input1.$input().$input;
            var $input2 = input2.$input().$input;
            $wrap.append(input1.$input().$input);            
            $wrap.append(' et ');
            $wrap.append(input2.$input().$input);
            $input1 = input1.init($input1);
            $input2 = input2.init($input2);
            this._input = {
                $wrap: $wrap,
                input1: input1,
                input2: input2
            };
            return this._input;
        }
    }
    
}


