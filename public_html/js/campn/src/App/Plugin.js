App.Plugin = function() {};

App.Plugin.load = function(plugin) {
    
    var theParent = parent;
        
    if (plugin.data.mode != 'free') {
        
        var disabledMenuItems = {
            file: ['new', 'open', 'save', 'saveas', 'close', 'exit'],
            query: ['add']
        };    

        var addedMenuItems = {
            file: []
        };

        var disabledQueryCommands = ['copy', 'save', 'edit', 'remove'];
        var disabledNodeCommands = ['save'];

        //$('#query-list').sortable('disable');

        switch (plugin.data.mode) {   
            
            case 'targetEdition':
                addedMenuItems.file.push({
                    enabled: true,
                    value: 'finished',
                    text: 'Enregistrer',
                    icon: 'checkmark',
                    event: function() {
                        App.Controller.Session.save (function(){}, function(){});
                        App.Plugin.Pnmanager.saveTarget(function(){}, function(){});
                    }
                });
                break;
            
            case 'targetModelEdition':
                addedMenuItems.file.push({
                    enabled: true,
                    value: 'finished',
                    text: 'Enregistrer',
                    icon: 'checkmark',
                    event: function() {
                        App.Controller.Session.save (function(){}, function(){});
                        App.Plugin.Pnmanager.saveTargetModel(function(){}, function(){});
                    }
                });
                break;    
            
            case 'campaignExclusionEdition':
                addedMenuItems.file.push({
                    enabled: true,
                    value: 'finished',
                    text: 'Enregistrer',
                    icon: 'checkmark',
                    event: function() {
                        App.Controller.Session.save (function() {
                            App.Plugin.Pnmanager.saveCampaign(function(){});
                        },
                        function(){});
                    }
                });
                break;     
            
            case 'campaignExtraction':
                addedMenuItems.file.push({
                    enabled: true,
                    value: "extraction",
                    text: "Lancer l'extraction",
                    icon: "box-remove",
                    event: function() {
                        App.Plugin.Pnmanager.openExtraction();
                    }
                });
                disabledQueryCommands = disabledQueryCommands.concat(['load']);
                disabledNodeCommands = disabledNodeCommands.concat(['copy', 'load', 'addCriterion', 'edit', 'remove', 'addNode']);
                break; 
            
        }     

        $.each (App.UI.menu.file.items, function(i, item) {
           if ($.inArray(item.value, disabledMenuItems.file) > -1) {
               item.enabled = false;
           }
        });

        $.each (App.UI.menu.query.items, function(i, item) {
           if ($.inArray(item.value, disabledMenuItems.query) > -1) {
               item.enabled = false;
           }
        });

        $.each (App.UI.query, function(name, command) {
           if ($.inArray(name, disabledQueryCommands) > -1) {
               command.enabled = false;
           }
        });

        $.each (App.UI.node, function(name, command) {
           if ($.inArray(name, disabledNodeCommands) > -1) {
               command.enabled = false;
           }
        });

        $.each (addedMenuItems.file, function(i, item) {
           App.UI.menu.file.items.push(item);
        });
        
    }
    
};

App.Plugin.Pnmanager = function() {};

