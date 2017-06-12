function CriterionHugeDataLinkInput(schema, key, sequenced) {
    
    this._schema = schema;
    this._key = key;
    this._sequenced = sequenced;
    this._exists = false;  
    this._input = {};    
    this._availableOperators = [
        'equalsTo', 'notEqualsTo',
        'isEmpty', 'isNotEmpty', 
    ];    
    this._dataItem = null;
        
    this.value = function(value) {
        var that = this;
        if (value != null) {
            var values = value.replace(new RegExp('\'', 'gi'),'').split(',');
            var dataSource = [];
            $.each (values, function(i, value) {
                dataSource.push(App.DataModel.referential(that._schema).row(value));
            });
            this.$input().$input.data('kendoMultiSelect').setDataSource(dataSource);
            this.$input().$input.data('kendoMultiSelect').value(values);
        } else {
            return this.$input().$input.data('kendoMultiSelect').value()[0];
        }
    }    
    
    this.$input = function() {
        var that = this, params;
        if (this._exists) {
            return this._input;
        } else {
            this._exists = true;
            var $wrap = $('<span class="criterion-value-wrap pn-form-wrap"></span>');
            var $add = $('<button class="k-button">Ajouter</button>'); 
            $add.css('marginTop', '-15px');             
            $add.click(function() {
                var kGrid = $list.data('kendoGrid');
                var dataItems = $input.data('kendoMultiSelect').dataItems();
                var data = [];
                $.each (dataItems, function(i, item) {
                    data.push({v: item.v, t: item.t});
                });
                $.each (kGrid.select(), function(i, item) {
                    data.push ({
                        v: kGrid.dataItem(kGrid.select()[i]).v,
                        t: kGrid.dataItem(kGrid.select()[i]).t
                    });
                });
                var vdata = [];
                $.each (data, function(i, item) {
                   vdata.push(item.v); 
                });
                $input.data('kendoMultiSelect').setDataSource(data);
                $input.data('kendoMultiSelect').value(vdata);
            });       
            $wrap.append($add);             
            var $input = $('<div class="criterion-value-input"></div>');
            $input.css('margin', '10px');
            $wrap.append($input);             
            $input = this.init($input);  
            
            var $search_wrap = $('<div></div>');
            $wrap.append($search_wrap)
            
            var $search = $('<input placeholder="Filter les résultats" style="width: 100%" class="k-textbox"/>');
            $search_wrap.append($search);
            
            $search.on('input', function(e) {
              var value = e.target.value.toUpperCase();
              if(value.length === 0) {
                $list.data('kendoGrid').dataSource.filter([])
              } else {
                $list.data('kendoGrid').dataSource.filter({ field: 't', operator: 'contains', value: value });
              }
            });
            
            var $list = $('<div></div>');            
            $wrap.append($list);
            $list = this.list($list);
            this._input = {
                $wrap: $wrap,
                $input: $input
            }
            return this._input;
        }
    }
    
    this.init = function($input) {
        var that = this;
        var kendoParams = {
            dataTextField: 't', dataValueField: 'v',
            autoBind: true, filter: 'contains', placeholder: 'Valeur...', suggest: false,
            maxSelectedItems: that._sequenced ? null : 1
        };
        $input.kendoMultiSelect(kendoParams);
        return $input;
    }
    
    this.list = function($list) {
        var that = this;
        var dataItem = null;
        var kendoParams = {
            dataSource: {
                data: App.DataModel.referential(this._schema).data(),
                pageSize: 8
            },
            sortable: true,
            selectable: this._sequenced ? 'multiple, row' : true, 
           navigatable: true,
            filterable: true,
            pageable: {  
                messages: {
                    display: "{0} - {1} de {2} éléments",
                    empty: "Aucun élément",
                    page: "Page",
                    of: "de {0}",
                    itemsPerPage: "éléments par page",
                    first: "Première page",
                    previous: "Page précédente",
                    next: "Page suivante",
                    last: "Dernière page"
                }
            },
            columns: [{
                field: 't',
                title: 'Libellé',
                width: 120,
                filterable: true
            }],
            columnMenu: {
                messages: {
                    refresh: "Rafraîchir",
                    columns: "Choisir les colonnes",
                    filter: "Appliquer",
                    sortAscending: "Trier A-Z",
                    sortDescending: "Trier Z-A"
                }
            }
        };
        $list.kendoGrid(kendoParams);
        return $list;
    }
        
}