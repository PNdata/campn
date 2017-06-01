function CriterionEnumInput(params) {

  if (params == null)
    params = {};
  
  this.enum = params.enum;
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

  this.value = function (value) {
    if (value != null) {
      this.$input().$input.data('kendoDropDownList').value(value);
    } else {
      return this.$input().$input.data('kendoDropDownList').value();
    }
  }

  this.$input = function () {
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

  this.init = function ($input) {
    $input.kendoDropDownList({
      dataSource: this.enum,
      dataValueField: "value",
      dataTextField: "label"
    });
    return $input;
  }

  this.validation = function () {
    return this.value() != '';
  }
  
  this.clone = function() {
    if(typeof(this) != 'object' || this == null){
        return this;
    }
    var newInstance = new this.constructor();
    newInstance.enum = [];
    $.each(this.enum, function(i, v) {
      newInstance.enum.push({value: v.value, label: v.label});
    });
    return newInstance;
  }

}