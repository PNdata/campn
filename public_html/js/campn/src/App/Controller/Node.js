App.Controller.Node = function() {};

App.Controller.Node.deleteModel = function(id, done, fail) {    
    App.UI.state().synch.working();
    App.UI.disable();
    App.Server.Node.deleteModel (
        id,
        function(data) {
            App.UI.state().synch.ready();        
            App.UI.enable();
            done(data);            
        },
        function(data) {
            console.log(data.responseText);
            App.UI.state().synch.fail();
            App.UI.enable();
            fail(data);
        }
    );
};

App.Controller.Node.openSaveModel = function(node) {
    node._internalId = null;
    var $content = $('<div class="pn-form"></div>');
    var $wrap = $('<div class="pn-form-input-wrap"></div>');
    var $label = $('<label for="node-model-name">Nom</label>');
    var $input = $('<input id="node-model-name" class="k-textbox"/>');
    $wrap.append($label).append($input);
    $content.append($wrap);
     var dialog = new UI.Dialog('Enregistrer en tant que modèle', $content, { width: 500 }, function() {   
         node.label($input.val());
         App.UI.state().synch.working();
         App.UI.disable();
         App.Controller.Node.saveModel(
             node,
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


App.Controller.Node.confirmLoadModel = function(title, callback) {
    var $content = '<div>Le contenu du noeud sera perdu, êtes-vous sûr de vouloir continuer ?</div>';
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

App.Controller.Node.openLoadModel = function(node) {
    var load = function(data) {
        //App.UI.state().synch.working();
        //App.UI.disable();
        App.Server.Node.loadModel (
            data.id,
            function(data) {
                var criteria = JSON.parse(data.criteria);
                if (criteria != null) {
                    $.each(criteria, function(i, criterion) {
                        var crit_data = {
                            id: uid(),
                            operator: criterion.operator != null ? new Operator(criterion.operator) : null,
                            operation: criterion.operation != null ? new Operation(criterion.operation) : null,
                            typeFunction: criterion.typeFunction != null ? new TypeFunction(App.DataModel.attribute(criterion.path).dataType(), criterion.typeFunction) : null,
                            attribute: App.DataModel.attribute(criterion.path),
                            value: criterion.value
                        };
                        var criterion = new Criterion(crit_data);
                        node.addCriterion(criterion);
                        criterion.render();
                    });
                }                          
                if (App.session.computeOnTheFly()) {
                    App.Controller.Node.computeFrom (
                        node,
                        function() {
                            App.Controller.Query.computeFrom(node.query(), function(){}, function(){});
                        },
                        function(){}
                    );
                }
            },
            function(data) {
                console.log(data.responseText);
                App.UI.state().synch.fail();
                App.UI.enable();
            }
        );
    }
    App.Controller.Node.openModelList ('Charger un modèle', function(data) {  
        if (node._criteria.length > 0) {
            App.Controller.Node.confirmLoadModel('Confirmation du chargement du modèle', function() {
                node.emptyCriteria();
                load(data);
            });
        } else {
            load(data);
        }
        
    });
};

App.Controller.Node.openModelList = function(title, callback) {
    var $content = $('<div class="pn-form"></div>');
    var $list = App.Controller.Node.modelsList();
    $content.append($list);
    var dialog = new UI.Dialog(title, $content, { width: 800 }, function() {
        var kGrid = $list.data('kendoGrid');
        var item = kGrid.dataItem(kGrid.select());     
        callback(item);
        dialog.close();
    });
    dialog.open();
};

App.Controller.Node.modelsList = function(callback) {
    var $content = $('<div class="pn-list"></div>');   
    $content.kendoGrid({
        change: function(e) {
            if (callback != undefined) callback(e);
        },
        dataSource: { transport: { read: { url: App.config.server.url + '/node/model/list',
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
            { field: 'createdBy', title: 'Créé par', width: 20 },
            { field: 'creationDate', title: 'Créé le', width: 20 },
            { field: 'lastEditionDate', title: 'Modifié le', width: 20 },
        ]
    });
    return $content;
};

App.Controller.Node.saveModel = function(node, done, fail) {
    var criteria = [];
    $.each (node.criteria(), function(i, criterion) {
        criteria.push(criterion.toJSON());
    });
    App.Server.Node.saveModel (
       node.internalId(),
       node.label(),
       JSON.stringify(criteria),
       function(data) {
           done(data);
       },
       function(data) {
           fail(data);
       }        
    );
};

App.Controller.Node.openCreateNodeModel = function() {  
        
    var node = new Node({ id: uid(), criteria: [] });
    
    var $content = $('<div id="node-model" class="pn-form"></div>');
    
    var $details = $('<div id="node-model-details"></div>');
    var $commands = $('<div id="node-model-commands"></div>');
    var $new = $('<button id="node-model-new" class="k-button"><i class="icon-file-4"></i> Nouveau</button>');
    $new.click(function() {
        node.label('Nouveau modèle de noeud');
        node._criteria = [];
        node._internalId = null;
        $labelInput.val(node.label());
        $labelWrap.show();
        $criteria.empty().show();
    });
    var $delete = $('<button id="node-model-delete" class="k-button"><i class="icon-close"></i> Supprimer</button>');
    $delete.click(function() {
         if (node.internalId() != null) {
             App.Controller.Node.deleteModel(node.internalId(), function() {
                 var kGrid = $list.data('kendoGrid');
                 var dataRow = kGrid.dataSource.get(node.internalId());
                 kGrid.dataSource.remove(dataRow);
             });
         }
    });
    var $add = $('<button id="node-model-criterion-add" class="k-button"><i class="icon-filter-2"></i> Ajouter un critère</button>');
    $commands.append($new).append($delete).append($add);
    
    var $labelWrap = $('<div class="pn-form-input-wrap"></div>');
    var $labelLabel = $('<label for="node-model-label">Nom</label>');
    var $labelInput = $('<input id="node-model-label" class="k-textbox"/>');
    $labelWrap.hide().append($labelLabel).append($labelInput);
    var $criteria = $('<div id="node-model-criteria"></div>'); 
    
    $details.append($commands).append($labelWrap).append($criteria);
    
    var $list = App.Controller.Node.modelsList(function(e) {
        var kGrid = $list.data('kendoGrid');
        var item = kGrid.dataItem(kGrid.select());        
        App.UI.state().synch.working();
        App.UI.disable();
        App.Server.Node.loadModel (
            item.id,
            function(data) {
                $labelWrap.show();
                $labelInput.val(data.label);
                node.internalId(data.id).label(data.label);
                node._criteria = [];
                var criteria = JSON.parse(data.criteria);
                $criteria.empty();
                if (criteria != null) {
                    $.each(criteria, function(i, criterion) {
                        var crit_data = {
                            id: criterion.id,
                            operator: criterion.operator != null ? new Operator(criterion.operator) : null,
                            operation: criterion.operation != null ? new Operation(criterion.operation) : null,
                            typeFunction: criterion.typeFunction != null ? new TypeFunction(App.DataModel.attribute(criterion.path).dataType(), criterion.typeFunction) : null,
                            attribute: App.DataModel.attribute(criterion.path),
                            value: criterion.value
                        };
                        var criterion = new Criterion(crit_data);
                        node.addCriterion(criterion);
                        var $criterion = $('<div class="node-model-criterion"><i class="icon-filter-2"></i> '+criterion.toString()+'</div>');
                        var $remove = $('<button class="node-model-criterion-remove"><i class="icon-close"></i></button>');      
                        $criterion.append($remove);
                        $criterion.click(function() {
                            criterion.dialog (function() {
                                $criterion.html('<i class="icon-filter-2"></i> '+criterion.toString());
                            }, true).open();
                        });
                        $criterion.hover(function() {
                            $criterion.addClass('node-model-criterion-hover');
                            $remove.show();        
                        }, function() {
                            $criterion.removeClass('node-model-criterion-hover');
                            $remove.hide();        
                        });
                        $remove.hide().click(function() {
                            $criterion.off('click');
                            node.removeCriterion(criterion);
                            $criterion.remove();
                        });
                        $criteria.append($criterion);
                    });
                }
                $criteria.show();
                App.UI.state().synch.ready();
                App.UI.enable();
            },
            function(data) {
                console.log(data.responseText);
                App.UI.state().synch.fail();
                App.UI.enable();
            }
                
        );
    });
    $list.css('width', '50%');
    
    $content.append($list).append($details).addClass('flex');
    
    $add.click(function() {
        var criterion = new Criterion();
        var dialog = criterion.dialog (function() {
            node.addCriterion(criterion);
            var $criterion = $('<div class="node-model-criterion"><i class="icon-filter-2"></i> '+criterion.toString()+'</div>');
            $criterion.click(function() {
                criterion.dialog (function() {                    
                }).open();
            });            
            $criterion.hover(function() {
                $criterion.addClass('node-model-criterion-hover');
                $remove.show();        
            }, function() {
                $criterion.removeClass('node-model-criterion-hover');
                $remove.hide();        
            });
            $criteria.append($criterion);            
            var $remove = $('<button class="node-model-criterion-remove"><i class="icon-close"></i></button>');      
            $criterion.append($remove);
            $remove.hide().click(function() {
                $criterion.off('click');
                node.removeCriterion(criterion);
                $criterion.remove();
            });
        });
        dialog.open();
    });
    var dialog = new UI.Dialog ('Modèle de noeud', $content, {width: 1000},
        function() {
            node.label($labelInput.val());
            App.Controller.Node.saveModel(
                node,
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
        }
    );
    dialog.$valid().text('Enregistrer');
    dialog.open();  
};

App.Controller.Node.add = function(query, node, parent) {    
    var session = App.session;   
    // node pas renseigné
    if (node == null) {
        var data = {
            label: parent == null ? 'Niveau 1' : 'Niveau '+parent.level()+'-'+(parent.hasChildren() ? parent.last().axis().y + 1 : 1),
            popcount: null,
            parent: parent,
            children: [],
            query: query,
            criteria: []
        };
        node = new Node(data);
        node.id(uid());
        if (node.hasParent()) parent.children().push(node);
        query.addNode(node).render();
    // node renseigné
    } else {
        node.parent(parent);
        node.query(query);
        node.children([]);
        parent.children().push(node);
        query.addNode(node).render();
    }
}

App.Controller.Node.delete = function(node) {     
    var confirm = new UI.Confirm (
        'Etes-vous de vouloir supprimer le noeud \''+node.label()+'\' ?',
        function() {
            var query = node.query();
            var newNode = null;
            if (node.hasChildren()) {
                newNode = node.first();
            } else if (node.hasNext()) {
                newNode = node.next();
            }
            node.query().removeNode(node.remove(function() {
                query.rebuildLinks();
            }));    
            if (newNode != null) {        
                if (App.session.computeOnTheFly()) {
                    App.Controller.Node.computeFrom (
                        newNode,
                        function() {
                            App.Controller.Query.computeFrom(query, function(){}, function(){});
                        },
                        function(){}
                    );
                }
            } else {
                if (App.session.computeOnTheFly()) App.Controller.Query.computeFrom(query, function(){}, function(){});
            }
        }
    );
    confirm.open();
};

App.Controller.Node.computeCriteria = function(node, done, fail) {    
    node.loading();
    /*App.UI.state().synch.working();
    App.UI.disable();*/
    $.each (node.criteria(), function(i, criterion) {
        criterion.compute(
            function(data){
                if (i == node.criteria().length) {
                    /*App.UI.state().synch.ready();
                    App.UI.enable();*/
                    done(data);
                }
            },
            function(data){
                fail(data);
            }
        );
    });
};

App.Controller.Node.computeFrom = function(node, done, fail, progression) {
	
    //console.log('progression', progression);
    App.Controller.Node.compute(
        node,
        function(data) {
            if (node.hasChildren()) {
                App.Controller.Node.computeFrom(node.first(), function(){ done(data); /*progression();*/ }, function(){}, progression);
            }
            if (node.hasNext()) {
                App.Controller.Node.computeFrom(node.next(), function(){ done(data); /*progression(); */}, function(){}, progression);
            }
            if (node.query().nodesComputed()) {
                done(data);
            }
            if(progression) progression();
        },
        function(data) {
            fail(data);
        }
    );
};

App.Controller.Node.compute = function(node, done, fail) {
    node.computed(false);
    var nodeCompute = function() {
        node.compute(
            function(data) {
                App.UI.error('Erreur survenue pendant le calcul', data.responseText);
                node.updateCount();
                done(data);                    
            },
            function(data) {    
                fail(data) ;
            }
        );
    };        
    node.loading();
    nodeCompute();
};