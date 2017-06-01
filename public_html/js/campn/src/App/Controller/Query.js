App.Controller.Query = function() {};

App.Controller.Query.disable = function(query) {
    query.disableCommands();
    $.each(query.nodes(), function(i, node) {
        node.disableCommands(); 
    });
};

App.Controller.Query.enable = function(query) {
    query.enableCommands();
    $.each(query.nodes(), function(i, node) {
        node.enableCommands(); 
    });
};

App.Controller.Query.confirmLoadModel = function(title, callback) {
    var $content = '<div>Le contenu de la cible sera perdu, êtes-vous sûr de vouloir continuer ?</div>';
    var dialog = new UI.Dialog(title, $content, {
            width: 800,
            commands: {
                valid: { text: 'Oui' },
                cancel: { text: 'Non' }
            }
        },
        function() {
            dialog.close();
            callback();
        }
    );
    dialog.open();
};     

App.Controller.Query.modelsList = function(callback) {
    var $content = $('<div class="pn-list"></div>');   
    $content.kendoGrid({
        change: function(e) {
            if (callback != undefined) callback(e);
        },
        dataSource: { transport: { read: { url: App.config.server.url + '/query/model/list',
                                   data: { auth: App.account.auth } } }
        },
        sortable: { mode: 'single', allowUnsort: false },
        selectable: 'row', scrollable: true, resizable: true,
        /*pageable: {
          pageSize: 5,
          messages: {
            display: '{0}/{1} sessions sur {2} au total'
          }
        },*/
        columns: [
            { field: 'label', title: 'Modèle', width: 50 },
            { field: 'excl', title: 'Exclusion', width: 15 },
            { field: 'createdBy', title: 'Créé par', width: 15 },
            { field: 'creationDate', title: 'Créé le', width: 30 },
            { field: 'lastEditionDate', title: 'Modifié le', width: 30 },
        ]
    });
    return $content;
};

App.Controller.Query.openModelList = function(title, callback) {
    var $content = $('<div class="pn-form"></div>');
    var $list = App.Controller.Query.modelsList();
    $content.append($list);
    var dialog = new UI.Dialog(title, $content, { width: 800 }, function() {
        var kGrid = $list.data('kendoGrid');
        var item = kGrid.dataItem(kGrid.select());     
        callback(item);
        dialog.close();
    });
    dialog.open();
};

App.Controller.Query.openLoadModel = function(query) {var load = function(data) {
        App.UI.state().synch.working();
        App.UI.disable();
        App.Server.Query.loadModel (
            data.id,
            function(data) {   
                var nodes = JSON.parse(data.nodes);
                $.each(nodes, function(j, node_data) {
                    var parent = node_data.parent == '' ? null : node_data.parent;
                    var children = node_data.children == '' ? null : node_data.children;
                    var criteria = node_data.criteria == '' ? null : node_data.criteria;
                    node_data.parent = null;
                    node_data.children = [];   
                    node_data.criteria = [];
                    var node = query.addNode(new Node(node_data));
                    node.query(query);
                    if (parent != null) {
                        node.parent(query.node(parent)); 
                        query.node(parent).children().push(node);
                    }            
                    node.render();  
                    if (criteria != null) {
                        $.each(criteria, function(k, criterion) {
                            var crit_data = {
                                id: criterion.id,
                                operator: criterion.operator != '' ? new Operator(criterion.operator) : null,
                                operation: criterion.operation != '' ? new Operation(criterion.operation) : null,
                                typeFunction: criterion.typeFunction != '' ? new TypeFunction(App.DataModel.attribute(criterion.path).dataType(), criterion.typeFunction) : null,
                                attribute: App.DataModel.attribute(criterion.path),
                                value: criterion.value != '' ? criterion.value : null,
                                entiere: criterion.entiere == 'true' ? true : false
                            };
                            var criterion = new Criterion(crit_data);
                            node.addCriterion(criterion);
                            criterion.render();
                        });
                    }
                });                
                if (App.session.computeOnTheFly()) {
                    App.Controller.Query.computeFrom (query, function(){}, function(){});  
                }
            },
            function(data) {
                console.log(data.responseText);
                App.UI.state().synch.fail();
                App.UI.enable();
            }
        );
    };
    
    App.Controller.Query.openModelList ('Charger un modèle', function(data) {  
        if (query.nodes().length > 0) {
            App.Controller.Query.confirmLoadModel('Confirmation du chargement du modèle', function() {
                query.$tree().empty();
                query._nodes = [];
                load(data);
            });
        } else {
            load(data);
        }        
    });
    
};


