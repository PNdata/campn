App.UI = {
    loading: function() {
        $('body').append('<div id="app-loading">Chargement</div>');
    },
    loaded: function() {
        $('#app-loading').fadeOut('slow', function() {
            this.remove();
        });
        $('#app').show();
    }
}

App.UI.node = {
    save: { enabled: true, icon: 'upload-3', tooltip: 'Enregistrer en tant que modèle' },
    load: { enabled: true, icon: 'download-3', tooltip: 'Charger un modèle' },
    addCriterion : { enabled: true, icon: 'filter-2', tooltip: 'Ajouter un critère' },
    remove: { enabled: true, icon: 'minus', tooltip: 'Supprimer' },
    addNode: { enabled: true, icon: 'plus', tooltip: 'Ajouter un niveau' }
};

App.UI.query = {
    edit: { enabled: true, excl: true, icon: 'pencil', tooltip: 'Modifier', event: function() {
        App.Controller.Query.dialog(that); 
    }},
    remove: { enabled: true, excl: true, icon: 'minus', tooltip: 'Supprimer', event: function() {
        App.Controller.Query.remove(that);
    }},
    load: { enabled: true, excl: true, icon: 'download-3', tooltip: 'Charger un modèle', event: function() {
        that.openDialogLoad();
    }},
    save: { enabled: true, excl: true, icon: 'upload-3', tooltip: 'Enregistrer en tant que modèle', event: function() {
        App.Controller.Query.openSaveModel(that);
    }}
};

App.UI.shortcuts = [
    { value: 'save', text: 'Enregistrer', icon: 'disk', event: function() { App.Controller.Session.save(); } },
    { value: 'open', text: 'Ouvrir', icon: 'folder-open', event: function() { App.Controller.Session.open(); } },
    { value: 'new', text: 'Nouveau', icon: 'file-2', event: function() { App.Controller.Session.confirmNew(); }}
];
      

App.UI.buildShortcuts = function() {
    var $shortcuts = $("#shortcuts");
    $.each(App.UI.shortcuts, function(i, item) {
        var $item = $('<li><a href="#"><i class="icon-'+item.icon+'"></i></a></li>');
        $shortcuts.append($item);
        $item.on('click', item.event);
    });
    $('#exit').click(function() {
       App.Controller.Session.confirmExit(); 
    });
}

App.UI.menu = {
    file       : { isDefault: true, text: "Fichier", items: [
        { enabled: true, value: "new"         , text: "Nouveau"              , icon: "file-4"     , event: function() { App.Controller.Session.confirmNew(); }  },
        { enabled: true, value: "open"        , text: "Ouvrir"               , icon: "folder-open", event: function() { App.Controller.Session.open(); }        },
        { enabled: true, value: "save"        , text: "Enregistrer"          , icon: "upload-3"   , event: function() { App.Controller.Session.save(); }        },
        { enabled: true, value: "saveas"      , text: "Enregistrer sous"     , icon: "upload-3"   , event: function() { App.Controller.Session.openSaveAs(); }  },
        { enabled: true, value: "print"       , text: "Imprimer"             , icon: "print"      , event: function() { App.Controller.Session.openPrint(); }   },
        { enabled: true, value: "exit"        , text: "Quitter"              , icon: "switch"     , event: function() { App.Controller.Session.confirmExit(); } },
    ]}/*,
    edition    : { text: "Edition", items: [
        { enabled: true, value: "undo" , text: "Annuler" , icon: "undo-2" },  
        { enabled: true, value: "redo" , text: "Rétablir", icon: "redo"   }, 
        { enabled: true, value: "copy" , text: "Copier"  , icon: "copy-2" }, 
        { enabled: true, value: "cut"  , text: "Couper"  , icon: "cut"    }, 
        { enabled: true, value: "paste", text: "Coller"  , icon: "paste"  } 
    ]}*/,
    query      : { text: "Requêtage", items: [
        { enabled: true, value: "add"    , text: "Ajouter" , icon: "plus"  , event: function() {App.Controller.Query.dialog();} },
        { enabled: true, value: "play"   , text: "Lecture" , icon: "play-2"  , event: function() {
            App.Controller.Session.compute(function(){}, function(){});  
        }},  
        { enabled: true, value: "stop"   , text: "Arrêt"   , icon: "stop"  },
        //{ enabled: true, value: "report" , text: "Rapport Excel", icon: "file-excel", event: function() { App.Controller.Session.report();}},
        { enabled: true, value: 'createNodeModel', text: 'Modèles de noeud', icon: 'file', event: function() { App.Controller.Node.openCreateNodeModel(); } }
    ]},
    tools      : { text: "Outils", items: [
        { enabled: true, value: "database", text: "Dictionnaire de données", icon: "books"   , event: function() {
            App.DataModel.dialog('Base de données', function(){}, {
              commands:{
                valid: {display: false},
                cancel:{display:false}
              }});
          } },  
        { enabled: true, value: "settings", text: "Préférences"    , icon: "settings", event: function() { App.Controller.Session.openSettings();}   }
    ]},
    
    extraction: {
      text: "Extraction",
      items: [
        { enabled: true, value: "extract"  , text: "Extraire"  , icon: "upload-3"   , event: function() { App.Controller.Session.openExport(); } } ,  
        { enabled: true, value: "list"  , text: "Historique"  , icon: "history"   , event: function() { App.Controller.Session.openExtractionsList(); } } ,  
      ]
    }
  
  /*,
    nodenav    : { text: "Navigation", items: [
        { enabled: true, value: "parent"        , text: "Parent"               , icon: "arrow-left-3"       },  
        { enabled: true, value: "child"         , text: "Enfant"               , icon: "arrow-right-3"      },  
        { enabled: true, value: "olderBrother"  , text: "Frère aîné"           , icon: "arrow-up-3"         },  
        { enabled: true, value: "youngerBrother", text: "Frère cadet"          , icon: "arrow-down-3"       },  
        { enabled: true, value: "uncle"         , text: "Oncle"                , icon: "arrow-down-left-2"  },  
        { enabled: true, value: "olderChild"    , text: "Fils cadet"           , icon: "arrow-down-right-2" },  
        { enabled: true, value: "youngerChild"  , text: "Fils aîné"            , icon: "arrow-up-right-2"   },  
        { enabled: true, value: "uncle"         , text: "Oncle"                , icon: "arrow-up-left-2"    },  
        { enabled: true, value: "last"          , text: "Dernier de la branche", icon: "tab"                }
    ]},   
    display    : { text: "Affichage", items: [
        { enabled: true, value: "diagramMode", text: "Mode diagramme", icon: "share"    },  
        { enabled: true, value: "tableMode"  , text: "Mode tableau"  , icon: "table-2"  },  
        { enabled: true, value: "zoomOut"    , text: "Zoom -"        , icon: "zoomout"  },  
        { enabled: true, value: "zoomIn"     , text: "Zoom +"        , icon: "zoomin"   },  
        { enabled: true, value: "contrast"   , text: "Constraste"    , icon: "contrast" } 
    ]},  
    sendTo     : { text: "Envoyer vers", items: [
        { enabled: true, value: "email"   , text: "Email"       , icon: "mail-9"       }, 
        { enabled: true, value: "gdrive"  , text: "Google Drive", icon: "google-drive" }, 
        { enabled: true, value: "skydrive", text: "Skydrive"    , icon: "cloud-15"     }
    ]}*/,  
    help       : { text: "?", items: [
        { enabled: true, value: "help"    , text: "Aide"       , icon: "notebook"  }, 
        { enabled: true, value: "about"   , text: "A propos de", icon: "info"      , event: function() { App.openAbout() }}, 
        { enabled: true, value: "tutorial", text: "Tutorial"   , icon: "road" }
    ]}/*,  
    monitoring : { text: "Administration", items: [
        { value: "sessions", text: "Sessions"          , icon: "ftpsession"    },
        { value: "accounts", text: "Comptes"           , icon: "users-6"       }, 
        { value: "server"  , text: "Monitoring serveur", icon: "servers"       },
        { value: "config"  , text: "Configuration"     , icon: "cogs"          },
        { value: "logs"    , text: "Logs"              , icon: "rawaccesslogs" }
    ]}*/
}

