function CriterionSequenceInput(criterionInput) {

  this._criterionInput = criterionInput;
  this._exists = false;
  this._input = {};

  this.value = function (value) {
    var that = this;
    if (value != null) {
      if (this._criterionInput.constructor.name == 'CriterionLinkInput') {
        var values = value.replace(new RegExp('\'', 'gi'), '').split(',');
        this.$input().$input.data('kendoMultiSelect').value(values);
      } else if (this._criterionInput.constructor.name == 'CriterionHugeDataLinkInput') {
        var values = value.replace(new RegExp('\'', 'gi'), '').split(',');
        var dataSource = [];
        $.each(values, function (i, value) {
          dataSource.push(App.DataModel.referential(that._criterionInput._schema).row(value));
        });
        this.$input().$input.data('kendoMultiSelect').setDataSource(dataSource);
        this.$input().$input.data('kendoMultiSelect').value(values);
      } else if (this._criterionInput.constructor.name === 'CriterionDateInput') {
        var values = [];
        $.each(value.split(','), function (i, value) {
          value = value.replace(new RegExp('\'', 'gi'), '');
          values.push($.format.date(new Date(value.substr(0, 4), value.substr(4, 2), value.substr(6, 2)), 'dd/MM/yyyy'));
        });
        this.$input().$input.val(values.join(','));
      } else {
        if(value.file) {
          that.fileMode(value.file.name);
        } else {
          this.$input().$input.val(value.replace(new RegExp('\'', 'gi'), ''));
        }
      }
    } else {
      if (this._criterionInput.constructor.name == 'CriterionLinkInput' ||
        this._criterionInput.constructor.name == 'CriterionHugeDataLinkInput') {
        var values = this.$input().$input.data('kendoMultiSelect').value();
      } else if (this._criterionInput.constructor.name === 'CriterionDateInput') {
        var values = [];
        $.each(this.$input().$input.val().split(','), function (i, value) {
          values.push($.format.date(new Date(value.substr(6, 4), value.substr(3, 2), value.substr(0, 2)), 'yyyyMMdd'));
        });
      } else {
        var values = this.$input().$input.val().split(',');
      }
      var values2 = [];
      $.each(values, function (i, value) {
        values2.push('\'' + value + '\'');
      });
      return values2.join(',');
    }
  };

  this.fileMode = function(filename) {
    var $wrap = this.$input().$wrap;
    $wrap.find(".criterion-value-wrap").hide();
    $wrap.find(".criterion-sequence-add").hide();
    $wrap.find(".criterion-sequence-value").hide();
    $wrap.find(".criterion-value-input").hide();
    $wrap.find(".criterion-sequence-file").show().val(filename);
  },

  this.$input = function () {
    var that = this;
    if (this._exists) {
      return this._input;
    } else {
      this._exists = true;
      var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
      if (this._criterionInput.constructor.name == 'CriterionLinkInput') {
        var input = clone(criterionInput);
        var $input = input.$input().$input;
        $wrap.append($input);
        $input = input.init($input, 'sequence');
      } else if (this._criterionInput.constructor.name == 'CriterionHugeDataLinkInput') {
        var $input = criterionInput.$input().$input;
        $wrap.append(criterionInput.$input().$wrap);
      } else {
        var $add = $('<button class="k-button criterion-sequence-add"><i class="icon-plus" title="Ajouter une valeur"/></button>');
        //$add.css('marginTop', '-15px');
        var $input = $("<textarea>", {class: "k-textbox criterion-sequence-value", cols: 70, rows: 5});
        var value = criterionInput.clone ? criterionInput.clone() : clone(criterionInput);
        var $value = value.$input().$input;
        $wrap.append($value);
        $wrap.append($add);
        $wrap.append($input);
        $value = value.init($value);
        $add.click(function () {
          if ($value.val() !== '') {
            $input.text($input.text() + ($input.text() !== '' ? ',' : '') + $value.val());
            $value.val('');
          }
          $value.focus();
        });

        var $uploadButton = $("<button>", {class: "k-button", html: "<i class='icon-download-3'></i> Importer une liste"}).appendTo($wrap);

        var $fileName = $("<input>", {disabled: true, class:"criterion-sequence-file k-textbox"}).appendTo($wrap).hide();
        
        $uploadButton.on("click", function () {
          $fileInput.trigger("click");
        }).appendTo($wrap);
        
        var $fileInput = $("<input>", {
          class: "criteria-sequence-file-input",
          type: "file",
          accept: ".txt, .csv"
        }).appendTo($wrap);

        $fileInput.on("change", function () {  
          var formData = new FormData();
          var file = $fileInput[0].files[0];  
          formData.append('file', file);  
          that.fileMode(file.name);
          $fileName.val("Téléchargement...");
          $uploadButton.hide();
          $input.trigger("file:loading");
          App.Server.Criterion.file(formData).done(function(data) {
            $fileName.val(file.name);
            $uploadButton.show();
            data.name = file.name;
            that.file = data;
            $input.trigger("file:loaded");
          });          
        });

      }
      this._input = {
        $wrap: $wrap,
        $input: $input
      };
      return this._input;
    }
  };

}