App.Controller.Query.saveModel = function(query, done, fail) {
    var nodes = [];
    $.each (query.nodes(), function(i, node) {
        nodes.push(node.toJSON());
    });
    App.Server.Query.saveModel (
        query.internalId(),
        query.label(),
        query.excl(),
        nodes,
        function(data) {
            done(data);
        },
        function(data) {
            fail(data);
        }        
    );
};

App.Controller.Query.openSaveModel = function(query) {
    var $content = $('<div class="pn-form"></div>');
    var $wrap = $('<div class="pn-form-input-wrap"></div>');
    var $label = $('<label for="query-model-name">Nom</label>');
    var $input = $('<input id="query-model-name" class="k-textbox"/>');
    $input.val(query.label());
    $wrap.append($label).append($input);
    $content.append($wrap);
     var dialog = new UI.Dialog('Enregistrer en tant que modèle', $content, { width: 500 }, function() {   
         query.label($input.val());
         App.UI.state().synch.working();
         App.UI.disable();
         App.Controller.Query.saveModel(
             query,
             function() {
                App.UI.state().synch.ready();        
                App.UI.enable();
             },
             function(data) {
                console.log(data.responseText);
                App.UI.state().synch.fail();
                App.UI.enable();
             }
         );
         dialog.close();
    });
    dialog.$valid().text('Enregistrer');
    dialog.open();
};

App.Controller.Query.load = function(data) {
    var query = new Query({
        id: uid(),
        internalId: data.id,
        label:data.label,
        excl:data.excl,
        exclusivity: data.exclusivity,
        useExclusion: data.useExclusion,
        nodes:[]
    });
    if (data.excl) {
        App.session.exclQuery(query);
    } else {      
        App.session.addQuery(query);
    }    
    query.render(false);
    if (data.data == null) {
        App.Controller.Node.add(query, null);          
    } else {
        var nodes = JSON.parse(data.data);
        $.each(nodes, function(j, node_data) {
            var parent = node_data.parent == '' ? null : node_data.parent;
            var children = node_data.children == '' ? null : node_data.children;
            var criteria = node_data.criteria == '' ? null : node_data.criteria;
            node_data.parent = null;
            node_data.children = [];   
            node_data.criteria = [];
            var node = query.addNode(new Node(node_data));
            node.query(query);
            if (parent != null) {
                node.parent(query.node(parent)); 
                query.node(parent).children().push(node);
            }            
            node.render();  
            if (criteria != null) {
                $.each(criteria, function(k, criterion) {
                    var crit_data = {
                        id: criterion.id,
                        operator: criterion.operator != '' ? new Operator(criterion.operator) : null,
                        operation: criterion.operation != '' ? new Operation(criterion.operation) : null,
                        typeFunction: criterion.typeFunction != '' ? new TypeFunction(App.DataModel.attribute(criterion.path).dataType(), criterion.typeFunction) : null,
                        attribute: App.DataModel.attribute(criterion.path),
                        value: criterion.value != '' ? criterion.value : null,
                        entiere: criterion.entiere == 'true' ? true : false
                    };
                    var criterion = new Criterion(crit_data);
                    node.addCriterion(criterion);
                    criterion.render();
                });
            }
        });
    }
};