App.UI.disable = function() {
    if (!$('#disable').exists()) {
        $('body').prepend('<div id="disable"></div>');   
    } 
}

App.UI.enable = function() {
    $('#disable').remove();
}

App.UI.error = function(message, details) {   
    var $content = message;
    var dialog = new UI.Dialog ('Erreur', $content, {width: 500}, function() {});
    dialog.open();
};

App.UI.state = function() {
    return {
        synch: {
            $e: $('#state-synch'),
            working: function() {
                this.$e.removeClass('state-error');
                this.$e.addClass('state-working');
                this.$e.children('.state-text').text('Synchronisation avec le serveur...');  
            },
            ready: function() {
                this.$e.removeClass('state-error').removeClass('state-working');  
                this.$e.children('.state-text').text('Prêt');  
            },
            fail: function() {
                this.$e.removeClass('state-ready');
                this.$e.removeClass('state-working');
                this.$e.addClass('state-error');          
                this.$e.children('.state-text').text('Echec de la synchronisation');
            }
        },
        save: {
            $e: $('#state-save'),
            saved: function(datetime) {
                this.$e.children('.state-text').text('Dernière sauvegarde le '+datetime);
            }
        }
    }
}

App.UI.buildMenu = function() {
    var $menu = $("#menu").addClass('flex');
    $.each(App.UI.menu, function(i, item) {
        //App.UI.menu[i] = {};
        var $item = $('<li '+(item.isDefault?'class="selected"':'')+'><a data-role="'+i+'" href="#">'+item.text+'</a></li>');
        $menu.append($item);
        var $submenu = $('<ul id="menu-'+i+'" class="submenu"></ul>').addClass('hide');
        $(item.items).each(function(j, subitem) {
            if (subitem.enabled) {
                var $subitem = $('<li><a href="#"><i class="icon-'+subitem.icon+'"></i><br/><span class="submenu-text">'+subitem.text+'</span></a></li>');
                $submenu.append($subitem);
                $subitem.on('click', subitem.event);
                //App.UI.menu[i][subitem.value] = $subitem;
            }
        });
        if (item.isDefault) $submenu.removeClass('hide').addClass('flex');
        $item.click(function() {
            $("#menu li").removeClass("selected");
            $(this).addClass("selected");
            $(".submenu").removeClass('flex').addClass('hide');
            $("#menu-"+i).removeClass('hide').addClass('flex');
        });
        $menu.after($submenu);
    });
}

App.UI.session = function() {
    return {
        $e: $('#session-name'),
        saved: function(name) {
            this.$e.text(name);
            this.$e.css('font-weight','bold');
            //App.UI.state().save.saved(datetime);
        },
        notSaved: function(name) {
            this.$e.text(name+'*');
            this.$e.css('font-weight','normal');
        }
    };
};

App.UI.error = function(message, details) {
    /*var $content = $('<p>'+message+'</p>');    
    $content.after('<p>'+details+'</p>');
    var dialog = new UI.Dialog('Erreur', $content, {
            width: 500,
            commands: {
                valid: { display: false },
                cancel: { text: 'Fermer' }
            }
        }, function(){}, function() {dialog.close()} );
    dialog.open();
    console.log(dialog.$e().closest('.k-window-titlebar'));*/
};