function Criterion(data) {

  // Propriétés autorisées
  this.allowedProperties = ['id', 'attribute', 'operator', 'operation', 'value', 'node', 'criteria', 'typeFunction', 'entiere', 'sequenceFile'];

  this.defaults = {
    id: uid(),
    attribute: null,
    operator: null,
    operation: null,
    value: null,
    node: null,
    typeFunction: null,
    sequenceFile: null
  };

  // Affectation des propriétés
  for (key in data) {
    if ($.inArray(key, this.allowedProperties) > -1) {
      var obj = data[key];
      this['_' + key] = obj;
    }
  }

  this._internalId = null;

  this._computed = false;
  this.computed = function (computed) {
    if (computed != null) {
      this._computed = computed;
      return this;
    } else {
      return this._computed;
    }
  }

  // Getters / setters

  this.id = function (id) {
    if (id != null) {
      this._id = id;
      return this;
    } else {
      return this._id;
    }
  }

  this.internalId = function (internalId) {
    if (internalId != null) {
      this._internalId = internalId;
      return this;
    } else {
      return this._internalId;
    }
  }

  this.attribute = function (attribute) {
    if (attribute != null) {
      this._attribute = attribute;
      return this;
    } else {
      return this._attribute;
    }
  }

  this.operator = function (operator) {
    if (operator != null) {
      this._operator = operator;
      return this;
    } else {
      return this._operator;
    }
  }

  this.typeFunction = function (typeFunction) {
    if (typeFunction != null) {
      this._typeFunction = typeFunction;
      return this;
    } else {
      return this._typeFunction;
    }
  }

  this.operation = function (operation) {
    if (operation != null) {
      this._operation = operation;
      return this;
    } else {
      return this._operation;
    }
  }

  this.value = function (value) {
    if (value != null) {
      this._value = value;
      return this;
    } else {
      return this._value;
    }
  }

  this.entiere = function (entiere) {
    if (entiere != null) {
      this._entiere = entiere;
      return this;
    } else {
      return this._entiere;
    }
  }

  this.node = function (node) {
    if (node != null) {
      this._node = node;
      return this;
    } else {
      return this._node;
    }
  }

  this.dataOperators = {
    equalsTo: {text: "est égal à", type: 'comparaison', shortText: "=", value: "equalsTo", hasValue: true, notAvailableTypes: []},
    notEqualsTo: {text: "est différent de", type: 'comparaison', shortText: "différent de", value: "notEqualsTo", hasValue: true, notAvailableTypes: []},
    greaterThan: {text: "est supérieur ou égal à", type: 'comparaison', shortText: ">=", value: "greaterThan", hasValue: true, notAvailableTypes: ["link", "string", "boolean"]},
    sGreaterThan: {text: "est strictement supérieur à", type: 'comparaison', shortText: ">", value: "sGreaterThan", hasValue: true, notAvailableTypes: ["link", "string", "boolean"]},
    lessThan: {text: "est inférieur ou égal à", type: 'comparaison', shortText: "<=", value: "lessThan", hasValue: true, notAvailableTypes: ["link", "string", "boolean"]},
    sLessThan: {text: "est strictement inférieur à", type: 'comparaison', shortText: "<", value: "sLessThan", hasValue: true, notAvailableTypes: ["link", "string", "boolean"]},
    isEmpty: {text: "n'est pas renseigné", type: 'logic', shortText: "pas renseigné", value: "isEmpty", hasValue: false, notAvailableTypes: []},
    isNotEmpty: {text: "est renseigné", type: 'logic', shortText: "renseigné", value: "isNotEmpty", hasValue: false, notAvailableTypes: []},
    contains: {text: "contient", type: 'comparaison', shortText: "contient", value: "contains", hasValue: true, notAvailableTypes: ["link", "boolean", "integer"]},
    beginsWith: {text: "commence par", type: 'comparaison', shortText: "commence par", value: "beginsWith", hasValue: true, notAvailableTypes: ["link", "boolean", "integer"]},
    endsWith: {text: "se termine par", type: 'comparaison', shortText: "se termine par", value: "endsWith", hasValue: true, notAvailableTypes: ["link", "boolean", "integer"]},
    between: {text: "est compris entre", type: 'interval', shortText: "compris entre", value: "between", hasValue: true, notAvailableTypes: ["boolean"]},
    notBetween: {text: "n'est pas compris entre", type: 'interval', shortText: "pas compris entre", value: "notBetween", hasValue: true, notAvailableTypes: ["boolean"]},
    in: {text: "est compris dans", type: 'sequence', shortText: "compris dans", value: "in", hasValue: true, notAvailableTypes: ["boolean"]},
    notIn: {text: "n'est pas compris dans", type: 'sequence', shortText: "pas compris dans", value: "notIn", hasValue: true, notAvailableTypes: ["boolean"]}
  };

  this.operators = function () {
    var that = this;
    var operators = [];
    $.each(this.dataOperators, function (i, o) {
      if ($.inArray(that.attribute().dataType() == undefined ? that.attribute().type() : that.attribute().dataType(), o.notAvailableTypes) == -1) {
        operators.push({value: o.value, text: o.text});
      }
    });
    return operators;
  }

  this.dataOperations = {
    exists: {text: 'Aucune', shortText: 'Aucune', value: 'exists'},
    sum: {text: 'Somme / Total', shortText: 'Somme', value: 'sum'},
    average: {text: 'Moyenne', shortText: 'Moyenne', value: 'average'},
    standartDeviation: {text: 'Ecart-type', shortText: 'Ecart-type', value: 'standartDeviation'},
    minimal: {text: 'Valeur minimale', shortText: 'Minimum', value: 'minimum'},
    maximal: {text: 'Valeur maximale', shortText: 'Maximum', value: 'maximum'},
    count: {text: 'Nombre', shortText: 'Nombre', value: 'count'},
    countDistinct: {text: 'Nombre distinct', shortText: 'Nombre distinct', value: 'countDistinct'}
  },
  this.typeFunctions = function (type) {
    var typeFunctions = [];
    if (this.hasTypeFunctions(type)) {
      $.each(this.dataTypeFunctions[type], function (i, tf) {
        typeFunctions.push(tf);
      });
    }
    return typeFunctions;
  }

  this.hasTypeFunctions = function (type) {
    return this.dataTypeFunctions.hasOwnProperty(type);
  }

  this.dataTypeFunctions = {
    date: {
      dayOfWeek: {text: 'Jour de la semaine', shortText: 'Jour de la semaine', value: 'dayOfWeek', returnType: 'integer', formula: 'dayOfWeek({0})', label: 'Jour de la semaine de {0}'},
      dayOfMonth: {text: 'Jour du mois', shortText: 'Jour du mois', value: 'dayOfMonth', returnType: 'integer', formula: 'dayOfMonth({0})', label: 'Jour du mois de {0}'},
      dayOfYear: {text: 'Jour de l\'année', shortText: 'Jour de l\'année', value: 'dayOfYear', returnType: 'integer', formula: 'dayOfYear({0})', label: 'Jour de l\'année de {0}'},
      weekOfYear: {text: 'Semaine de l\'année', shortText: 'Semaine de l\'année', value: 'weekOfYear', returnType: 'integer', formula: 'weekOfYear({0})', label: 'Semaine de l\'année de {0}'},
      monthOfYear: {text: 'Mois de l\'année', shortText: 'Mois de l\'année', value: 'monthOfYear', returnType: 'integer', formula: 'monthOfYear({0})', label: 'Mois de l\'année de {0}'},
      year: {text: 'Année', shortText: 'Année', value: 'year', returnType: 'integer', formula: 'year({0})', label: 'Année de {0}'},
      ageInDay: {text: 'Age en jours', shortText: 'Age en jours', value: 'ageInDay', returnType: 'integer', formula: 'ageInDay({0})', label: 'Age en jours de {0}'},
      ageInMonth: {text: 'Age en mois', shortText: 'Age en mois', value: 'ageInMonth', returnType: 'integer', formula: 'ageInMonth({0})', label: 'Age en mois de {0}'},
      ageInYear: {text: 'Age en années', shortText: 'Age en années', value: 'ageInYear', returnType: 'integer', formula: 'ageInYear({0})', label: 'Age en année de {0}'}
    }
  };

  this.operations = function () {
    var operations = [];
    $.each(this.dataOperations, function (i, o) {
      operations.push({value: o.value, text: o.text});
    });
    return operations;
  }

  this.$inite = function () {
    var that = this, $e;
    if (App.session.mode() != 'readOnly') {
      var $remove = $('<button class="criterion-remove"><i class="icon-close"></i></button>');
      $remove.hide().click(function () {
        that.$e().off('click');
        App.Controller.Criterion.delete(that);
      });
    }
    $e = $('<div class="criterion" data-id="' + this.id() + '">' + this.toString() + '</div>');
    if (App.session.mode() != 'readOnly') {
      $e.click(function () {
        App.Controller.Criterion.edit(that);
      });
      $e.append($remove);
      $e.hover(function () {
        $e.addClass('criterion-hover');
        $remove.show();
      }, function () {
        $e.removeClass('criterion-hover');
        $remove.hide();
      });
    }
    return $e;
  }

  this.$e = function () {
    if ($('.criterion[data-id="' + this.id() + '"]').exists()) {
      var $e = $('.criterion[data-id="' + this.id() + '"]');
    } else {
      var $e = this.$inite();
    }
    return $e;
  }

  this.remove = function () {
    this.$e().fadeOut('slow');
    return this;
  }

  this.render = function () {
    this.node().$e().find('.node-criteria').append(this.$e());
  }

  this.updateRender = function () {
    this.$e().replaceWith(this.$inite());
  }

  this.toJSON = function () {
    return {
      id: this.id(),
      path: this.attribute().path(),
      computed: this.computed(),
      operator: this.operator().name(),
      typeFunction: this.typeFunction() != null ? this.typeFunction().name() : null,
      operation: this.operation() != undefined ? this.operation().name() : null,
      value: this.value() != null ? this.value() : null,
      node: this.node().id(),
      entiere: this.entiere(),
      sequenceFile: this.sequenceFile
    };
  };

  this.toString = function () {
    var that = this;
    
    var str = this.operation() != undefined && this.operation().name() != 'exists' ? this.operation().text + ' de ' : '';
    
    // Toute la base
    if (this.entiere()) {
      str += 'Toute la base';
    }
    
    // Sinon Attribute
    else {
      var attribute = App.DataModel.attribute(this.attribute().path());
      if (this.typeFunction() != null) {
        str += this.typeFunction().label.format(attribute.label()) + ' ';
      } else {
        str += attribute.label() + ' ';
      }
    }
    
    
    if (!this.entiere()) {
      str += this.operator().text + ' ';
    }
    
    if (this.value() != undefined) {
      if (this.attribute().type() == 'link') {
        if (this.operator().type() == 'sequence') {

          if (this.sequenceFile) {
            str += " le fichier '" + this.sequenceFile.name + "'";
          } else {
            var values = this.value().split(',');
            $.each(values, function (i, value) {
              value = value.replace(new RegExp('\'', 'gi'), '');
              str += App.DataModel.referential(that.attribute().schema()).row(value).t;
              if (i == (values.length - 2)) {
                str += ' et ';
              } else if (i < (values.length - 1)) {
                str += ', ';
              }
            });
          }
        } else if (this.operator().type() == 'interval') {
          var values = this.value().split('-');
          $.each(values, function (i, value) {
            if (i == 1)
              str += ' et '
            str += App.DataModel.referential(that.attribute().schema()).row(value).t;
          });
        } else {
          str += App.DataModel.referential(that.attribute().schema()).row(that.value()).t;
        }

      } else {
        var enumLabel = function(v) {
          return $.grep(that.attribute()._enum, function(n, i) {
            return n.value == v;
          })[0].label;
        };
        if (this.operator().type() == 'interval') {
          var value1 = this.value().split('-')[0];
          var value2 = this.value().split('-')[1];
          if (this.attribute().dataType() == 'date') {
            str += $.format.date(new Date(value1.substr(0, 4), parseInt(value1.substr(4, 2)) - 1, value1.substr(6, 2)), 'dd/MM/yyyy') + ' et ' +
                    $.format.date(new Date(value2.substr(0, 4), parseInt(value2.substr(4, 2)) - 1, value2.substr(6, 2)), 'dd/MM/yyyy');
          } else if(this.attribute()._enum) {            
            str += enumLabel(value1) + " et " + enumLabel(value2);
          }
          else {
            str += value1 + ' et ' + value2;
          }
        } else if (this.operator().type() == 'sequence') {
          if (this.sequenceFile) {
            str += " le fichier '" + this.sequenceFile.name + "'";
          } else {
            var values = this.value().split(',');
            $.each(values, function (i, value) {
              if (that.attribute().dataType() == 'date') {
                value = value.replace(new RegExp('\'', 'gi'), '');
                value2 = $.format.date(new Date(value.substr(0, 4), parseInt(value.substr(4, 2)) - 1, value.substr(6, 2)), 'dd/MM/yyyy');
                str += value2.replace(new RegExp('\'', 'gi'), '');
              } else if(that.attribute()._enum) { 
                str += enumLabel(eval(value));
              } 
              else {
                str += value;
              }
              if (i == (values.length - 2)) {
                str += ' et ';
              } else if (i < (values.length - 1)) {
                str += ', ';
              }
            });
          }
        } else {
          if(this.attribute()._enum) {  
            str += enumLabel(this.value());
          } else {
            switch (this.attribute().dataType()) {
              case 'boolean':
                str += this.value() == 1 ? 'Oui' : 'Non';
                break;
              case 'date':
                str += $.format.date(new Date(this.value().substr(0, 4), parseInt(this.value().substr(4, 2)) - 1, this.value().substr(6, 2)), 'dd/MM/yyyy');
                break;
              default:
                str += this.value();
            }
          }
        }
      }
    }
    
    return str;
  };

  this.dialog = function (callback, edition) {

    var that = this, title, inputValue;
    var $content = $('<div class="criterion-form pn-form"></div>');

    function inputValueCode(setValue) {
      if (that.operator().type() == 'interval') {
        inputValue = new CriterionIntervalInput(that.inputValue());
      } else if (that.operator().type() == 'sequence') {
        inputValue = new CriterionSequenceInput(that.inputValue());
      } else {
        inputValue = that.inputValue();
      }
      if (setValue === true) {
        var value = that.value();
        if(that.sequenceFile) {
          value = {file: that.sequenceFile};
        }
        inputValue.value(value);
      }
      var $input = inputValue.$input();
      $content.append($input.$wrap);
            
      if($input.$input) {
        $input.$input.on("file:loading", function() {
          dialog.enableValid(false);
        });

        $input.$input.on("file:loaded", function() {
          dialog.enableValid(true);
        });
      }
    
    }

    function resetInput(inputs) {
      $.each(inputs, function (i, input) {
        $content.find('.criterion-' + input + '-wrap').remove();
        that['_' + input] = null;
      });
    }

    var $attr = this.$inputAttribute(function () {
      resetInput(['operation', 'typeFunction', 'operator', 'value']);
      if (that.hasTypeFunctions(that.attribute().dataType())) {
        $content.append(that.$inputTypeFunction(that.attribute().dataType(), function () {
          resetInput(['operation', 'operator', 'value']);
          if (that.attribute().linkCardinality() == 'multiple' && (that.attribute().dataType() == 'float' || that.attribute().dataType() == 'integer')) {
            $content.append(that.$inputOperation('multiple', function () {}));
          }
          if (that.attribute().name() != 'entiere') {
            $content.append(that.$inputOperator(function () {
              resetInput(['value']);
              if (that.operator().hasValue) {
                inputValueCode();
              }
            }));
          } else {
            that.operator(new Operator('isNotEmpty'));
          }
        }));
      } else {
        if (that.attribute().linkCardinality() == 'multiple' && (that.attribute().dataType() == 'float' || that.attribute().dataType() == 'integer')) {
          $content.append(that.$inputOperation('multiple', function () {}));
        }
        if (!that.entiere()) {
          $content.append(that.$inputOperator(function () {
            resetInput(['value']);
            if (that.operator().hasValue) {
              inputValueCode();
            }
          }));
        } else {
          that.operator(new Operator('isNotEmpty'));
        }
      }
    });

    $content.append($attr);

    if (edition) {
      if (!that.entiere()) {
        if (that.typeFunction() != null) {
          $content.append(that.$inputTypeFunction(that.typeFunction().type(), function () {
            resetInput(['operation', 'operator', 'value']);
            if (that.operation() != null) {
              if (that.attribute().linkCardinality() == 'multiple' && (that.attribute().dataType() == 'float' || that.attribute().dataType() == 'integer')) {
                $content.append(that.$inputOperation('multiple', function () {
                  inputValueCode();
                }));
              }
            }
            $content.append(that.$inputOperator(function () {
              resetInput(['value']);
              if (that.operator().hasValue) {
                inputValueCode();
              }
            }));
          }));
          if (that.operation() != null) {
            if (that.attribute().linkCardinality() == 'multiple' && (that.attribute().dataType() == 'float' || that.attribute().dataType() == 'integer')) {
              $content.append(that.$inputOperation('multiple', function () {
                resetInput(['value']);
                inputValueCode();
              }));
            }
          }
          $content.append(that.$inputOperator(function () {
            resetInput(['value']);
            if (that.operator().hasValue) {
              inputValueCode();
            }
          }));
          if (that.operator().hasValue)
            inputValueCode(true);
        } else {
          if (that.operation() != null) {
            if (that.attribute().linkCardinality() == 'multiple' && (that.attribute().dataType() == 'float' || that.attribute().dataType() == 'integer')) {
              $content.append(that.$inputOperation('multiple', function () {
                resetInput(['value']);
                inputValueCode();
              }));
            }
          }
          $content.append(that.$inputOperator(function () {
            resetInput(['value']);
            if (that.operator().hasValue) {
              inputValueCode();
            }
          }));
          if (that.operator().hasValue)
            inputValueCode(true);
        }
      } else {
        that.operator(new Operator('isNotEmpty'));
      }
    }
    if (edition)
      title = 'Critère \'' + this.toString() + '\'';
    else
      title = 'Nouveau critère';

    var dialog = new UI.Dialog(title, $content, {width: 1000}, function() {
      if (that.operator().hasValue) {        
        if (inputValue.file) {
          that.sequenceFile = inputValue.file;
        }
        that.value(inputValue.value());
      } else {
        that._value = null;
      }
      dialog.close();
      callback();
    });

    return dialog;
  };

  this.$inputAttribute = function (callback) {
    var that = this;
    var $wrap = $('<span class="criterion-attribute-wrap pn-form-wrap pn-form-search-wrap"></span>');
    var $button = $('<button class="k-button"><i class="icon-search"/></button>');
    var $input = $('<span class="criterion-attribute-input">' + (this.attribute() == null ? 'Sélectionner une variable' : (this.entiere() ? 'Toute la base' : this.attribute().label())) + '</span>');
    $button.click(function () {
      var dialog = App.DataModel.dialog('Sélectionner la variable', function (attribute) {
        if (attribute.type() == 'attribute' || (attribute.type() == 'link' && attribute.linkCardinality() != 'multiple')) {
          that.attribute(attribute);
          if (attribute.dataType() == 'entiere') {
            that.entiere(true);
            $input.text('Toute la base');
          } else {
            that.entiere(false);
            $input.text(attribute.label());
          }
          callback();
          dialog.close();
        }
      }, {hideQueryAttrs: true});
    });
    $wrap.append($button).append($input);
    return $wrap;
  };

  this.$inputOperator = function (callback) {
    var that = this;
    var $wrap = $('<span class="criterion-operator-wrap pn-form-wrap"></span>');
    var $input = $('<input class="criterion-operator-input"/>');
    $wrap.append($input);
    $input.kendoDropDownList({
      dataTextField: 'text',
      dataValueField: 'value', 
      dataSource: that.operators(),
      optionLabel: "Opérateur...",
      select: function (e) {
        that.operator(new Operator(this.dataItem(e.item.index()).value));
        callback();
      }
    });
    if (this.operator() != null)
      $input.data('kendoDropDownList').value(this.operator().name());
    return $wrap;
  };

  this.$inputTypeFunction = function (type, callback) {
    var that = this;
    var $wrap = $('<span class="criterion-typeFunction-wrap pn-form-wrap"></span>');
    var $input = $('<input class="criterion-typeFunction-input"/>');
    $wrap.append($input);
    var dataSource = that.typeFunctions(type);
    dataSource.unshift({text: 'Aucune', value: 'none'});
    $input.kendoComboBox({
      dataTextField: 'text', dataValueField: 'value', dataSource: dataSource,
      filter: 'contains', placeholder: 'Fonction...', select: function (e) {
        if (this.dataItem(e.item.index()).value != 'none') {
          that.typeFunction(new TypeFunction(type, this.dataItem(e.item.index()).value));
          that.attribute().dataType(that.typeFunction().returnType);
        }
        callback();
      }
    });
    if (this.typeFunction() != null)
      $input.data('kendoComboBox').value(this.typeFunction().name());
    return $wrap;
  };

  this.$inputOperation = function (type, callback) {
    var that = this;
    var $wrap = $('<span class="criterion-operation-wrap pn-form-wrap"></span>');
    var $input = $('<input class="criterion-operation-input"/>');
    $wrap.append($input);
    $input.kendoComboBox({
      dataTextField: 'text', dataValueField: 'value', dataSource: that.operations(),
      filter: 'contains', placeholder: 'Opérations...', select: function (e) {
        that.operation(new Operation(this.dataItem(e.item.index()).value));
        callback();
      }
    });
    if (this.operation() != null)
      $input.data('kendoComboBox').value(this.operation().name());
    return $wrap;
  };

  this.inputValue = function () {
    var that = this, input;
    console.log(that.attribute());
    if(that.attribute()._enum && that.attribute()._enum.length) {
      input = new CriterionEnumInput({enum: that.attribute()._enum});
    } else {
      switch (that.attribute().dataType()) {
        case 'integer':
          input = new CriterionNumberInput();
          break;
        case 'float':
          input = new CriterionNumberInput({
            format: that.attribute().format(),
            type: that.attribute().dataType()
          });
          break;
        case 'string':
          input = new CriterionStringInput();
          break;
        case 'boolean':
          input = new CriterionBooleanInput();
          break;
        case 'date':
        case 'datetime':
          input = new CriterionDateInput();
          break;
        default:
          if (that.attribute().type() == 'link') {
            if (that.attribute().hugeData()) {
              input = new CriterionHugeDataLinkInput(that.attribute().schema(), that.attribute().keyName(), that.operator().type() == 'sequence');
            } else {
              input = new CriterionLinkInput(that.attribute().schema(), that.attribute().keyName());
            }
          }
      }
    }    
    return input;
  };

  this.compute = function (done, fail) {
    var that = this;
    App.Server.Criterion.compute(
            [this.toJSON()],
            function (data) {
              that.computed(true);
              done(data);
            },
            function (data) {
              fail(data);
            }
    );
  }

}