App.Controller.Query.dialog = function(query) {    
    var previousName = null;    
    var $content = $('<div class="pn-form"></div>');
    var $nameWrap = $('<div class="pn-form-input-wrap"></div>');
    var $nameLabel = $('<label for="query-name">Nom / Code Action</label>');
    var $nameInput= $('<input id="query-name" class="k-textbox"/>').val(query != null ? query.label() : 'Cible '+(App.session.queries().length+1));
    var $descWrap = $('<div class="pn-form-input-wrap"></div>');
    var $descLabel = $('<label for="query-desc">Description</label>');
    var $descInput= $('<textarea rows="10" id="query-desc" class="k-textbox"></textarea>');
    
    var $exclusionTypeWrap = $('<div class="pn-form-input-wrap"></div>');
    var $exclusionTypeLabel = $('<label for="query-exclusionType">Exclusion</label>');
    var $exclusionTypeInput= $('<input type="checkbox" id="query-exclusionType"/>').css('width', 'inherit');
    $nameWrap.append($nameLabel).append($nameInput);
    $descWrap.append($descLabel).append($descInput);
    $exclusionTypeWrap.append($exclusionTypeLabel).append($exclusionTypeInput);
    $exclusionTypeInput.on("change", function() {
      if($(this).prop("checked")) {
        previousName = $nameInput.val();
        $nameInput.val("Exclusion");
      } else {
        $nameInput.val(query ? query.label() : 'Cible '+(App.session.queries().length+1));
      }
    });
    
    var $exclusivityWrap = $('<div class="pn-form-input-wrap"></div>');
    var $exclusivityLabel = $('<label for="query-exclusivity">Exclusivité avec les cibles précédentes</label>');
    var $exclusivityInput= $('<input type="checkbox" id="query-exclusivity"/>').css('width', 'inherit').attr('checked', true);
    $exclusivityWrap.append($exclusivityLabel).append($exclusivityInput);

    var $useExclusionWrap = $('<div class="pn-form-input-wrap"></div>');
    var $useExclusionLabel = $('<label for="query-useExclusion">Utiliser l\'exclusion</label>');
    var $useExclusionInput= $('<input type="checkbox" id="query-useExclusion"/>').css('width', 'inherit').attr('checked', true);
    $useExclusionWrap.append($useExclusionLabel).append($useExclusionInput);  

    $content.append($nameWrap).append($descWrap).append($exclusionTypeWrap).append($exclusivityWrap).append($useExclusionWrap);
          
    if (query != null) {
        if (query.excl()) {
            $exclusionTypeInput.attr('checked',true);
            $exclusivityWrap.hide();
            $useExclusionWrap.hide();
        } else {
            $exclusivityInput.attr('checked', query.exclusivity());
            $useExclusionInput.attr('checked', query.useExclusion());
        }
    } else {
        $exclusivityInput.attr('checked', true);
        $useExclusionInput.attr('checked', true);
    }
    
    if (App.session.exclQueryExists()) {
        if ((query != null && query.excl()===false) || query ==null) {
            $exclusionTypeLabel.addClass('disabled');
            $exclusionTypeInput.attr('disabled','disabled');
        }
    }
        
    $exclusionTypeInput.click(function() {
        if ($(this).is(':checked')) {
            $exclusivityWrap.hide();
            $useExclusionWrap.hide();
        } else {
            $exclusivityWrap.show();
            $useExclusionWrap.show();            
        }
    });
    
    var dialog = new UI.Dialog(query!=null?query.label():'Nouvelle cible', $content, { width: 800 }, function() {
        
        if (query != null) {
            
            if ($exclusionTypeInput.is(':checked')) {
                if (!query.excl()) {
                    App.session._queries = App.session.queries().unset(App.session.queries().indexOf(query));
                    query.excl(true);
                    App.session.exclQuery(query);
                }
            } else {                
                if (query.excl()) {
                    App.session._exclQuery = null;                    
                } else {
                    var setConfig = function() {
                        query.exclusivity($exclusivityInput.is(':checked'));
                        query.useExclusion($useExclusionInput.is(':checked'));
                    };
                    if (   (query.exclusivity() != $exclusivityInput.is(':checked')
                        || query.useExclusion() != $useExclusionInput.is(':checked'))
                        && App.session.computeOnTheFly()
                    ) {
                        setConfig();
                        App.Controller.Query.computeFrom(query, function(){}, function(){});
                    } else {
                        setConfig();
                    }
                }
            }
            
            /*
            if (query.excl()) {
                var queryToComputeFrom = App.session.queries()[0];
                App.session._exclQuery = null;
            } else {
                var queryToComputeFrom = query.next();
                App.session._queries = App.session.queries().unset(App.session.queries().indexOf(query));
            }*/
            
            query.label($nameInput.val()).desc($descInput.val()).excl($exclusionTypeInput.is(':checked')).updateLabel();
           if (query.excl()) query.$toExcl();
                        else query.$toDefault();
                        
        } else {
            App.Controller.Query.add(
                $nameInput.val(),
                $descInput.val(),
                $exclusionTypeInput.is(':checked'),
                $exclusivityInput.is(':checked'),
                $useExclusionInput.is(':checked')
            );
        }        
        
        dialog.close();
    });
    dialog.open();
};