App.Plugin.Pnmanager.openExtraction = function() {
    var $content = $('<div class="pnmanager-extract"></div>');
    var $setlimit = $('<div class="pnmanager-extract-text">Saisir la quantité voulue pour chaque cible :</div>').hide();
    var $inputs = [];
    var $gettable = function() {
        var $table = $('<table class="pnmanager-query-list"></table>').hide();
        $.each (App.session.queries(), function(i, query) {
            if (!query.excl()) {
                var $input = $('<input class="pnmanager-extract-limit" id="pnmanager-extract-limit-'+query.id()+'" data-id="'+query.id()+'"/>');
                var $row = $('<tr></tr>');
                var $cellQuery = $('<td></td>');  
                var $cellInput = $('<td></td>');  
                var $query = query.$listItem().children('.query-details').clone();
                $query.children('.query-progressbar').remove();
                $query.children('.query-popcount').children('span')
                        .text($.formatNumber(query.popcount(),{format:"#,##0",locale:"fr"}))
                        .removeAttr('style').removeClass();
                $cellQuery.append($query);
                $cellInput.append($input);
                $row.append($cellQuery).append($cellInput);
                $table.append($row);
                query.limit(query.popcount());
                $input.kendoNumericTextBox({
                    format: '#',
                    step: 1,
                    min: 1,
                    max: query.popcount(),
                    decimals: 0,
                    value: query.popcount(),
                    change: function(e) {
                        query.limit($input.data('kendoNumericTextBox').value());
                    }
                });
                $inputs.push($input);
            } 
        });
        return $table;
    };
    if (!App.session.queriesComputed()) {
        var $text = $('<div class="pnmanager-extract-text"><div class="loading"></div>Calcul des requêtes...</div>');
        $content.append($text);
        App.Controller.Session.compute(
            function() {
                $text.fadeOut(function() {
                    var $table = $gettable();
                    $(this).replaceWith($table);
                    $table.before($setlimit.show());
                    $table.fadeIn();
                    dialog.enableValid(true);
                });                
           },
           function() {
           }
        );
    } else {
        var $table = $gettable();
        $table.before($setlimit.show());
        $content.append($setlimit.show()).append($gettable().show());
    }
    var dialog = new UI.Dialog(
        'Extraction',
        $content,
        {
            width: 500,
            commands: {
                valid: {
                    enabled: false
                }
            }
        },
        function() {
            dialog.enableValid(false);
            $($inputs).each(function(i) {
                $(this).data('kendoNumericTextBox').enable(false);
            });
            $content.find('.pnmanager-extract-text').html('<div class="loading"></div>Extraction en cours... <span id="pnmanager-extraction-progress">0%</span>');
            App.Plugin.Pnmanager.clearExtraction (
                function() {
                    App.Plugin.Pnmanager.extract (
                        function() {
                            $content.find('.pnmanager-extract-text').html('<i class="icon-checkmark"></i> Extraction terminée')
                                                                    .addClass('message-success');
                            $('#pnmanager-extraction-progress').remove();
                            clearTimeout(checkId);
                            dialog.displayValid(false);
                            dialog.cancel({ text: 'Fermer', icon:'close' });
                        },
                        function(data) {
                        }
                    );
                    var checkId = null;
                    var check = function() {
                        App.Plugin.Pnmanager.checkExtraction (
                            function(data) {
                                var $progress = $('#pnmanager-extraction-progress');
                                $progress.text(data+'%');
                                checkId = setTimeout(check, 5000);
                            },
                            function(data) {
                            }
                        );
                    }
                    check();
                },
                function(){}
            );
        },
        function() {
        }
    );            
    if (App.session.queriesComputed()) {
        dialog.enableValid(true);
    }
    dialog.open();
};


App.Plugin.Pnmanager.saveCampaign = function(done, fail) {
    var data = {
        id: App.session.exclQuery().internalId(),
        campaignId: App.session.plugin().data.campaign.id
    };
    App.Server.get('/pnmanager/campaign/save', {data: data}, done, fail);
};

App.Plugin.Pnmanager.saveTarget = function(done, fail) {
    var data = {
        id: App.session.queries()[0].internalId(),
        targetId: App.session.plugin().data.campaign.targets[0].id,
        campaignId: App.session.plugin().data.campaign.id
    };
    App.Server.get('/pnmanager/target/save', {data: data}, done, fail);    
};

App.Plugin.Pnmanager.saveTargetModel = function(done, fail) {
    var data = {
        id: App.session.queries()[0].internalId(),
        targetId: App.session.plugin().data.campaign.targets[0].id
    };
    App.Server.get('/pnmanager/targetModel/save', {data: data}, done, fail);
};

App.Plugin.Pnmanager.checkExtraction = function(done, fail) {
    var data = { id: App.session.id(), targets: [] };
    $.each (App.session.queries(), function(i, query) {
        data.targets.push({
            internalId: query.internalId(),
            id: query.id(),
            limit: query.limit()
        });
    });
    App.Server.get('/pnmanager/campaign/checkExtraction', {data: data}, 
        function(data) {
            done(data);
        },
        function(data) {
            fail(data);
        }
    );
};

App.Plugin.Pnmanager.clearExtraction = function(done, fail) {    
    var data = { id: App.session.id() };
    App.Server.get('/pnmanager/campaign/clearExtraction', {data: data}, 
        function() {
            done();
        },
        function() {
            fail();
        }
    );
};

App.Plugin.Pnmanager.extract = function(done, fail) {    
    var data = { id: App.session.id(), targets: [] };
    $.each (App.session.queries(), function(i, query) {
        data.targets.push({
            internalId: query.internalId(),
            id: query.id(),
            limit: query.limit()
        });
    });
    App.Server.get('/pnmanager/campaign/extract', {data: data}, 
        function() {
            done();
        },
        function() {
            fail();
        }
    );
};