App.Controller.Query.remove = function(query) {
    var confirm = new UI.Confirm (
        'Etes-vous de vouloir supprimer la cible \''+query.label()+'\' ?',
        function() {
            query.remove();
            var queryToComputeFrom = null;
            if (query.excl()) {
                var queryToComputeFrom = App.session.queries()[0];
                App.session._exclQuery = null;
            } else {
                var queryToComputeFrom = query.next();
                App.session._queries = App.session.queries().unset(App.session.queries().indexOf(query));
            }
            if (query.excl()) {
                if (App.session.computeOnTheFly() && App.session.queries().length > 0) {
                    App.Controller.Query.computeFrom(queryToComputeFrom, function(){}, function(){});
                }
            } else {
                if (App.session.computeOnTheFly() && queryToComputeFrom != null) {
                    App.Controller.Query.computeFrom(queryToComputeFrom, function(){}, function(){});
                }
            }
        },
        function() {    
        }
    );
    confirm.open();
};

App.Controller.Query.add = function(label, desc, excl, exclusivity, useExclusion) {
    var query = new Query({
        id: uid(),
        label: label,
        desc: desc,
        excl: excl,
        exclusivity: exclusivity,
        useExclusion: useExclusion,
        popcount: null,
        nodes: []
    });
    if (excl) {
        App.session.exclQuery(query);
    } else {        
        App.session.addQuery(query);
    }
    query.render (null, function() {
        query.select();
    });
    App.Controller.Node.add(query, null);  
};




App.Controller.Query.computeNodes = function(query, done, fail) {
    App.Controller.Node.computeFrom(
        query.mainNode(),
        function(data) {
            done(data);
        },
        function(data) {
            fail(data);
        }
    );
};

App.Controller.Query.computeFrom = function(query, done, fail) {
    App.Controller.Session.disableQueryCommands();
    App.Controller.Query.compute(
        query,
        function(data) {
            if (query.hasNext()) {
                App.Controller.Query.computeFrom(query.next(), function(){done(data);}, function(){});
            } else if (query.excl()) {
                if (App.session.queries().length > 0) {
                    App.Controller.Query.computeFrom(App.session.queries()[0], function(){done(data);}, function(){});
                }
            }
            if (!query.hasNext()) {
                done(data);
                App.Controller.Session.enableQueryCommands();
            }
        },
        function(data) {
            fail(data);
        }
    );
};

App.Controller.Query.compute = function(query, done, fail) {
    query.disableCommand('edit').disableCommand('remove');
    var queryCompute = function() {
        query.compute (
            function(data) {
                computedCount++;
                query.progress(Math.floor(computedCount*100/totalCount));                                
                query.updatePopcount(function() {
                    query.hideProgressbar().resetProgress();
                });
                done(data);
            },
            function(data) {    
                console.log(data.responseText);
                if (fail != undefined) done(data);
            }
        )
    };    
    var computedCount = 0;
    query.progress(0);
    query.showProgressbar();
    if (!query.nodesComputed()) {
        var totalCount = query.nodes().length + 1;
        App.Controller.Node.computeFrom (
            query.mainNode(),
            function(data) {
                queryCompute();
            },
            function(data) {
            },
            function() {
                computedCount++;
                query.progress(Math.floor(computedCount*100/totalCount));
            }
        );        
    } else {
        var totalCount = 1;
        queryCompute();
    }
};